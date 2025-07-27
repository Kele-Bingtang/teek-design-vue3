import { createRequest } from "../request";

// Mock API请求实例
export const mockRequest = createRequest({
  options: {
    baseURL: "/mock",
    timeout: 5000,
  },
});
