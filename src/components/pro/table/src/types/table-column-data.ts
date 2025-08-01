import type { MaybeRefOrGetter } from "vue";
import type { OptionsMapType } from "@/components/pro/use-options";
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
    /**
     * 字典枚举
     */
    optionsMap?: OptionsMapType;
  }

  export interface Emits {
    /**
     * 表单值改变事件
     */
    formChange: [fromValue: any, prop: NonNullable<TableColumn["prop"]>, scope: TableScope];
    /**
     * 过滤事件，返回输入的值以及 prop
     */
    filter: [filterValue: any, prop: string];
    /**
     * 清空事件，返回输入的 prop
     */
    filterClear: [prop: string];
    /**
     * 重置所有表单事件
     */
    filterReset: [];
  }
}
