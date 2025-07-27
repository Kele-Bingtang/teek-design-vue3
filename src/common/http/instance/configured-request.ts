import type { RequestConfig } from "../types";
import { createRequest } from "../request";

// 带完整配置的示例实例（可在实际项目中根据需要调整）
export const configuredRequest = createRequest({
  options: {
    baseURL: import.meta.env.VITE_API_URL,
  },
  interceptors: {
    // 请求前处理
    onRequest: (config: RequestConfig) => {
      // 可以在这里添加 token 等认证信息
      // config.headers.token = useUserStore().accessToken;
      return config;
    },
    // 响应处理
    onResponse: (response: any) => {
      // 可以在这里统一处理响应数据
      return response;
    },
  },
  handlers: {
    // 全局处理器
    showLoading: () => {
      // 显示加载动画的实现
      console.log("显示加载动画");
    },
    hideLoading: () => {
      // 隐藏加载动画的实现
      console.log("隐藏加载动画");
    },
    showMessage: (message: string, type?: "success" | "warning" | "info" | "error") => {
      // 消息提示的实现
      console.log(`显示${type}消息:`, message);
    },
    logout: () => {
      // 用户登出的实现
      console.log("用户登出");
    },
    resolveError: (error: any) => {
      // 错误处理
      console.log("错误处理:", error);
    },
    refreshToken: async () => {
      // 刷新 token 的实现
      console.log("尝试刷新 token");
      // 这里应该实现实际的刷新逻辑
      // 返回 true 表示刷新成功，false 表示刷新失败
      return false;
    },
  },
});
