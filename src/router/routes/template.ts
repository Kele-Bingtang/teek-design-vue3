import { Memo } from "@element-plus/icons-vue";

const templateRoutes: RouterConfigRaw = {
  path: "/template",
  name: "Template",
  meta: {
    icon: Memo,
    title: "模板组件",
  },
  children: [
    {
      path: "basic-card",
      name: "BasicCardTemplate",
      component: "/template/card/index",
      meta: {
        title: "基础卡片",
      },
    },
    {
      path: "banner-card",
      name: "BannerCardTemplate",
      component: "/template/banner/index",
      meta: {
        title: "横幅卡片",
      },
    },
    {
      path: "chart",
      name: "ChartTemplate",
      component: "/template/chart/index",
      meta: {
        title: "图表",
      },
    },
    {
      path: "map",
      name: "MapTemplate",
      component: "/template/map/index",
      meta: {
        title: "地图",
      },
    },
    {
      path: "chat",
      name: "ChatTemplate",
      component: "/template/chat/index",
      meta: {
        title: "聊天",
      },
    },
    {
      path: "pricing",
      name: "PricingTemplate",
      component: "/template/pricing/index",
      meta: {
        title: "定价",
      },
    },
  ],
};

export default templateRoutes;
