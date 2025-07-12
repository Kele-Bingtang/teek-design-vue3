import { Warning, Star } from "@element-plus/icons-vue";

const errorRoutes: RouterConfigRaw = {
  path: "/error",
  name: "Error",
  redirect: "/error/403",
  meta: {
    title: "错误页面",
    icon: Warning,
  },
  children: [
    {
      path: "403",
      name: "403",
      component: () => import("@/views/core/error/403.vue"),
      meta: {
        title: "403 页面",
        icon: Star,
      },
    },
    {
      path: "404",
      name: "404",
      component: () => import("@/views/core/error/404.vue"),
      meta: {
        title: "404 页面",
        icon: Star,
      },
    },
    {
      path: "500",
      name: "500",
      component: () => import("@/views/core/error/500.vue"),
      meta: {
        title: "500 页面",
        icon: Star,
      },
    },
  ],
};

export default errorRoutes;
