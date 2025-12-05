import type { MaybeRef } from "vue";
import type { TableInstance, TableProps } from "element-plus";
import type { ProTableHeadNamespace } from "./table-head";
import type { ProTableMainNamespace } from "./table-main";
import type { TableColumn } from "./table-column";

export interface PageField {
  /**
   * 当前页数字段
   *
   * @default 'pageNum'
   */
  pageNum?: string;
  /**
   * 每页数量字段
   *
   * @default 'pageSize'
   */
  pageSize?: string;
  /**
   * 分页选择器字段
   *
   * @default 'pageSizes'
   */
  pageSizes?: string;
  /**
   * 总页数字段
   *
   * @default 'total'
   */
  total?: string;
}

/**
 * ProTable 组件的类型命名空间
 */
export namespace ProTableNamespace {
  export interface Props
    extends Omit<ProTableMainNamespace.Props, "columns">,
      Omit<ProTableHeadNamespace.Props, "data" | "columns" | "isSelected" | "selectedList" | "selectedListIds"> {
    /**
     * 列配置项
     *
     * @default '[]'
     */
    columns?: MaybeRef<TableColumn[]>;
    /**
     * 请求表格数据的请求
     *
     * @param params 请求参数
     */
    requestApi?: (params: Recordable) => Promise<any>;
    /**
     * 默认请求参数（请求一定会携带）
     */
    defaultRequestParams?: MaybeRef<Recordable>;
    /**
     * 请求参数
     */
    requestParams?: MaybeRef<Recordable>;
    /**
     * 初始化请求参数（重置时恢复为初始化参数）
     */
    initRequestParams?: MaybeRef<Recordable>;
    /**
     * 是否立即执行请求
     *
     * @default true
     */
    requestImmediate?: boolean;
    /**
     * 查询数据前的回调函数，可以对查询参数进行处理或禁止查询
     */
    beforeSearch?: (searchParams: Recordable) => false | Recordable;
    /**
     * 请求失败回调
     */
    requestError?: (error: any) => void;
    /**
     * 对请求成功的数据进行处理
     */
    transformData?: (data: Recordable[], result?: any) => any;
    /**
     * 是否隐藏表格顶部栏
     *
     * @default false
     */
    hideHead?: boolean;
    /**
     * 是否显示控制表格顶部栏的图标列
     *
     * @default false
     */
    controlHeadColumn?: boolean;
    /**
     * 控制表格顶部栏图标列（ElTableColumn）的 Props
     */
    controlHeadColumnProps?: TableColumn<any>;
    /**
     * 是否使用卡片样式
     *
     * @default false
     */
    card?: boolean;
    /**
     * 分页信息 key 名配置
     */
    pageField?: PageField;
    /**
     * ElTable 的 rowStyle 配置项
     */
    rowStyle?: TableProps<Recordable>["rowStyle"];
    /**
     * ElTable 的 cellStyle 配置项
     */
    cellStyle?: TableProps<Recordable>["cellStyle"];
    /**
     * ElTable 的 headerRowStyle 配置项
     */
    headerRowStyle?: TableProps<Recordable>["headerRowStyle"];
    /**
     * ElTable 的 headerCellStyle 配置项
     */
    headerCellStyle?: TableProps<Recordable>["headerCellStyle"];
    /**
     * ElTable 的 border 配置项
     */
    border?: TableProps<Recordable>["border"];
    /**
     * ElTable 的 stripe 配置项
     */
    stripe?: TableProps<Recordable>["stripe"];
    /**
     * ElTable 的 showHeader 配置项
     */
    showHeader?: TableProps<Recordable>["showHeader"];
    /**
     * ElTable 的 highlightCurrentRow 配置项
     *
     * @default true
     */
    highlightCurrentRow?: TableProps<Recordable>["highlightCurrentRow"];
    /**
     * 是否显示表头背景
     *
     * @default true
     */
    headerBackground?: boolean;
    /**
     * ElTable 的其他 props
     */
    [key: string]: any;
  }

  export interface Emits extends ProTableMainNamespace.Emits, ProTableHeadNamespace.Emits {
    /**
     * 注册组件实例
     */
    register: [proTableInstance: any, elTableInstance: TableInstance | null];
  }

  /**
   * 转为 onXxx: (xxx) => void
   */
  export type OnEmits = Partial<keyOnPrefix<Emits>>;
}
