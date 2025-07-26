import { Notification, Star } from "@element-plus/icons-vue";

const tableRoutes: RouterConfigRaw = {
  path: "/table",
  name: "Table",
  meta: {
    title: "表格",
    icon: Notification,
  },
  children: [
    {
      path: "drag-table",
      name: "DragTable",
      component: () => import("@/views/table/drag-table/index.vue"),
      meta: { title: "表格拖拽", icon: Star, roles: ["A"] },
    },
    {
      path: "dynamic-table",
      name: "DynamicTable",
      component: () => import("@/views/table/dynamic-table/index.vue"),
      meta: { title: "动态表格添加", icon: Star },
    },
    {
      path: "inline-table",
      name: "InlineTable",
      component: () => import("@/views/table/inline-table/index.vue"),
      meta: { title: "内联表格编辑", icon: Star },
    },
    {
      path: "search-table",
      name: "SearchTable",
      component: () => import("@/views/table/search-table/index.vue"),
      meta: { title: "表格查询", icon: Star },
    },
    {
      path: "page-table",
      name: "PageTable",
      component: () => import("@/views/table/page-table/index.vue"),
      meta: { title: "表格分页", icon: Star },
    },
    {
      path: "operate-table",
      name: "OperateTable",
      component: () => import("@/views/table/operate-table/index.vue"),
      meta: { title: "表格操作", icon: Star },
    },
    {
      path: "sort-table",
      name: "SortTable",
      component: () => import("@/views/table/sort-table/index.vue"),
      meta: { title: "表格排序", icon: Star },
    },
    {
      path: "integration-table",
      name: "IntegrationTable",
      component: () => import("@/views/table/integration-table/index.vue"),
      meta: { title: "表格集成", icon: Star },
    },
  ],
};

export default tableRoutes;
