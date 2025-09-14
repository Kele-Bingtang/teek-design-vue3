import { HotWater, Link } from "@element-plus/icons-vue";

export const iframeRoutes: RouterConfigRaw = {
  path: "/iframe",
  name: "IFrame",
  meta: {
    icon: Link,
    title: "页面嵌入",
    pointTag: true,
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
    {
      path: "iframe-page",
      name: "IFramePage",
      meta: {
        title: "IFrame 通信",
        icon: HotWater,
        iframeSrc: "/iframe-signal-page",
        useI18n: false,
        iframeKeepAlive: true,
        tagText: "New",
      },
    },
  ],
};

export const iframeSignalRoutes: RouterConfigRaw = {
  path: "/iframe-signal-page",
  name: "IFrameSignalPage",
  component: "/iframe/page",
  meta: {
    title: "通信页面",
    useI18n: false,
    isFull: true,
    hideInMenu: true, // 不显示在菜单，而是通过嵌入的方式显示
  },
};
