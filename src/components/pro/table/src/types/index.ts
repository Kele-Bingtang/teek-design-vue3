import type ProTable from "../index.vue";
import type ProTableMain from "../table-main.vue";
import type ProTableHead from "../table-head.vue";

/**
 * ProTable 组件实例
 */
export type ProTableInstance = InstanceType<typeof ProTable>;

/**
 * ProTableMain 组件实例
 */
export type ProTableMainInstance = InstanceType<typeof ProTableMain>;

/**
 * ProTableHead 组件实例
 */
export type ProTableHeadInstance = InstanceType<typeof ProTableHead>;

export * from "./table";
export * from "./table";
export * from "./table-head";
export * from "./table-main";
export * from "./table-column";
export * from "./table-column-data";
export * from "./table-column-operation";
export * from "./table-column-drag-sort";
export * from "./table-head-column-setting";
export * from "./table-filter";
export * from "./table-edit";
export * from "./table-export";
export * from "./el-display";
