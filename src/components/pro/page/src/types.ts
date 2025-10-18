import type { MaybeRefOrGetter } from "vue";
import type { TableInstance } from "element-plus";
import type { ProTableInstance, ProTableNamespace, TableColumn } from "@/components/pro/table";
import type { SearchColumn, ProSearchEmits, ProSearchInstance, ProSearchProps } from "@/components/pro/search";
import type { BreakPoint, Responsive } from "@/components/pro/grid";
import type ProPage from "./index.vue";

export interface PageColumn<T extends Recordable = any> extends TableColumn<T> {
  search?: {
    /**
     * 搜索事件前置处理，可以返回新的搜索值
     */
    beforeSearch?: (value: any, searchParams: Recordable, column: TableColumn) => unknown | false | undefined;
    /**
     * 搜索项所占用的列数，默认为 1 列
     */
    span?: number;
    /**
     * 搜索字段左侧偏移列数
     */
    offset?: number;
  } & Partial<SearchColumn> &
    Partial<Record<BreakPoint, Responsive>>;
}

export interface ProPageProps extends ProTableNamespace.Props {
  /**
   * 页面列配置
   */
  columns?: PageColumn[];
  /**
   * 搜索项配置
   */
  searchProps?: Omit<ProSearchProps, "columns">;
  /**
   * 初始化时是否显示搜索模块
   */
  initShowSearch?: MaybeRefOrGetter<boolean>;
  /**
   * 默认搜索参数，优先级低于 column.defaultValue
   */
  defaultValues?: Recordable;
}

export interface ProPageEmits extends Omit<ProTableNamespace.Emits, "register">, Omit<ProSearchEmits, "register"> {
  /**
   * ProSearch 的注册事件
   */
  searchRegister: [proFormInstance: ProSearchInstance | null];
  /**
   * ProTable 的注册事件
   */
  tableRegister: [proTableInstance: ProTableInstance | null, elTableInstance: TableInstance | null];
}

/**
 * ProTable 组件实例
 */
export type ProPageInstance = InstanceType<typeof ProPage>;
