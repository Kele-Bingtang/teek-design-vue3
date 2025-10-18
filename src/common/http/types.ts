import type { InternalAxiosRequestConfig } from "axios";

/**
 * Axios 额外请求配置
 */
export interface InternalRequestConfig {
  /**
   * 是否显示全局 loading
   */
  loading?: boolean;
  /**
   * 是否取消重复请求
   */
  cancel?: boolean;
  /**
   * 请求头 Content-Type 类型
   *
   * json: "application/json;charset=UTF-8"
   * form: application/x-www-form-urlencoded;charset=UTF-8
   * file: "application/form-data;charset=UTF-8"
   * multipart: "multipart/form-data;charset=UTF-8"
   * text: "text/plain;charset=UTF-8"
   * xml: "application/xml;charset=UTF-8"
   * stream: "application/octet-stream"
   */
  contentType?: "json" | "form" | "file" | "multipart" | "text" | "xml" | "stream";
  /**
   * 参数类型
   *
   * brackets: ids[]=1&ids[]=2&ids[]=3
   * comma: ids=1,2,3
   * indices: ids[0]=1&ids[1]=2&ids[]=3
   * repeat: ids=1&ids=2&ids=3
   */
  paramsType?: "brackets" | "comma" | "indices" | "repeat";
  /**
   * 响应数据的返回方式
   *
   * raw: 原始的 AxiosResponse，包括 headers、status 等，不做是否成功请求的检查
   * body: 返回响应数据的 Body 部分（只会根据 status 检查请求是否成功，忽略对 code 的判断，这种情况下应由调用方检查请求是否成功）
   * data: 解构响应的 Body 数据，只返回其中的 data 节点数据（会检查 status 和 code 是否为成功状态）
   */
  responseReturn?: "raw" | "body" | "data";
  /**
   * 缓存配置
   */
  cache?: CacheConfig;
  /**
   * 重试配置
   */
  retry?: RetryConfig;
}

/**
 * 扩展的 Axios 请求配置
 */
export type RequestConfig<D = any> = InternalRequestConfig & InternalAxiosRequestConfig<D>;

/**
 * 请求实例配置
 */
export interface RequestInstanceConfig {
  // 请求配置选项
  options?: RequestConfigOptions & InternalRequestConfig;
  // 请求拦截器配置
  interceptors?: RequestInterceptors;
  // 全局处理器配置
  handlers?: GlobalHandlers;
}

/**
 * Axios 配置
 */
export interface RequestConfigOptions {
  /**
   * 默认地址请求地址，可在 .env.xxx 文件中修改
   */
  baseURL?: string;
  /**
   * 设置超时时间（默认10s）
   */
  timeout?: number;
  /**
   * 跨域时候允许携带凭证
   */
  withCredentials?: boolean;
}

/**
 * 请求拦截器配置
 */
export interface RequestInterceptors {
  // 请求前处理
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  // 请求错误处理
  onRequestError?: (error: any) => any;
  // 响应后处理，可返回新的响应数据
  onResponse?: (response: any) => any;
  // 完全自定义响应处理
  onResponseProcess?: (response: any) => any;
  // 响应错误处理
  onResponseError?: (error: any) => any;
}

/**
 * 全局处理器配置
 */
export interface GlobalHandlers {
  // 显示加载动画
  showLoading?: () => void;
  // 隐藏加载动画
  hideLoading?: () => void;
  // 消息提示
  showMessage?: (message: string, type?: "success" | "warning" | "info" | "error") => void;
  // 用户登出处理
  logout?: () => void;
  // 错误处理
  resolveError?: (error: any) => void;
  // 刷新 token 函数
  refreshToken?: () => Promise<boolean>;
}

/**
 * 缓存配置
 */
export interface CacheConfig {
  // 是否启用缓存
  enabled: boolean;
  // 缓存最大时间（毫秒）
  ttl?: number;
  // 自定义缓存键
  key?: string;
}

/**
 * 重试配置
 */
export interface RetryConfig {
  // 重试次数
  count: number;
  // 重试延迟（毫秒）
  delay?: number;
  // 指数退避
  exponentialBackoff?: boolean;
  // 需要重试的 HTTP 状态码
  retryStatusCodes?: number[];
}
