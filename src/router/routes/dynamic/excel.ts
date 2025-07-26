import { Tickets, Star } from "@element-plus/icons-vue";

const excelRoutes: RouterConfigRaw = {
  path: "/excel",
  redirect: "/excel/export-excel",
  name: "Excel",
  meta: {
    title: "Excel",
    icon: Tickets,
  },
  children: [
    {
      path: "export-excel",
      component: () => import("@/views/excel/export-excel.vue"),
      name: "ExportExcel",
      meta: { title: "Excel 导出", icon: Star },
    },
    {
      path: "export-selected-excel",
      component: () => import("@/views/excel/select-excel.vue"),
      name: "SelectExcel",
      meta: { title: "指定数据导出", icon: Star },
    },
    {
      path: "export-merge-header",
      component: () => import("@/views/excel/merge-header.vue"),
      name: "MergeHeader",
      meta: { title: "合并表头导出", icon: Star },
    },
    {
      path: "upload-excel",
      component: () => import("@/views/excel/upload-excel.vue"),
      name: "UploadExcel",
      meta: { title: "Excel 导入", icon: Star },
    },
  ],
};

export default excelRoutes;
