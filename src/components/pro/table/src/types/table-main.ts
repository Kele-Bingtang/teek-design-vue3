import type { PaginationProps, TableProps } from "element-plus";
import type { UnwrapRef } from "vue";
import type { PageInfo } from "@/components/pro/pagination";
import type { TableColumn, TableRow } from "./table-column";
import type { TableColumnDataNamespace } from "./table-column-data";
import type { OperationNamespace } from "./table-column-operation";
import type { UseSelectState } from "../composables";
import type { Environment } from "../helper";
import type { TableColumnTypeNamespace } from "./table-column-type";

/**
 * TableMain 组件的类型命名空间
 */
export namespace ProTableMainNamespace {
  /**
   * TableMain 组件 Props
   */
  export interface Props extends Omit<TableColumnDataNamespace.Props, "column" | "proFormItemInstances"> {
    /**
     * 表格数据
     *
     * @default '[]'
     */
    data?: Recordable[];
    /**
     * 列配置项
     *
     * @default '[]'
     */
    columns?: TableColumn[];
    /**
     * 行主键
     *
     * @default 'id'
     */
    rowKey?: TableProps<Recordable>["rowKey"];
    /**
     * 操作列的 prop
     *
     * @default 'operation'
     */
    operationProp?: string;
    /**
     * 操作列 props
     */
    operationProps?: Partial<OperationNamespace.Props>;
    /**
     * 分页信息
     */
    pageInfo?: Partial<PageInfo>;
    /**
     * 是否开启分页功能，可以指定客户端（前端）分页还是服务端（后端）分页，当为 true 时，默认为客户端（前端）分页
     *
     * @default false
     */
    pageScope?: boolean | Environment | `${Environment}`;
    /**
     * 分页组件 props
     */
    paginationProps?: MaybeRef<Partial<PaginationProps>>;
    /**
     * 过滤规则，可以指定客户端（前端）过滤还是服务端（后端）过滤，当为 true 时，默认为客户端（前端）过滤
     *
     * @default false
     */
    filterScope?: boolean | Environment | `${Environment}`;
    /**
     * ElTable 的 headerCellStyle 配置项
     */
    headerCellStyle?: TableColumn["headerCellStyle"];
    /**
     * 表格无数据时显示的文字
     *
     * @default '暂无数据'
     */
    emptyText?: string;
    /**
     * 默认选中的 radio，传入 rowKey 对应的值
     */
    selectedRadio?: TableColumnTypeNamespace.Props["selectedRadio"];
    /**
     * 单选框 props
     */
    radioProps?: TableColumnTypeNamespace.Props["radioProps"];
  }

  export interface Emits extends TableColumnDataNamespace.Emits, OperationNamespace.Emits {
    /**
     * 多选框勾选事件
     */
    selectionChange: [useSelectReturn: UnwrapRef<UseSelectState>, index?: number];
    /**
     * 分页触发事件
     */
    paginationChange: [pageInfo: PageInfo];
    /**
     * 拖拽排序结束事件
     */
    dragSortEnd: [newIndex: number, oldIndex: number];
    /**
     * 单元格点击事件
     */
    cellClick: [row: TableRow, column: TableColumn, cell: HTMLTableCellElement, event: Event];
    /**
     * 单元格双击事件
     */
    cellDblClick: [row: TableRow, column: TableColumn, cell: HTMLTableCellElement, event: Event];
    /**
     * 离开单元格编辑事件
     */
    leaveCellEdit: [row: TableRow, column: TableColumn];
  }
}
