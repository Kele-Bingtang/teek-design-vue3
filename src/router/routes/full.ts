import { LOGIN_URL, LOGIN_NAME, REDIRECT_NAME } from "@/common/config";

/**
 * 默认全屏路由
 */
export const fullRoutes: RouterConfigRaw[] = [
  {
    path: LOGIN_URL,
    name: LOGIN_NAME,
    component: () => import("@/views/core/login/index.vue"),
    meta: { title: "登录", hideInMenu: true },
  },
  {
    path: "/redirect/:path(.*)",
    name: REDIRECT_NAME,
    meta: { hideInMenu: true },
    component: () => import("@/layout/redirect.vue"),
  },
];
