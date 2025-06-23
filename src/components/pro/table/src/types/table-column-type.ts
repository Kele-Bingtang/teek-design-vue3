import type { RadioProps, TableProps } from "element-plus";
import type { RenderTypes } from "@/components/pro/form-item";
import type { TableColumn, TableScope } from "./table-column";
import type { TableColumnDragSortProps } from "./table-column-drag-sort";

export interface TableColumnTypeInfo {
  /**
   * 组件
   */
  el: Component;
  /**
   * 组件 props
   */
  props?: Recordable;
  /**
   * 组件插槽
   */
  slots?: Recordable;
  /**
   * 自定义 el 组件的默认插槽渲染
   */
  render?: (scope: TableScope) => RenderTypes;
}

export namespace TableColumnTypeNamespace {
  export interface Props {
    /**
     * 列配置项
     */
    column?: TableColumn;
    /**
     * 行主键
     *
     * @default 'id'
     */
    rowKey?: TableProps<Recordable>["rowKey"];
    /**
     * 默认选中的 radio，传入 rowKey 对应的值
     */
    selectedRadio?: MaybeRefOrGetter<string>;
    /**
     * ElRadio props
     */
    radioProps?: MaybeRefOrGetter<Partial<RadioProps>>;
    /**
     * ElTable 实例
     */
    elTableInstance?: TableColumnDragSortProps["tableInstance"];
  }

  export interface Emits {
    /**
     * 单选框勾选事件
     */
    radioChange: [row: Recordable, index: number];
    /**
     * 拖拽排序结束事件
     */
    dragSortEnd: [newIndex: number, oldIndex: number];
  }
}
