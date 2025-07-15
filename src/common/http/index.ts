import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { h } from "vue";
import { ElNotification } from "element-plus";
import axios from "axios";
import qs from "qs";
import { LOGIN_URL } from "@/common/config";
import { isArray, isValidURL, message, useSimpleUuid } from "@/common/utils";
import { useNamespace } from "@/composables";
import { useErrorLogStore, useUserStore } from "@/pinia";
import router from "@/router";
import { ContentTypeEnum, ResultEnum } from "./http-enum";
import { AxiosCanceler } from "./axios-cancel";
import { checkStatus } from "./check-status";
import { showFullScreenLoading, tryHideFullScreenLoading } from "./service-loading";

export interface PlusAxiosRequestConfig extends InternalAxiosRequestConfig {
  /** 是否显示全局 loading */
  loading?: boolean;
  /** 是否取消重复请求 */
  cancel?: boolean;
  /** 是否映射 url */
  mapping?: boolean;
  /** 请求头 Content-Type 类型 */
  type?: "form" | "file" | "json" | "info" | "multi";
}

// 请求配置
type AxiosRequestConfigProp<D = any> = AxiosRequestConfig<D> & {
  method: "get" | "post" | "delete" | "put" | "download";
};

const axiosCanceler = new AxiosCanceler();

/**
 * 当请求 url 携带的如下前缀（key），会替换为 http（value），如接口 url 为 /test/xx/xxx，则最终发送的请求为 https://youngkbt.cn/xx/xxx
 *
 * @condition 接口在请求配置第三个参数中填写 { mapping: true } 来开启 URL 映射功能
 */
const mappingUrl: Record<string, string> = {
  default: import.meta.env.VITE_API_URL,
  // test: "https://youngkbt.cn",
};

const config = {
  // 默认地址请求地址，可在 .env.xxx 文件中修改
  baseURL: mappingUrl.default,
  // 设置超时时间（10s）
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true,
};

class RequestHttp {
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config);

    /**
     * 请求拦截器
     */
    this.service.interceptors.request.use(
      (config: PlusAxiosRequestConfig) => {
        // 在 api 服务中通过指定的第三个参数: { cancel: false } 来控制是否拒绝重复请求
        config.cancel ??= true;
        config.cancel && axiosCanceler.addPending(config);
        // 在 api 服务中通过指定的第三个参数: { loading: false } 来控制发起请求后是否显示全局 loading
        config.loading ??= true;
        config.loading && showFullScreenLoading();

        // 处理 url 映射
        config.mapping && processMappingUrl(config);
        // 处理 ContentType
        config.type && config.method?.toLocaleLowerCase() === "post" && processParamsType(config);
        config.type === "multi" && processArray(config);

        // 请求头携带 Token
        config.headers.token = useUserStore().accessToken;
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    /**
     * 响应拦截器
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse & { config: PlusAxiosRequestConfig }) => {
        const { data, config } = response;

        // 在请求结束后，并关闭请求 loading
        config.loading && tryHideFullScreenLoading();
        // 在请求结束后，取消本次请求（防止下次重复请求）
        axiosCanceler.removePending(config);

        //  登陆失效（code == 401）
        if (data.code === ResultEnum.OVERDUE) {
          message.error(data.message);
          useUserStore().logout();
          router.replace(LOGIN_URL);
          return Promise.reject(data);
        }
        // 全局错误信息拦截（防止下载文件得时候返回数据流，没有 code，直接报错）
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          message.error(data.message);
          return Promise.reject(data);
        }
        return data;
      },
      async (error: AxiosError) => {
        const { response, config } = error;
        const errorStore = useErrorLogStore();

        // 在请求结束后，关闭请求 loading，取消重复请求缓存
        tryHideFullScreenLoading();
        axiosCanceler.removePending(config as PlusAxiosRequestConfig);

        if (error.message === "身份异常") return message.error("身份异常");
        else if (error.message.indexOf("timeout") !== -1) message.error("请求超时！请您稍后重试");
        else if (error.message.indexOf("Network Error") !== -1) message.error("网络错误！请您稍后重试");

        // 根据响应的错误状态码，做不同的处理
        if (response) checkStatus(response.status);
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        if (!window.navigator.onLine) router.replace("/500");

        const e = processError(error);
        // 添加错误日志到 store 里
        e && errorStore.addErrorLog(e);

        return Promise.reject(error);
      }
    );
  }

  // ============================== 常用请求方法封装 ==============================
  get<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.service.get(url, { params, ..._object });
  }
  post<T>(url: string, params?: object | string, _object = {}): Promise<T> {
    return this.service.post(url, params, _object);
  }
  put<T>(url: string, params?: object | string, _object = {}): Promise<T> {
    return this.service.put(url, params, _object);
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<T> {
    return this.service.delete(url, { params, ..._object });
  }
  download(url: string, params?: object, _object = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ..._object, responseType: "blob" });
  }

  // ============================== 全部方法请求封装 ==============================
  request<T, R = any>(config: AxiosRequestConfigProp<R>): Promise<T> {
    return this.service(config) as unknown as Promise<T>;
  }
}

export default new RequestHttp(config);

/**
 * 处理 url 映射
 *
 * @param config Axios 配置信息
 */
const processMappingUrl = (config: InternalAxiosRequestConfig) => {
  const url = config.url || "";
  if (!url.startsWith("/")) return config;

  // 去除开头的 /
  const urlWithoutSlash = url.slice(1);
  const firstSlashIdx = urlWithoutSlash.indexOf("/");
  // 没有第二个 /，直接返回
  if (firstSlashIdx === -1) return config;

  const prefix = urlWithoutSlash.slice(0, firstSlashIdx);
  const restUrl = urlWithoutSlash.slice(firstSlashIdx);

  if (mappingUrl[prefix]) {
    config.url = mappingUrl[prefix] + restUrl;
    config.baseURL = "";
  }

  return config;
};

/**
 * 根据 params 的 type 属性设置不同的 Content-Type，并处理 data 格式
 *
 * @param config Axios 配置信息
 */
const processParamsType = (config: PlusAxiosRequestConfig) => {
  const type = config.type as string | undefined;

  switch (type) {
    case "form":
      config.headers["Content-Type"] = ContentTypeEnum.FORM_URLENCODED;
      config.data = qs.stringify(config.data);
      break;
    case "file":
      config.headers["Content-Type"] = ContentTypeEnum.FILE_FORM_DATA;
      break;
    case "json":
      config.headers["Content-Type"] = ContentTypeEnum.JSON;
      break;
    case "info":
      config.headers["Content-Type"] = ContentTypeEnum.Multi_FILE_FORM_DATA; // 传输数据为二进制类型，如：图片、MP3、文件
      break;
    default:
      config.headers["Content-Type"] = ContentTypeEnum.JSON;
      // 仅当 data 为对象时才序列化，避免重复序列化
      if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
        config.data = JSON.stringify(config.data);
      }
      break;
  }

  return config;
};

/**
 * 处理参数的数组
 *
 * @param config Axios 配置信息
 */
const processArray = (config: PlusAxiosRequestConfig) => {
  const url = String(config.url);
  const params = config.params || {};
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    if (isArray(value)) {
      value.forEach(item => {
        // null/undefined 跳过
        if (item === undefined || item === null) return;
        searchParams.append(key, item);
      });
    } else searchParams.append(key, String(value));
  });

  // 拼接参数到 url
  const hasQuery = url.includes("?");
  const queryString = searchParams.toString();

  config.url = queryString ? url + (hasQuery ? "&" : "?") + queryString : url;
  config.params = {};
  return config;
};

