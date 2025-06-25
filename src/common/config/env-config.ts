import type { SystemConfig } from "./types";
import { createBaseConfig } from "./base-config";

const baseConfig = createBaseConfig();

/**
 * 根据环境变量动态配置 base-config
 * 开发环境：development
 * 生产环境：production
 */
export const envConfig: SystemConfig =
  process.env.NODE_ENV === "development" ? { ...baseConfig, systemInfo: { name: "Teek Design Pro" } } : baseConfig;
