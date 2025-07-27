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
      name: "403View",
      component: () => import("@/views/core/error/403.vue"),
      meta: {
        title: "403",
        icon: Star,
        useI18n: false,
      },
    },
    {
      path: "404",
      name: "404View",
      component: () => import("@/views/core/error/404.vue"),
      meta: {
        title: "404",
        icon: Star,
        useI18n: false,
      },
    },
    {
      path: "500",
      name: "500View",
      component: () => import("@/views/core/error/500.vue"),
      meta: {
        title: "500",
        icon: Star,
        useI18n: false,
      },
    },
  ],
};

export default errorRoutes;
