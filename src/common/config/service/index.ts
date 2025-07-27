import type { ServiceConfig } from "./types";
import { defineServiceConfig } from "./override-config";

export { defaultServiceConfig } from "./base-config";

// 可以在这里覆盖框架默认的配置
const overrideServiceConfig: DeepPartial<ServiceConfig> = {};

// 冻结对象防止运行时修改
export const serviceConfig = Object.freeze(defineServiceConfig(overrideServiceConfig));
