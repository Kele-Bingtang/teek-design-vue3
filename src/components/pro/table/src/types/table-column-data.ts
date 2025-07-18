import type { MaybeRefOrGetter } from "vue";
import type { TableColumn, TableScope } from "./table-column";

export namespace TableColumnDataNamespace {
  export interface Props {
    /**
     * 列配置
     */
    column: TableColumn;
    /**
     * 是否开启编辑功能，或指定编辑功能触发方式
     */
    editable?: MaybeRefOrGetter<boolean | "click" | "dblclick">;
  }

  export interface Emits {
    /**
     * 表单值改变事件
     */
    formChange: [fromValue: unknown, prop: NonNullable<TableColumn["prop"]>, scope: TableScope];
    /**
     * 过滤事件，返回输入的值以及 prop
     */
    filter: [filterValue: unknown, prop: string | undefined];
    /**
     * 清空事件，返回输入的 prop
     */
    filterClear: [prop: string | undefined];
    /**
     * 重置所有表单事件
     */
    filterReset: [];
  }
}
