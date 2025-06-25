import { createBaseConfig } from "./base-config";
import { envConfig } from "./env-config";

export * from "./constant";
export * from "./symbols";

// 系统配置
const config = {
  ...createBaseConfig(),
  ...envConfig,
};

// 冻结对象防止运行时修改
export default Object.freeze(config);