/**
 * 处理 Axios 错误并格式化为错误日志对象
 *
 * @param error AxiosError 实例
 */
const processError = (error: AxiosError) => {
  // 直接从 error.config 取值，避免多余的 JSON 序列化/反序列化
  const config = error.config as PlusAxiosRequestConfig | undefined;
  if (!config) return;

  const { baseURL = "", url = "", params, method = "", data } = config;
  const requestURL = isValidURL(baseURL) ? baseURL + url : url;
  let message = error.message || "";

  if (message.includes("token") || message.includes("401")) message += "，token 不存在或者失效了";

  let stack = `您发送的请求为 ${method.toUpperCase()}，您请求的地址为 ${requestURL}`;

  if (params && Object.keys(params).length > 0) {
    stack += `，请求携带的 params 为 ${JSON.stringify(params)}`;
  }
  if (data && typeof data === "object" && Object.keys(data).length > 0) {
    stack += `，请求携带的 data 为 ${JSON.stringify(data)}`;
  }

  error.stack = stack;
  error.message = message;

  return {
    id: useSimpleUuid(),
    error,
    vm: null,
    info: "axios 请求错误",
    url: window.location.href,
    hasRead: false,
  };
};

/**
 * h 渲染 ElNotification
 */
export const noPermission = () => {
  const ns = useNamespace();
  ElNotification.closeAll();

  const notify = ElNotification({
    title: "身份异常",
    dangerouslyUseHTMLString: true,
    message: h("div", {}, [
      h("div", [
        "身份失效，您需要重新登录",
        h("strong", { style: { color: "red" } }, ["，点击确定将重新登录，"]),
        "建议登录之前，",
        h("strong", { style: { color: "red" } }, ["保存好自己的数据！"]),
      ]),
      h("div", { style: { float: "right" } }, [
        h(
          "span",
          {
            style: { marginRight: "10px", cursor: "pointer", border: ns.cssVarEl("border"), padding: "2px 8px" },
            onClick: () => closeNotify(),
          },
          ["取消"]
        ),
        h(
          "span",
          {
            style: { cursor: "pointer", border: ns.cssVarEl("border"), padding: "2px 8px" },
            onClick: () => confirmRefresh(),
          },
          ["确定"]
        ),
      ]),
    ]),
    type: "warning",
    duration: 0,
  });
  function closeNotify() {
    notify.close();
  }
  function confirmRefresh() {
    window.location.reload();
  }
};
