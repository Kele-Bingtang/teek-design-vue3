import { createRequest } from "../request";

// 外部 API 请求实例
export const externalRequest = createRequest({
  options: {
    baseURL: "",
    withCredentials: false, // 外部 API 通常不需要携带凭证
  },
});
