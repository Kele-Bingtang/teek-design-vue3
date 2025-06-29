import { ElNotification } from "element-plus";
import axios, {
  type AxiosInstance,
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import qs from "qs";
import router from "@/router";
import { isArray, isValidURL, message } from "@/common/utils";
import { useErrorLogStore, useUserStore } from "@/pinia";
import { LOGIN_URL } from "@/common/config";
import { showFullScreenLoading, tryHideFullScreenLoading } from "./service-loading";
import { ContentTypeEnum, ResultEnum } from "./http-enum";
import { AxiosCanceler } from "./axios-cancel";
import { checkStatus } from "./check-status";
import { useNamespace } from "@/composables";

const ns = useNamespace();

export interface PlusAxiosRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean;
  cancel?: boolean;
}

type AxiosRequestConfigProp<D = any> = AxiosRequestConfig<D> & {
  method: "get" | "post" | "delete" | "put" | "download";
};

const axiosCanceler = new AxiosCanceler();

/**
 * 当请求 url 携带的如下前缀（key），会替换为 http（value），如接口 url 为 /test/xx/xxx，则最终发送的请求为 https://youngkbt.cn/xx/xxx
 * @condition 接口在 header 填写 mapping: true 来开启 URL 映射功能，{ headers: { mapping: true } }
 * 详细请看 README.md 文档的 API 介绍
 */
const mappingUrl: Record<string, string> = {
  default: import.meta.env.VITE_API_URL,
  // test: "https://youngkbt.cn",
};

const config = {
  // 默认地址请求地址，可在 .env.*** 文件中修改
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

        const userStore = useUserStore();
        // 处理 url 映射
        config.headers?.mapping && processMappingUrl(config) && delete config.headers?.mapping;
        // 处理 ContentType
        config.params?._type && config.method?.toLocaleLowerCase() === "post" && processParamsType(config);
        config.params?._type === "multi" && processArray(config);
        config.params && delete config.params._type;

        // 请求头携带 Token
        config.headers.token = userStore.accessToken;
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

        const userStore = useUserStore();
        //  登陆失效（code == 401）
        if (data.code === ResultEnum.OVERDUE) {
          message.error(data.message);
          userStore.logout();
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

  // 常用请求方法封装
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

  // 全部方法请求封装
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
  const keys = Object.keys(mappingUrl);
  let url = config.url || "";
  let prefix = "";
  let index = url.indexOf("/");
  // 如果 url 开头携带 /
  if (index === 0) {
    // 去掉开头的 /，获取后面的第二个 / 位置
    const u = url.slice(1);
    index = u.indexOf("/");
    prefix = u.slice(0, index);
    // 去掉的 / 占一个数
    index += 1;
  } else prefix = url.slice(0, index);
  // 获取除 prefix 的 url
  url = url.slice(index);
  for (const key of keys) {
    if (prefix === key) {
      config.url = mappingUrl[key] + url;
      config.baseURL = "";
      break;
    }
  }
  return config;
};

/**
 * 通过 params 的 _type 属性来设置不同的 contentType
 *
 * @param config Axios 配置信息
 */
const processParamsType = (config: InternalAxiosRequestConfig) => {
  if (config.params?._type) {
    const type = config.params._type;
    if (type === "form") {
      config.headers["Content-Type"] = ContentTypeEnum.FORM_URLENCODED;
      config.data = qs.stringify(config.data);
    } else if (type === "file") config.headers["Content-Type"] = ContentTypeEnum.FILE_FORM_DATA;
    else if (type === "json") config.headers["Content-Type"] = ContentTypeEnum.JSON;
    else if (type === "info") {
      config.headers["Content-Type"] = ContentTypeEnum.Multi_FILE_FORM_DATA; // 传输数据为二进制类型，如：图片、MP3、文件
    }
  } else {
    config.headers["Content-Type"] = ContentTypeEnum.JSON;
    config.data = qs.stringify(config.data);
  }
  return config;
};
/**
 * 处理参数的数组
 *
 * @param config Axios 配置信息
 */
const processArray = (config: InternalAxiosRequestConfig) => {
  let url = String(config.url);
  if (url.indexOf("?") !== -1) url += "&";
  else url += "?";
  const keys = Object.keys(config.params);
  for (const key of keys) {
    if (!!config.params[key] || config.params[key] === 0 || config.params[key] === undefined) {
      if (isArray(config.params[key])) {
        config.params[key].forEach((item: any) => {
          url += `${key}=${item}&`;
        });
      } else url += `${key}=${config.params[key]}&`;
    }
  }
  config.params = {};
  config.url = url.slice(0, -1);
  return config;
};
/**
 * Axios 的错误提示和持久化处理
 *
 * @param error Axios 错误
 */
const processError = (error: AxiosError) => {
  const e = JSON.parse(JSON.stringify(error));
  if (Object.keys(e).includes("baseURL")) {
    const {
      config: { baseURL, url, params, method, data },
    } = JSON.parse(e);
    const requestURL = isValidURL(baseURL) ? baseURL + url : url;
    let { message } = error;
    message = message + "，token 不存在或者失效了";
    let stack = "您发送的请求为 " + method.toUpperCase() + "，您请求的地址为 " + requestURL;
    if (params) stack = stack + "，请求携带的 params 为 " + JSON.stringify(params);
    if (data) stack = stack + "，请求携带的 data 为 " + JSON.stringify(data);
    error.stack = stack;
    error.message = message;
    // 添加异常
    return {
      error,
      vm: null,
      info: "axios 请求错误",
      url: window.location.href,
      hasRead: false,
    };
  }
};

/**
 * h 手动渲染 ElNotification
 */
export const noPermission = () => {
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
