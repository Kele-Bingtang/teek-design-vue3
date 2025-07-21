import type { MaybeRef } from "vue";
import type { PageInfo } from "@/components/pro/pagination";
import type { PageField } from "./table";

/**
 * 表格状态 Options
 */
export interface UseTableStateOptions {
  /**
   * 表格数据请求接口
   *
   * @param params 请求参数
   */
  api?: (params: Recordable) => Promise<any>;
  /**
   * 初始化查询参数
   */
  apiParams?: MaybeRef<Recordable>;
  /**
   * 是否开启分页功能，可以指定客户端（前端）分页还是服务端（后端）分页，当为 true 时，默认为客户端（前端）分页
   *
   * @default false
   */
  pageInfo?: MaybeRef<Partial<PageInfo>>;
  /**
   * 分页组件 props
   */
  isServerPage?: MaybeRef<boolean>;
  /**
   * 查询前置处理函数，可以返回新的查询参数或者 false，返回 false 则取消查询
   */
  beforeSearch?: (searchParam: Recordable) => boolean | Recordable;
  /**
   * 处理请求返回的数据并返回
   */
  transformData?: (data: Recordable[], result: Recordable | Recordable[]) => Recordable[] | undefined;
  /**
   * 接口请求错误处理
   */
  requestError?: (error: unknown) => void;
  /**
   * 分页信息 key 名配置
   */
  pageField?: PageField;
}

/**
 * 表格状态数据
 */
export interface UseTableStateData {
  /** 表格数据 */
  tableData: Recordable[];
  /** 分页信息 */
  pageInfo: PageInfo;
  /** 查询参数 */
  searchParams: Recordable;
  /** 初始化查询参数 */
  searchInitParams: Recordable;
  /** 总参数 */
  totalParams: Recordable;
}
