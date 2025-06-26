import { Link, StarFilled } from "@element-plus/icons-vue";

const outerChainRoutes: RouterConfigRaw = {
  path: "/outer-chain",
  name: "OuterChain",
  meta: {
    title: "外部链接",
    icon: Link,
  },
  children: [
    {
      path: "https://github.com/Kele-Bingtang/teek-design-vue3",
      name: "Github",
      meta: {
        title: "Github",
        icon: "SVG-github",
      },
    },
    {
      path: "https://vue2-admin.youngkbt.cn/",
      name: "Vue2Admin",
      meta: {
        title: "Kbt Vue2 Admin",
        icon: StarFilled,
      },
    },
    {
      path: "https://notes.youngkbt.cn/",
      name: "Notes",
      meta: {
        title: "我的博客",
        icon: StarFilled,
      },
    },
  ],
};

export default outerChainRoutes;
