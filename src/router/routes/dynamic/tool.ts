import { Tools, DocumentCopy, Star } from "@element-plus/icons-vue";

const toolsRoutes: RouterConfigRaw = {
  path: "/tools",
  redirect: "/tools/clipboard",
  name: "Tools",
  meta: {
    title: "工具",
    icon: Tools,
    alwaysShowRoot: true,
  },
  children: [
    {
      path: "clipboard",
      name: "Clipboard",
      component: () => import("@/views/tools/clipboard/index.vue"),
      meta: { title: "文本复制", icon: DocumentCopy },
    },
    {
      path: "print",
      name: "Print",
      component: () => import("@/views/tools/print/index.vue"),
      meta: { title: "打印", icon: Star },
    },
    {
      path: "download",
      name: "Download",
      component: () => import("@/views/tools/download/index.vue"),
      meta: { title: "下载", icon: Star },
    },
    {
      path: "timeline",
      name: "Timeline",
      component: () => import("@/views/tools/timeline/index.vue"),
      meta: { title: "时间线", icon: Star },
    },
    {
      path: "pdf-preview",
      name: "PdfPreview",
      component: () => import("@/views/tools/pdf/index.vue"),
      meta: { title: "PDF 预览", icon: Star },
    },
    {
      path: "v-contextmenu",
      name: "VContextMenu",
      component: () => import("@/views/tools/v-context-menu/index.vue"),
      meta: { title: "右键菜单 1", icon: Star },
    },
    {
      path: "v-menus",
      name: "VMenus",
      component: () => import("@/views/tools/v-menus/index.vue"),
      meta: { title: "右键菜单 2", icon: Star },
    },
  ],
};

export default toolsRoutes;
