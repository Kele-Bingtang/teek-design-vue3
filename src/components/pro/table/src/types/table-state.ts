import type { MaybeRef } from "vue";
import type { PaginationInfo } from "@/components/pro/pagination";
import type { PageField } from "./table";

/**
 * 表格状态 Options
 */
export interface UseTableStateOptions<T extends Recordable = Recordable, P extends Recordable = Recordable, R = any> {
  /**
   * 表格数据请求接口
   *
   * @param params 请求参数
   */
  api?: (params: P) => Promise<R>;
  /**
   * 初始化查询参数
   */
  apiParams?: MaybeRef<P>;
  /**
   * 是否立即查询数据
   */
  immediate?: boolean;
  /**
   * 是否开启分页功能，可以指定客户端（前端）分页还是服务端（后端）分页，当为 true 时，默认为客户端（前端）分页
   *
   * @default false
   */
  pageInfo?: MaybeRef<Partial<PageInfo>>;
  /**
   * 分页信息 key 配置
   */
  pageField?: PageField;
  /**
   * 分页组件 props
   */
  isServerPage?: MaybeRef<boolean>;
  /**
   * 查询前置处理函数，可以返回新的查询参数或者 false，返回 false 则取消查询
   */
  beforeSearch?: (searchParam: P) => false | P;
  /**
   * 处理请求返回的数据并返回
   */
  transformData?: (data: T[], response: R) => T[] | undefined;
  /**
   * 接口请求错误处理
   */
  requestError?: (error: unknown) => void;
}

export type PageInfo = PaginationInfo & { total?: number };

/**
 * 表格状态数据
 */
export interface UseTableStateData<T extends Recordable = Recordable, P extends Recordable = Recordable> {
  /** 表格数据 */
  tableData: T[];
  /** 分页信息 */
  pageInfo: PageInfo;
  /** 查询参数 */
  searchParams: P;
  /** 初始化查询参数 */
  searchInitParams: P;
  /** 总参数 */
  totalParams: P;
}

export interface ApiResponse<T = unknown> {
  data: T[];
  total: number;
  pageNum?: number;
  pageSize?: number;
  [key: string]: unknown;
}
