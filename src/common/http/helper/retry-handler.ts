/**
 * 重试处理器
 * 用于处理 HTTP 请求的重试机制
 */
import type { AxiosError } from "axios";
import type { RequestConfig } from "../types";

export class RetryHandler {
  /**
   * 判断是否应该重试请求
   */
  public shouldRetry(error: AxiosError, config: RequestConfig): boolean {
    // 检查是否有重试配置
    if (!config.retry) return false;

    // 检查重试次数是否已达上限
    const retryCount = (config as any)._retryCount || 0;
    if (retryCount >= config.retry.count) return false;

    // 检查错误类型是否需要重试
    if (error.response) {
      // 根据配置的状态码判断是否需要重试
      const retryStatusCodes = config.retry.retryStatusCodes || [408, 429, 500, 502, 503, 504];
      return retryStatusCodes.includes(error.response.status);
    }

    // 网络错误或超时也重试
    if (
      error.code === "ECONNABORTED" ||
      (error.message && (error.message.includes("Network Error") || error.message.includes("timeout")))
    ) {
      return true;
    }

    return false;
  }

  /**
   * 执行重试
   */
  public async retry(config: RequestConfig, retryFn: () => Promise<any>): Promise<any> {
    // 增加重试次数
    const retryCount = (config as any)._retryCount || 0;
    (config as any)._retryCount = retryCount + 1;

    // 计算延迟时间
    let delay = config.retry?.delay || 1000;
    if (config.retry?.exponentialBackoff) {
      delay = delay * Math.pow(2, retryCount); // 指数退避
    }

    // 等待指定时间后重试
    await new Promise(resolve => setTimeout(resolve, delay));

    // 执行重试函数
    return retryFn();
  }
}
