import { Link, Notebook } from "@element-plus/icons-vue";

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
        icon: Notebook,
      },
    },
    {
      path: "https://vue2-design.teek.top/",
      name: "Vue2Admin",
      meta: {
        title: "Kbt Vue2 Admin",
        icon: Notebook,
      },
    },
    {
      path: "https://notes.teek.top/",
      name: "Notes",
      meta: {
        title: "我的博客",
        icon: Notebook,
      },
    },
  ],
};

export default outerChainRoutes;
