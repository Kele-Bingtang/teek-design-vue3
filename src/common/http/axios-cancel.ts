import type { PlusAxiosRequestConfig } from ".";
import qs from "qs";

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
const pendingMap = new Map<string, AbortController>();

// 序列化参数，确保对象属性顺序一致
const sortedStringify = (obj: any) => {
  return qs.stringify(obj, { arrayFormat: "repeat", sort: (a, b) => a.localeCompare(b) });
};

// 序列化参数
export const getPendingUrl = (config: PlusAxiosRequestConfig) => {
  return [config.method, config.url, sortedStringify(config.data), sortedStringify(config.params)].join("&");
};

export class AxiosCanceler {
  /**
   * 添加请求
   *
   * @param config
   */
  addPending(config: PlusAxiosRequestConfig) {
    // 在请求开始前，对之前的请求做检查取消操作
    this.removePending(config);
    const url = getPendingUrl(config);
    const controller = new AbortController();
    config.signal = controller.signal;
    pendingMap.set(url, controller);
  }

  /**
   * 移除请求
   *
   * @param config
   */
  removePending(config: PlusAxiosRequestConfig) {
    const url = getPendingUrl(config);

    // 如果在 pending 中存在当前请求标识，需要取消当前请求并删除条目
    const controller = pendingMap.get(url);
    if (controller) {
      controller.abort();
      pendingMap.delete(url);
    }
  }

  /**
   * 清空所有 pending
   */
  removeAllPending() {
    pendingMap.forEach(controller => {
      controller && controller.abort();
    });
    pendingMap.clear();
  }

  /**
   * 重置
   */
  reset() {
    pendingMap.clear();
  }
}
