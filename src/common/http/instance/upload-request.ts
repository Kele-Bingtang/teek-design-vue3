import { createRequest } from "../request";

// 文件上传专用请求实例
export const uploadRequest = createRequest({
  options: {
    baseURL: "/upload",
    timeout: 30000, // 上传文件时增加超时时间
  },
});
