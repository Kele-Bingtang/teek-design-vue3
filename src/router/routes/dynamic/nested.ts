import { Operation, Menu, Star } from "@element-plus/icons-vue";

const nestedRoutes: RouterConfigRaw = {
  path: "/nested",
  redirect: "/nested/menu1",
  name: "Nested",
  meta: {
    title: "嵌套菜单",
    icon: Operation,
  },
  children: [
    {
      path: "menu1",
      component: () => import("@/views/nested/menu1/index.vue"),
      redirect: "/nested/menu1/menu1-1",
      name: "Menu1",
      meta: { title: "菜单 1", icon: Menu },
      children: [
        {
          path: "menu1-1",
          component: () => import("@/views/nested/menu1/menu1-1/index.vue"),
          name: "Menu1-1",
          meta: { title: "菜单 1-1", icon: Star },
        },
        {
          path: "menu1-2",
          component: () => import("@/views/nested/menu1/menu1-2/index.vue"),
          name: "Menu1-2",
          meta: { title: "菜单 1-2", icon: Star },
        },
        {
          path: "menu1-3",
          component: () => import("@/views/nested/menu1/menu1-3/index.vue"),
          redirect: "/nested/menu1/menu1-3/menu1-3-1",
          name: "Menu1-3",
          meta: { title: "菜单 1-3", icon: Star },
          children: [
            {
              path: "menu1-3-1",
              component: () => import("@/views/nested/menu1/menu1-3/menu1-3-1/index.vue"),
              name: "Menu1-3-1",
              meta: { title: "菜单 1-3-1", icon: Star },
            },
            {
              path: "menu1-3-2",
              component: () => import("@/views/nested/menu1/menu1-3/menu1-3-2/index.vue"),
              name: "Menu1-3-2",
              meta: { title: "菜单 1-3-2", icon: Star },
            },
          ],
        },
      ],
    },
    {
      path: "menu2",
      component: () => import("@/views/nested/menu2/index.vue"),
      name: "Menu2",
      meta: { title: "菜单 2", icon: Star },
    },
  ],
};

export default nestedRoutes;
