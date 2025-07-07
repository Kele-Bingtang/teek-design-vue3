import type { TableSort } from "..";

export interface TableSortProps {
  /** 数据 */
  data: Recordable[];
  /** 是否显示加载中 */
  loading?: boolean;
}

export type TableSortInstance = InstanceType<typeof TableSort>;

export interface SortOrder {
  prop: string;
  order: "ascending" | "descending";
}
