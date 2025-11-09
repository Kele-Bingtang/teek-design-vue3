import { coreRoutes, notFoundRoutes } from "./core";
import { fullRoutes } from "./full";
import { dynamicRoutes } from "./dynamic";

// 静态路由
const staticRoutesHight: RouterConfigRaw[] = [];
const staticRoutesLower: RouterConfigRaw[] = [];

// 常量路由（不需要权限认证）
const constantRoutes = [...coreRoutes, ...fullRoutes];
// 认证路由（需要权限认证）
const authRoutes = [...staticRoutesLower, ...dynamicRoutes, ...staticRoutesHight];

export { constantRoutes, authRoutes, notFoundRoutes };
