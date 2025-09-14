import type { ServiceConfig } from "./types";

/**
 * 根据环境变量创建配置
 */
export const defineEnvServiceConfig = (): DeepPartial<ServiceConfig> => {
  const isDev = import.meta.env.MODE === "development";
  const isTest = import.meta.env.MODE === "test";
  const isProd = import.meta.env.MODE === "production";

  // 本地环境
  if (isDev) {
    return {} as DeepPartial<ServiceConfig>;
  }

  // 测试环境
  if (isTest) {
    return {} as DeepPartial<ServiceConfig>;
  }

  // 生产环境
  if (isProd) {
    return {} as DeepPartial<ServiceConfig>;
  }

  return {};
};
