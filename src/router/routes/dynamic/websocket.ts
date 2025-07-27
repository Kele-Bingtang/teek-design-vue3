import { Discount } from "@element-plus/icons-vue";

const websocketRoutes: RouterConfigRaw = {
  path: "/websocket",
  name: "Websocket",
  meta: {
    title: "标签页操作",
    icon: Discount,
    tagText: "New",
  },
  children: [
    {
      path: "basic",
      name: "WebsocketBasic",
      component: "/websocket/index",
      meta: {
        title: "基础使用",
      },
    },
    {
      path: "advanced",
      name: "WebsocketAdvanced",
      component: "/websocket/advanced",
      meta: {
        title: "高级使用",
      },
    },
  ],
};

export default websocketRoutes;
