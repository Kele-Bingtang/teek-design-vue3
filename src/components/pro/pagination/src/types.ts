import type { PaginationProps as ElPaginationProps } from "element-plus";

export interface PaginationProps extends Partial<ElPaginationProps> {
  /**
   * 切换页数，是否自动滚动到最上面
   *
   * @default true
   */
  autoScroll?: boolean;
  /**
   * 是否隐藏分页
   *
   * @default false
   */
  hidden?: boolean;
  /**
   * 切换 pageSize，pageNum 是否重置为 1
   *
   * @default true
   */
  reset?: boolean;
  /**
   * 总数
   *
   * @default 0
   */
  total?: number;
  /**
   * 分页对齐方式
   *
   * @default 'right'
   */
  align?: "left" | "right";
}

export type PaginationEmits = {
  /**
   * 分页改变事件
   */
  change: [pageInfo: PaginationInfo];
  /**
   * 当前页码改变事件
   */
  currentChange: [pageNum: number];
  /**
   * 页码大小改变事件
   */
  sizeChange: [pageSize: number];
};

export interface PaginationInfo {
  /**
   * 当前页
   */
  pageNum: number;
  /**
   * 页码数组
   */
  pageSizes?: number[];
  /**
   * 一页显示多少条数据
   */
  pageSize: number;
}
