import type { MaybeRef } from "vue";
import type { TableInstance } from "element-plus";

export interface TableColumnDragSortProps {
  /**
   * 是否开启拖拽排序
   */
  sortable?: boolean;
  /**
   * ElTable 实例
   */
  tableInstance?: MaybeRef<TableInstance> | null;
  /**
   * 是否禁用拖拽排序
   */
  disabled?: boolean;
}

export interface TableColumnDragSortEmits {
  /**
   * 拖拽排序结束事件
   */
  dragSortEnd: [newIndex: number, oldIndex: number];
}
