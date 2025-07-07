import { Box, StarFilled } from "@element-plus/icons-vue";

const proComponents: RouterConfigRaw = {
  path: "/pro-components",
  name: "ProComponents",
  meta: {
    title: "超级组件",
    icon: Box,
  },
  children: [
    {
      path: "/pro-table",
      redirect: "/pro-table/simple",
      name: "ProTable",
      meta: {
        title: "超级表格",
        icon: Box,
      },
      children: [
        {
          path: "simple",
          component: () => import("@/views/pro-components/pro-table/simple/index.vue"),
          name: "SimpleProTable",
          meta: {
            title: "简单 ProTable",
            icon: StarFilled,
            useI18n: false,
          },
        },
        {
          path: "advanced",
          component: () => import("@/views/pro-components/pro-table/advanced/index.vue"),
          name: "AdvancedProTable",
          meta: { title: "进阶 ProTable", icon: StarFilled, auths: ["add", "edit", "delete", "import", "export"] },
        },
        {
          path: "use",
          component: () => import("@/views/pro-components/pro-table/use/index.vue"),
          name: "UseProTable",
          meta: { title: "使用 ProTable", icon: StarFilled },
        },
        {
          path: "create",
          component: () => import("@/views/pro-components/pro-table/create/index.vue"),
          name: "CreateTable",
          meta: { title: "创建 ProTable", icon: StarFilled },
        },
        {
          path: "tree-filter",
          component: () => import("@/views/pro-components/pro-table/tree-filter/index.vue"),
          name: "ProTreeTable",
          meta: { title: "使用 ProTreeTable", icon: StarFilled },
        },
        {
          path: "complex",
          component: () => import("@/views/pro-components/pro-table/complex/index.vue"),
          name: "ComplexProTable",
          meta: { title: "复杂 ProTable", icon: StarFilled },
        },
      ],
    },
    {
      path: "/pro-form",
      redirect: "/pro-form/simple",
      name: "ProForm",
      meta: {
        title: "超级表单",
        icon: Box,
      },
      children: [
        {
          path: "simple",
          component: () => import("@/views/pro-components/pro-form/simple/index.vue"),
          name: "SimpleProForm",
          meta: { title: "简单 ProForm", icon: StarFilled },
        },
        {
          path: "use",
          component: () => import("@/views/pro-components/pro-form/use/index.vue"),
          name: "UseProForm",
          meta: { title: "使用 ProForm", icon: StarFilled },
        },
        {
          path: "create",
          component: () => import("@/views/pro-components/pro-form/create/index.vue"),
          name: "CreateProForm",
          meta: { title: "创建 ProForm", icon: StarFilled },
        },
        {
          path: "detail",
          component: () => import("@/views/pro-components/pro-form/detail/index.vue"),
          name: "DetailProForm",
          meta: { title: "详情 ProForm", icon: StarFilled },
        },
        {
          path: "simple-group",
          component: () => import("@/views/pro-components/pro-form-group/simple/index.vue"),
          name: "SimpleProFormGroup",
          meta: { title: "简单 ProFormGroup", icon: StarFilled },
        },
        {
          path: "simple-dialog",
          component: () => import("@/views/pro-components/pro-form-dialog/simple/index.vue"),
          name: "SimpleProFormDialog",
          meta: { title: "简单 ProFormDialog", icon: StarFilled },
        },
        {
          path: "simple-drawer",
          component: () => import("@/views/pro-components/pro-form-drawer/simple/index.vue"),
          name: "SimpleProFormDrawer",
          meta: { title: "简单 ProFormDrawer", icon: StarFilled },
        },
        {
          path: "simple-steps",
          component: () => import("@/views/pro-components/pro-form-steps/simple/index.vue"),
          name: "SimpleProFormSteps",
          meta: { title: "简单 ProFormSteps", icon: StarFilled },
        },
      ],
    },
    {
      path: "/pro-search",
      name: "ProSearch",
      meta: {
        notClickBread: true,
        title: "超级搜索",
        icon: Box,
      },
      children: [
        {
          path: "simple",
          name: "SimpleProSearch",
          component: () => import("@/views/pro-components/pro-search/simple/index.vue"),
          meta: { title: () => "简单 ProSearch", icon: StarFilled },
        },
        {
          path: "use",
          name: "UseProSearch",
          component: () => import("@/views/pro-components/pro-search/use/index.vue"),
          meta: { title: () => "使用 ProSearch", icon: StarFilled },
        },
        {
          path: "create",
          name: "CreateProSearch",
          component: () => import("@/views/pro-components/pro-search/create/index.vue"),
          meta: { title: () => "创建 ProSearch", icon: StarFilled },
        },
      ],
    },
    {
      path: "/pro-page",
      name: "ProPage",
      meta: {
        notClickBread: true,
        title: "超级页面",
        icon: Box,
      },
      children: [
        {
          path: "simple",
          name: "SimpleProPage",
          component: () => import("@/views/pro-components/pro-page/simple/index.vue"),
          meta: { title: () => "简单 ProPage", icon: StarFilled },
        },
        {
          path: "advanced",
          name: "AdvancedProPage",
          component: () => import("@/views/pro-components/pro-page/advanced/index.vue"),
          meta: { title: () => "进阶 ProPage", icon: StarFilled },
        },
        {
          path: "tree-filter",
          name: "ProTreePage",
          component: () => import("@/views/pro-components/pro-page/tree-filter/index.vue"),
          meta: { title: () => "使用 ProPage", icon: StarFilled },
        },
        {
          path: "complex",
          name: "ComplexProPage",
          component: () => import("@/views/pro-components/pro-page/complex/index.vue"),
          meta: { title: () => "复杂 ProPage", icon: StarFilled },
        },
      ],
    },
    {
      path: "/pro-descriptions",
      name: "ProDescriptions",
      meta: {
        notClickBread: true,
        title: "超级描述",
        icon: Box,
      },
      children: [
        {
          path: "simple",
          name: "SimpleProDescriptions",
          component: () => import("@/views/pro-components/pro-descriptions/simple/index.vue"),
          meta: { title: () => "简单 ProDescriptions", icon: StarFilled },
        },
        {
          path: "edit",
          name: "EditProDescriptions",
          component: () => import("@/views/pro-components/pro-descriptions/edit/index.vue"),
          meta: { title: () => "编辑 ProDescriptions", icon: StarFilled },
        },
      ],
    },
    {
      path: "pro-dialog",
      name: "ProDialog",
      component: () => import("@/views/pro-components/pro-dialog/index.vue"),
      meta: { title: "ProDialog 弹框", icon: StarFilled },
    },
    {
      path: "pro-drawer",
      name: "ProDrawer",
      component: () => import("@/views/pro-components/pro-drawer/index.vue"),
      meta: { title: "ProDrawer 抽屉", icon: StarFilled },
    },
    {
      path: "image-viewer",
      name: "ProImageViewer",
      component: () => import("@/views/pro-components/pro-image-viewer/index.vue"),
      meta: { title: "图片预览", icon: StarFilled },
    },
    {
      path: "pro-tree-filter",
      name: "ProTreeFilter",
      component: () => import("@/views/pro-components/pro-tree-filter/index.vue"),
      meta: { title: "树形筛选", icon: StarFilled },
    },
    // {
    //   path: "/pro-steps",
    //   name: "ProSteps",
    //   meta: {
    //     notClickBread: true,
    //     title: "超级步骤条",
    //     icon: Box,
    //   },
    //   children: [
    //     {
    //       path: "simple",
    //       name: "SimpleProSteps",
    //       component: () => import("@/views/pro-components/pro-steps/index.vue"),
    //       meta: { title: () => "简单 ProSteps", icon: StarFilled },
    //     },
    //   ],
    // },
    // {
    //   path: "/pro-transfer",
    //   name: "ProTransfer",
    //   meta: {
    //     notClickBread: true,
    //     title: "超级穿梭框",
    //     icon: Box,
    //   },
    //   children: [
    //     {
    //       path: "simple",
    //       name: "SimpleProTransfer",
    //       component: () => import("@/views/pro-components/pro-transfer/index.vue"),
    //       meta: { title: () => "简单 ProTransfer", icon: StarFilled },
    //     },
    //   ],
    // },
  ],
};

export default proComponents;
