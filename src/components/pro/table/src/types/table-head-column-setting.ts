import type { ProTableHeadNamespace } from "./table-head";
import type { TableColumn } from "./table-column";

export interface TableHeadColumnSettingProps {
  /**
   * 表格列配置
   */
  columns?: TableColumn[];
  /**
   * 列设置
   */
  columnSetting?: ProTableHeadNamespace.Props["columnSetting"];
  /**
   * 列设置内容为空时显示的文字
   *
   * @default '暂无可配置列'
   */
  emptyText?: string;
}

export interface TableHeadColumnSettingEmits {
  /**
   * 拖拽排序结束事件
   */
  dragSortEnd: [newIndex: number, oldIndex: number];
}
