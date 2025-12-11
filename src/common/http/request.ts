import type { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestHeaders } from "axios";
import type {
  RequestConfig,
  RequestConfigOptions,
  RequestInterceptors,
  GlobalHandlers,
  RequestInstanceConfig,
} from "./types";
import axios from "axios";
import { RequestMethodEnum, ResultEnum } from "./http-enum";
import { showFullScreenLoading, tryHideFullScreenLoading } from "./service-loading";
import { checkStatus } from "./check-status";
import { AxiosCanceler, CacheManager, getParamsSerializer, processContentType, RetryHandler } from "./helper";

const defaultOptions: RequestConfigOptions = {
  // 默认地址请求地址
  baseURL: "/",
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true,
};

export class Request {
  // Axios 实例
  service: AxiosInstance;
  // 请求配置选项
  options: RequestConfigOptions;
  // 请求拦截器配置
  interceptors: RequestInterceptors;
  // 全局处理器配置
  handlers: GlobalHandlers;
  // Axios 请求取消器
  axiosCanceler: AxiosCanceler;
  // Token 是否正在刷新
  isRefreshing: boolean = false;
  // 失败请求队列
  failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
    config: RequestConfig;
  }> = [];
  // 缓存管理器
  cacheManager: CacheManager;
  // 重试处理器
  retryHandler: RetryHandler;

  constructor(config: RequestInstanceConfig = {}) {
    const { options = {}, interceptors = {}, handlers = {} } = config;

    // 指定默认处理器
    const {
      showLoading = showFullScreenLoading,
      hideLoading = tryHideFullScreenLoading,
      showMessage = console.error,
    } = handlers;

    this.options = { ...defaultOptions, ...options };
    this.interceptors = interceptors;
    this.handlers = { ...handlers, showLoading, hideLoading, showMessage };

    this.axiosCanceler = new AxiosCanceler();
    this.cacheManager = new CacheManager();
    this.retryHandler = new RetryHandler();
    // 实例化 axios
    this.service = axios.create(this.options);

    // 初始化拦截器
    this.initInterceptors();
  }

  // ============================== 常用请求方法封装 ==============================
  get<T>(url: string, params?: object, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.service.get(url, { params, ...config });
  }
  post<T>(url: string, params?: object | string, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.service.post(url, params, config);
  }
  put<T>(url: string, params?: object | string, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.service.put(url, params, config);
  }
  delete<T>(url: string, params?: any, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.service.delete(url, { params, ...config });
  }
  download(url: string, params?: object, config: Partial<RequestConfig> = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ...config, responseType: "blob" });
  }

  // ============================== 全部方法请求封装 ==============================
  request<T, R = any>(config: Partial<RequestConfig<R>>): Promise<T> {
    return this.service(config) as unknown as Promise<T>;
  }

  /**
   * 初始化拦截器
   */
  private initInterceptors() {
    // 请求拦截器
    this.service.interceptors.request.use(
      async (config: RequestConfig) => {
        // 尝试从缓存获取数据
        if (this.getMethod(config) === RequestMethodEnum.GET) {
          const response = this.getResponseFromCache(config);
          if (response) return response;
        }

        // 用户自定义请求前处理
        if (this.interceptors.onRequest) config = await this.interceptors.onRequest(config);

        // 在 api 服务中通过指定的第三个参数: { cancel: false } 来控制是否拒绝重复请求
        config.cancel ??= false;
        config.cancel && this.axiosCanceler.addPending(config);
        // 在 api 服务中通过指定的第三个参数: { loading: false } 来控制发起请求后是否显示全局 loading
        config.loading ??= false;
        config.loading && this.handlers.showLoading?.();

        // 处理 ContentType
        config.contentType && this.getMethod(config) === RequestMethodEnum.POST && processContentType(config);
        // 处理 get 请求的参数
        if (config.paramsType && this.getMethod(config) === RequestMethodEnum.GET) {
          config.paramsSerializer = getParamsSerializer(config.paramsType);
        }

        return config;
      },
      (error: AxiosError) => {
        // 用户自定义请求错误处理
        if (this.interceptors.onRequestError) {
          return this.interceptors.onRequestError(error);
        }
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.service.interceptors.response.use(
      (response: AxiosResponse & { config: RequestConfig }) => {
        const { config, status } = response;
        let { data } = response;

        // 缓存 GET 请求响应数据
        this.getMethod(config) === RequestMethodEnum.GET && this.setResponseCache(config, data);

        // 在请求结束后，并关闭请求 loading
        config.loading && this.handlers.hideLoading?.();
        // 在请求结束后，取消本次请求（防止下次重复请求）
        this.axiosCanceler.removePending(config);

        // 用户自定义响应处理
        if (this.interceptors.onResponseProcess) return this.interceptors.onResponseProcess(response) ?? data;
        if (this.interceptors.onResponse) data = this.interceptors.onResponse(response) ?? data;

        if (config.responseReturn === "raw") return response;
        if (status < 200 && status >= 400) return Promise.reject(response);
        if (config.responseReturn === "body") return data;

        // 登陆失效
        if (data.code && data.code === ResultEnum.LOGIN) {
          // 处理刷新 token 的逻辑
          if (this.handlers.refreshToken) return this.handleRefreshToken(response);

          // 如果没有配置刷新 token 的函数，则直接走失败逻辑
          data.message && this.handlers.showMessage?.(data.message, "error");

          // 执行登出操作
          this.handlers.logout && this.handlers.logout();

          return Promise.reject(data);
        }

        // 错误信息
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          data.message && this.handlers.showMessage?.(data.message, "error");

          return Promise.reject(data);
        }

        return data;
      },
      async (error: AxiosError) => {
        const { config } = error;
        const requestConfig = config as RequestConfig;

        // 处理重试逻辑
        if (requestConfig.retry && this.retryHandler.shouldRetry(error, requestConfig)) {
          return this.retryHandler.retry(requestConfig, () => this.service.request(requestConfig));
        }

        // 在请求结束后，关闭请求 loading，取消重复请求缓存
        tryHideFullScreenLoading();
        this.axiosCanceler.removePending(requestConfig);

        // 处理错误
        this.handlers.resolveError && this.handlers.resolveError(error);

        // 用户自定义响应错误处理
        if (this.interceptors.onResponseError) return this.interceptors.onResponseError(error);

        // 网络错误处理
        if (error.message.indexOf("timeout") !== -1) {
          this.handlers.showMessage?.("请求超时！请您稍后重试", "error");

          return Promise.reject(error);
        }

        if (error.message.indexOf("Network Error") !== -1) {
          this.handlers.showMessage?.("网络错误！请您稍后重试", "error");

          return Promise.reject(error);
        }

        // 根据响应的错误状态码，做不同的处理
        if (error.response) this.handlers.showMessage?.(checkStatus(error.response.status), "error");

        return Promise.reject(error);
      }
    );
  }

  private getMethod(config: RequestConfig) {
    return config.method?.toUpperCase();
  }

  /**
   * 处理 token 刷新逻辑
   *
   * @param response 原始响应
   * @returns 重新请求的结果或失败的 Promise
   */
  private async handleRefreshToken(response: AxiosResponse & { config: RequestConfig }) {
    const { data, config } = response;

    // 将刷新 token 的请求加入队列
    const retryOriginalRequest = new Promise((resolve, reject) => {
      this.failedQueue.push({ resolve, reject, config });
    });

    // 如果正在刷新 token，则返回队列中的 Promise
    if (this.isRefreshing) return retryOriginalRequest;

    // 设置正在刷新的标志
    this.isRefreshing = true;

    try {
      // 调用刷新 token 的函数
      const refreshResult = await this.handlers.refreshToken?.();

      if (refreshResult) {
        // 刷新成功，重新发送队列中的请求
        this.processQueue(null);
        // 重新发送当前请求
        return this.service(config);
      } else {
        // 刷新失败，清空队列并拒绝所有请求
        this.processQueue(new Error("Token 刷新失败"));
        throw new Error(data.message);
      }
    } catch (error) {
      // 刷新失败，清空队列并拒绝所有请求
      this.processQueue(error);

      // 显示错误消息
      this.handlers.showMessage?.(data.message, "error");

      // 执行登出操作
      this.handlers.logout && this.handlers.logout();

      throw error;
    } finally {
      // 重置刷新状态
      this.isRefreshing = false;
    }
  }

  /**
   * 处理请求队列
   *
   * @param error 错误信息，如果有则拒绝所有请求
   */
  private processQueue(error: any) {
    this.failedQueue.forEach(({ resolve, reject, config }) => {
      if (error) reject(error);
      else this.service(config).then(resolve).catch(reject); // 重新发送请求
    });

    // 清空队列
    this.failedQueue = [];
  }

  /**
   * 从缓存获取之前的响应数据
   */
  private getResponseFromCache(config: RequestConfig) {
    if (!config.cache?.enabled) return;

    // 处理缓存
    const cacheKey = this.cacheManager.generateCacheKey(config, config.cache.key);
    const cachedResponse = this.cacheManager.get(cacheKey, config.cache.ttl);

    if (cachedResponse) {
      // 如果有缓存，直接返回缓存数据
      return Promise.resolve({
        ...config,
        data: cachedResponse,
        status: 200,
        statusText: "OK",
        headers: {} as AxiosRequestHeaders,
      });
    }
  }

  /**
   * 设置响应缓存
   */
  private setResponseCache(config: RequestConfig, data: any): void {
    if (!config.cache?.enabled) return;

    // 缓存 GET 请求响应
    const cacheKey = this.cacheManager.generateCacheKey(config, config.cache.key);
    this.cacheManager.set(cacheKey, data, config.cache.ttl);
  }

  /**
   * 清除所有缓存
   */
  public clearCache(): void {
    this.cacheManager.clear();
  }

  /**
   * 根据键清除特定缓存
   */
  public clearCacheByKey(key: string): void {
    this.cacheManager.delete(key);
  }
}

/**
 * 创建请求实例的工厂函数
 *
 * @param config 请求实例配置
 * @returns Request 实例
 */
export function createRequest(config?: RequestInstanceConfig): Request {
  return new Request(config);
}
