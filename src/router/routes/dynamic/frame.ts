import { HotWater, Link } from "@element-plus/icons-vue";

const frameRoutes: RouterConfigRaw = {
  path: "/iframe",
  name: "IFrame",
  meta: {
    icon: Link,
    title: "外部页面",
  },
  children: [
    {
      path: "vue2-admin-open",
      name: "Vue2AdminOpen",
      meta: {
        title: "Kbt Vue2 Admin（新标签打开）",
        icon: HotWater,
        iframeSrc: "https://vue2-design.teek.top/",
        iframeOpen: true,
        useTooltip: true,
      },
    },
    {
      path: "vue2-admin",
      name: "Vue2Admin",
      meta: {
        title: "Kbt Vue2 Admin",
        icon: HotWater,
        iframeSrc: "https://vue2-design.teek.top/",
      },
    },
    {
      path: "element-plus",
      name: "FrameEp",
      meta: {
        title: "Element Plus 文档",
        icon: HotWater,
        iframeSrc: "https://element-plus.org/zh-CN/",
      },
    },
    {
      path: "vue3",
      name: "FrameVue",
      meta: {
        title: "Vue3 文档",
        icon: HotWater,
        iframeSrc: "https://cn.vuejs.org/",
        iframeKeepAlive: true,
      },
    },
    {
      path: "vite",
      name: "FrameVite",
      meta: {
        title: "Vite 文档",
        icon: HotWater,
        iframeSrc: "https://cn.vitejs.dev/",
        iframeLoading: false,
      },
    },
    {
      path: "pinia",
      name: "FramePinia",
      meta: {
        title: "Pinia 文档",
        icon: HotWater,
        iframeSrc: "https://pinia.vuejs.org/zh/index.html",
      },
    },
    {
      path: "vue-router",
      name: "FrameRouter",
      meta: {
        title: "Vue Router 文档",
        icon: HotWater,
        iframeSrc: "https://router.vuejs.org/zh/",
      },
    },
  ],
};

export default frameRoutes;
