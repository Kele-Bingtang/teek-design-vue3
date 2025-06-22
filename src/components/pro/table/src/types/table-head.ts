import type { CSSProperties } from "vue";
import type { ElTooltipProps } from "element-plus";
import type { ProTableNamespace } from "./table";
import type { TableColumn } from "./table-column";
import type { ExportProps } from "./table-export";
import type { TableSizeEnum, ToolButtonEnum } from "../helper";

/**
 * 表格样式属性
 */
export type SizeStyle = { rowStyle: CSSProperties; cellStyle: CSSProperties; headerCellStyle: CSSProperties };

/**
 * 表格列配置的配置项
 */
export interface ColumnSetting {
  /**
   * 是否禁用拖拽显示
   *
   * @default false
   */
  hideDragSort?: boolean;
  /**
   * 是否禁用隐藏显示
   *
   * @default false
   */
  hideHide?: boolean;
  /**
   * 是否禁用排序显示
   *
   * @default false
   */
  hideSortable?: boolean;
  /**
   * 是否禁用筛选显示
   *
   * @default false
   */
  hideFilter?: boolean;
  /**
   * 是否禁用隐藏选择
   *
   * @default false
   */
  disabledHide?: boolean;
  /**
   * 是否禁用排序选择
   *
   * @default false
   */
  disabledSortable?: boolean;
  /**
   * 是否禁用筛选选择
   *
   * @default false
   */
  disabledFilter?: boolean;
}

/**
 * 表格基础配置项
 */
export interface BaseSetting {
  /**
   * 是否开启边框
   *
   * @default false
   */
  border?: boolean;
  /**
   * 是否开启斑马纹
   *
   * @default false
   */
  stripe?: boolean;
  /**
   * 是否开启表头背景色
   *
   * @default true
   */
  headerBackground?: boolean;
  /**
   * 是否开启单击高亮当前行
   *
   * @default true
   */
  highlightCurrentRow?: boolean;
  /**
   * 是否开启显示表头
   *
   * @default true
   */
  showHeader?: boolean;
  /**
   * 是否开启禁用边框选择
   *
   * @default false
   */
  disabledBorder?: boolean;
  /**
   * 是否开启禁用斑马纹选择
   *
   * @default false
   */
  disabledStripe?: boolean;
  /**
   * 是否开启禁用表格高亮选择
   *
   * @default false
   */
  disabledHeaderBackground?: boolean;
  /**
   * 是否开启禁用单击高亮当前行选择
   *
   * @default false
   */
  disabledHighlightCurrentRow?: boolean;
  /**
   * 是否开启禁用单显示表头选择
   *
   * @default false
   */
  disabledShowHeader?: boolean;
}

/**
 * TableHead 组件的类型命名空间
 */
export namespace ProTableHeadNamespace {
  export interface Props {
    /**
     * table 数据
     *
     * @default '[]'
     */
    data?: ProTableNamespace.Props["data"];
    /**
     * 列配置项
     *
     * @default '[]'
     */
    columns?: TableColumn[];
    /**
     * 按钮显示数组
     *
     * @default '["size", "setting", "export"]'
     */
    toolButton?: boolean | (ToolButtonEnum | `${ToolButtonEnum}`)[];
    /**
     * 按钮禁用数组
     *
     * @default '[]'
     */
    disabledToolButton?: (ToolButtonEnum | `${ToolButtonEnum}`)[];
    /**
     * 表格密度
     *
     * @default 'default'
     */
    size?: TableSizeEnum | `${TableSizeEnum}`;
    /**
     * 自定义不同尺寸的 rowStyle、cellStyle、headerCellStyle
     */
    sizeStyle?: Partial<Record<TableSizeEnum, SizeStyle>>;
    /**
     * 表格标题
     */
    title?: string;
    /**
     * 表格导出配置
     */
    exportProps?: ExportProps;
    /**
     * ElTable Props
     */
    tooltipProps?: Partial<ElTooltipProps>;
    /**
     * 表格列配置
     */
    columnSetting?: ColumnSetting;
    /**
     * 表格基础配置
     */
    baseSetting?: BaseSetting;
    /**
     * 表格是否选中数据，head-left 插槽需要
     */
    isSelected?: boolean;
    /**
     * 表格选中数据列表，head-left 插槽需要
     */
    selectedList?: Recordable[];
    /**
     * 表格选中数据列表 id，head-left 插槽需要
     */
    selectedListIds?: string[];
  }

  export interface Emits {
    /**
     * 刷新按钮点击事件
     */
    refresh: [];
    /**
     * 密度选择事件
     */
    sizeChange: [size: TableSizeEnum, sizeStyle: SizeStyle];
  }
}
