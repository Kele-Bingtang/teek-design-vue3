import { User, Bell } from "@element-plus/icons-vue";
import {
  HOME_URL,
  LAYOUT_NAME,
  NOT_FOUND,
  FORBIDDEN_NAME,
  FORBIDDEN_URL,
  SERVER_ERROR_NAME,
  SERVER_ERROR_URL,
  GATEWAY_TIMEOUT_NAME,
  GATEWAY_TIMEOUT_URL,
} from "@/common/config";

// 错误提示路由
const errorRouter: RouterConfigRaw[] = [
  {
    path: FORBIDDEN_URL,
    name: FORBIDDEN_NAME,
    component: () => import("@/views/core/error/403.vue"),
    meta: { title: "403", hideInMenu: true, hideInBread: true, isFull: true },
  },
  {
    path: SERVER_ERROR_URL,
    name: SERVER_ERROR_NAME,
    component: () => import("@/views/core/error/404.vue"),
    meta: { title: "404", hideInMenu: true, hideInBread: true, isFull: true },
  },
  {
    path: GATEWAY_TIMEOUT_URL,
    name: GATEWAY_TIMEOUT_NAME,
    component: () => import("@/views/core/error/500.vue"),
    meta: { title: "500", hideInMenu: true, hideInBread: true, isFull: true },
  },
];

// 核心路由
export const coreRoutes: RouterConfigRaw[] = [
  {
    path: "/",
    name: LAYOUT_NAME,
    component: () => import("@/layout/index.vue"),
    redirect: HOME_URL,
    children: [
      {
        path: "/error-log",
        name: "ErrorLog",
        component: () => import("@/views/core/errorLog/index.vue"),
        meta: { title: "错误日志", isKeepAlive: false },
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: { title: "我的主页", icon: User },
      },
      {
        path: "/message",
        name: "Message",
        component: () => import("@/views/message/index.vue"),
        meta: { title: "我的消息", icon: Bell },
      },
    ],
  },
  ...errorRouter,
];

/**
 * notFoundRouter(找不到路由)
 */
export const notFoundRoutes = {
  path: "/:pathMatch(.*)*",
  name: NOT_FOUND,
  meta: { hideInMenu: true },
  redirect: { name: SERVER_ERROR_NAME },
};
