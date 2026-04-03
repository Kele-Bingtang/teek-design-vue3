import { LOGIN_URL, LOGIN_NAME, REDIRECT_NAME } from "@/common/config";

/**
 * 全屏路由，在这注册路由属于全屏路由，不加入到布局组件里
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
