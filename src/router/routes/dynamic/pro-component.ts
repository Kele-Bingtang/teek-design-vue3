import { Film } from "@element-plus/icons-vue";

const proComponents: RouterConfigRaw = {
  path: "/pro",
  name: "ProComponents",
  meta: {
    title: "超级组件",
    icon: Film,
    tagText: "Hot",
    tagProps: { type: "danger" },
  },
  children: [
    {
      path: "/pro-table",
      redirect: "/pro-table/simple",
      name: "ProTable",
      meta: { title: "超级表格" },
      children: [
        {
          path: "simple",
          component: () => import("@/views/pro/pro-table/simple/index.vue"),
          name: "SimpleProTable",
          meta: { title: "简单 ProTable" },
        },
        {
          path: "advanced",
          component: () => import("@/views/pro/pro-table/advanced/index.vue"),
          name: "AdvancedProTable",
          meta: { title: "进阶 ProTable", auths: ["add", "edit", "delete", "import", "export"] },
        },
        {
          path: "use",
          component: () => import("@/views/pro/pro-table/use/index.vue"),
          name: "UseProTable",
          meta: { title: "使用 ProTable" },
        },
        {
          path: "create",
          component: () => import("@/views/pro/pro-table/create/index.vue"),
          name: "CreateTable",
          meta: { title: "创建 ProTable" },
        },
        {
          path: "tree-filter-table",
          component: () => import("@/views/pro/pro-table/tree-filter/index.vue"),
          name: "ProTreeTable",
          meta: { title: "使用 ProTreeTable" },
        },
        {
          path: "complex",
          component: () => import("@/views/pro/pro-table/complex/index.vue"),
          name: "ComplexProTable",
          meta: { title: "复杂 ProTable" },
        },
        {
          path: "pressure",
          component: () => import("@/views/pro/pro-table/pressure/index.vue"),
          name: "PressureProTable",
          meta: {
            title: "压测 ProTable",
            useI18n: false,
          },
        },
      ],
    },
    {
      path: "/pro-form",
      redirect: "/pro-form/simple",
      name: "ProForm",
      meta: { title: "超级表单" },
      children: [
        {
          path: "simple",
          component: () => import("@/views/pro/pro-form/simple/index.vue"),
          name: "SimpleProForm",
          meta: { title: "简单 ProForm" },
        },
        {
          path: "use",
          component: () => import("@/views/pro/pro-form/use/index.vue"),
          name: "UseProForm",
          meta: { title: "使用 ProForm" },
        },
        {
          path: "create",
          component: () => import("@/views/pro/pro-form/create/index.vue"),
          name: "CreateProForm",
          meta: { title: "创建 ProForm" },
        },
        {
          path: "detail",
          component: () => import("@/views/pro/pro-form/detail/index.vue"),
          name: "DetailProForm",
          meta: { title: "详情 ProForm" },
        },
        {
          path: "simple-group",
          component: () => import("@/views/pro/pro-form-group/simple/index.vue"),
          name: "SimpleProFormGroup",
          meta: { title: "简单 ProFormGroup" },
        },
        {
          path: "simple-dialog",
          component: () => import("@/views/pro/pro-form-dialog/simple/index.vue"),
          name: "SimpleProFormDialog",
          meta: { title: "简单 ProFormDialog" },
        },
        {
          path: "simple-drawer",
          component: () => import("@/views/pro/pro-form-drawer/simple/index.vue"),
          name: "SimpleProFormDrawer",
          meta: { title: "简单 ProFormDrawer" },
        },
        {
          path: "simple-steps",
          component: () => import("@/views/pro/pro-form-steps/simple/index.vue"),
          name: "SimpleProFormSteps",
          meta: { title: "简单 ProFormSteps" },
        },
      ],
    },
    {
      path: "/pro-search",
      name: "ProSearch",
      meta: {
        notClickBread: true,
        title: "超级搜索",
      },
      children: [
        {
          path: "simple",
          name: "SimpleProSearch",
          component: () => import("@/views/pro/pro-search/simple/index.vue"),
          meta: { title: () => "简单 ProSearch" },
        },
        {
          path: "use",
          name: "UseProSearch",
          component: () => import("@/views/pro/pro-search/use/index.vue"),
          meta: { title: () => "使用 ProSearch" },
        },
        {
          path: "create",
          name: "CreateProSearch",
          component: () => import("@/views/pro/pro-search/create/index.vue"),
          meta: { title: () => "创建 ProSearch" },
        },
      ],
    },
    {
      path: "/pro-page",
      name: "ProPage",
      meta: {
        notClickBread: true,
        title: "超级页面",
      },
      children: [
        {
          path: "simple",
          name: "SimpleProPage",
          component: () => import("@/views/pro/pro-page/simple/index.vue"),
          meta: { title: () => "简单 ProPage", tagText: "v2.0.0" },
        },
        {
          path: "advanced",
          name: "AdvancedProPage",
          component: () => import("@/views/pro/pro-page/advanced/index.vue"),
          meta: { title: () => "进阶 ProPage" },
        },
        {
          path: "create",
          component: () => import("@/views/pro/pro-page/create/index.vue"),
          name: "CreateProPage",
          meta: { title: "创建 ProPage" },
        },
        {
          path: "tree-filter",
          name: "ProTreePage",
          component: () => import("@/views/pro/pro-page/tree-filter/index.vue"),
          meta: { title: () => "使用 ProPage" },
        },
        {
          path: "complex",
          name: "ComplexProPage",
          component: () => import("@/views/pro/pro-page/complex/index.vue"),
          meta: { title: () => "复杂 ProPage" },
        },
      ],
    },
    {
      path: "/pro-descriptions",
      name: "ProDescriptions",
      meta: {
        notClickBread: true,
        title: "超级描述",
      },
      children: [
        {
          path: "simple",
          name: "SimpleProDescriptions",
          component: () => import("@/views/pro/pro-descriptions/simple/index.vue"),
          meta: { title: () => "简单 ProDescriptions" },
        },
        {
          path: "edit",
          name: "EditProDescriptions",
          component: () => import("@/views/pro/pro-descriptions/edit/index.vue"),
          meta: { title: () => "编辑 ProDescriptions" },
        },
      ],
    },
    {
      path: "pro-dialog",
      name: "ProDialog",
      component: () => import("@/views/pro/pro-dialog/index.vue"),
      meta: { title: "ProDialog 弹框" },
    },
    {
      path: "pro-drawer",
      name: "ProDrawer",
      component: () => import("@/views/pro/pro-drawer/index.vue"),
      meta: { title: "ProDrawer 抽屉" },
    },
    {
      path: "image-viewer",
      name: "ProImageViewer",
      component: () => import("@/views/pro/pro-image-viewer/index.vue"),
      meta: { title: "图片预览" },
    },
    {
      path: "tree-filter",
      name: "TreeFilter",
      component: () => import("@/views/pro/tree-filter/index.vue"),
      meta: { title: "树形筛选" },
    },
    {
      path: "/pro-tabs",
      name: "ProTabs",
      component: () => import("@/views/pro/pro-tabs/index.vue"),
      meta: {
        notClickBread: true,
        title: "超级标签页",
        tagText: "New",
        tagProps: { type: "danger" },
      },
    },
    // {
    //   path: "/pro-steps",
    //   name: "ProSteps",
    //   meta: {
    //     notClickBread: true,
    //     title: "超级步骤条",
    //   },
    //   children: [
    //     {
    //       path: "simple",
    //       name: "SimpleProSteps",
    //       component: () => import("@/views/pro/pro-steps/index.vue"),
    //       meta: { title: () => "简单 ProSteps"},
    //     },
    //   ],
    // },
    // {
    //   path: "/pro-transfer",
    //   name: "ProTransfer",
    //   meta: {
    //     notClickBread: true,
    //     title: "超级穿梭框",
    //
    //   },
    //   children: [
    //     {
    //       path: "simple",
    //       name: "SimpleProTransfer",
    //       component: () => import("@/views/pro/pro-transfer/index.vue"),
    //       meta: { title: () => "简单 ProTransfer"},
    //     },
    //   ],
    // },
  ],
};

export default proComponents;
