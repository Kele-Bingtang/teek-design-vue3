import type {
  ButtonProps,
  ElMessageBoxOptions,
  ElTooltipProps,
  FormValidateCallback,
  FormValidationResult,
  IconProps,
  LinkProps,
  PopconfirmProps,
  PopoverProps,
  RadioProps,
  TableColumnCtx,
  TableInstance,
  TableProps,
} from "element-plus";
import type { ProFormInstance } from "@/components/pro/form";
import type { ElOption, FormItemColumnProps } from "@/components/pro/form-item";
import type { PageInfo, PaginationProps } from "@/components/pro/pagination";
import type { AppContext, CSSProperties, UnwrapRef } from "vue";
import type { UseSelectState } from "./composables/use-selection";
import type ProTable from "./index.vue";
import type ProTableMain from "./table-main.vue";
import type ProTableHead from "./table-head.vue";
import { TableSizeEnum, TableColumnTypeEnum, ExportKey, ToolButtonEnum, Environment, OperationEl } from "./helper";

/**
 * 表格行 Scope
 */
export type TableScope<T = Recordable> = {
  /**
   * 表格行索引
   */
  $index: number;
  /**
   * 表格行数据
   */
  row: T & TableRow;
  /**
   * 表格列数据
   */
  column: TableColumn<T>;
  /**
   * 表格行索引
   */
  rowIndex?: number;
  /**
   * 表格列索引
   */
  cellIndex: number;
  /**
   * 表格store
   */
  store: Recordable;
  /**
   * 表格 expanded
   */
  expanded: boolean;
  /**
   * 表格  _self
   */
  _self: Recordable;
};

/**
 * 表格行 row
 */
export type TableRow<T extends string | number | symbol = any> = {
  [key in T]: any;
} & {
  _options: Recordable[]; // 配置项（options 下拉枚举）
  _option: Recordable; // 配置项（option 下拉枚举）
  _label: Recordable; // 单元格显示的内容
  _editable: boolean | undefined; // 表格是否可编辑
  _editableCol: Record<string, boolean>; // 表格单元格是否可编辑
  _proFormInstance: Record<string, ProFormInstance>; // 编辑态的 ProForm 实例
  _openCellEdit: (prop?: string) => void; // 开启编辑态方法
  _closeCellEdit: (prop?: string) => void; // 停止编辑态方法
  _isCellEdit: (prop?: string) => boolean; // 是否处于编辑态方法
  _validateCellEdit: (callback?: FormValidateCallback, prop?: string) => FormValidationResult | undefined; // 校验编辑态表单方法
  _getData: () => Recordable;
};

/**
 * 表格样式属性
 */
export type SizeStyle = { rowStyle: CSSProperties; cellStyle: CSSProperties; headerCellStyle: CSSProperties };

/**
 * 部分查询条件有固定的规则，比如时间范围查询不可能是 lt、gt 之类的
 */
export type FilterRule =
  | "lt"
  | "gt"
  | "le"
  | "ge"
  | "eq"
  | "ne"
  | "like"
  | "notLike"
  | "between"
  | "notBetween"
  | "in"
  | "notIn"
  | ((model: Recordable, row: any, key: string) => boolean) // 自定义函数查询，返回 boolean：true 符合条件，false 不符合条件
  | undefined;

export interface TableFilterProps {
  /**
   * 使用的表单组件名
   *
   * @default 'ElInput'
   */
  el?: FormItemColumnProps["el"];
  /**
   * ElFormItem 的 prop 属性，当表单数据 model 为对象时，prop 也是 model 的 key
   */
  prop?: FormItemColumnProps["prop"];
  /**
   * 当前端查询时，指定查询的规则
   *
   * @default 'eq'
   */
  rule?: FilterRule;
  /**
   * ProFormItem props
   */
  formColumn?: FormItemColumnProps;
  /**
   * PopoverProps props
   */
  popoverProps?: Partial<PopoverProps>;
  /**
   * 筛选按钮文字
   *
   * @default '筛选'
   */
  filterText?: string;
  /**
   * 清空按钮文字
   *
   * @default '清空'
   */
  clearText?: string;
  /**
   * 重置按钮文字
   *
   * @default '重置'
   */
  resetText?: string;
}

export interface TableEditProps extends FormItemColumnProps {
  /**
   * 表单组件值
   */
  value?: unknown;
}

/**
 * 表格导出类型
 */
export interface ExportProps {
  /**
   * 导出时的表头配置
   *
   * @default 'label'
   */
  mode?: ExportKey | `${ExportKey}`;
  /**
   * 导出的文件名
   * @default 'export-table'
   */
  fileName?: string;
  /**
   * ElMessageBox.confirm 的 title
   *
   * @default '请选择导出列'
   */
  title?: string;
  /**
   * ElMessageBox.confirm 的 options
   */
  options?: ElMessageBoxOptions;
  /**
   * ElMessageBox.confirm 的 appContext
   */
  appContext?: AppContext | null;
  /**
   * 自定义导出为文件
   *
   * @param data 表格数据
   */
  exportFile?: (data: Recordable[]) => void;
}

export namespace OperationNamespace {
  /**
   * 操作按钮属性的类型
   */
  export type ButtonRowProps = Partial<ButtonProps & LinkProps & IconProps & Recordable>;

  /**
   * el 字面量，转为 HyphenCase 格式
   */
  export type OperationElName = keyof typeof OperationEl extends infer K
    ? K extends string
      ? K extends `El${infer B}`
        ? `el-${Lowercase<B>}`
        : Lowercase<K>
      : never
    : never;

  /**
   * 操作按钮组件
   */
  export type ButtonEl = OperationElName | `${OperationEl}`;

  export interface Props extends Omit<TableColumn, "children"> {
    /**
     * 操作按钮集合
     */
    buttons?: ButtonRaw[];
    /**
     * 操作按钮类型
     *
     * @default 'ElLink'
     */
    el?: ButtonEl;
    /**
     * 显示出来的按钮个数
     *
     * @default 3
     */
    showNumber?: number | ((row: TableRow, index: number) => number);
    /**
     * 二次确认配置
     */
    confirm?: boolean | Confirm<"ElPopconfirm"> | Confirm<"ElMessageBox">;
  }

  export interface Emits {
    /**
     * 操作按钮点击时触发
     */
    buttonClick: [params: OperationNamespace.ButtonsCallBackParams];
    /**
     * 二次确认的确定按钮点击时触发
     */
    confirm: [params: OperationNamespace.ButtonsCallBackParams];
    /**
     * 二次确认的取消按钮点击时触发
     */
    cancel: [params: OperationNamespace.ButtonsCallBackParams];
  }

  export type Confirm<T extends keyof ConfirmProps> = {
    el: T;
    props?: ConfirmProps[T];
  };

  export type ConfirmProps = {
    ElPopconfirm: Partial<PopconfirmProps>;
    ElMessageBox: {
      /**
       * ElMessageBox.confirm 的 title
       *
       * @default '提示'
       */
      title?: string | ((data: ButtonsCallBackParams) => string);
      /**
       * ElMessageBox.confirm 的 message
       *
       * @default '确定执行本次操作'
       */
      message?: string | ((data: ButtonsCallBackParams) => string);
      /**
       * ElMessageBox.confirm 的 options
       */
      options?: ElMessageBoxOptions;
      /**
       * ElMessageBox.confirm 的 appContext
       */
      appContext?: AppContext | null;
    };
  };

  export interface ButtonRaw {
    /**
     * 操作文本
     */
    text: MaybeRef<string> | ((row: TableRow, index: number, button: ButtonRowProps) => MaybeRef<string>);
    /**
     * 操作按钮唯一 code，可用来判断按钮类型
     */
    code?: string | number;
    /**
     * 操作按钮类型
     *
     * @default 'ElLink'
     */
    el?: ButtonEl;
    /**
     * `@element-plus/icons-vue` 的图标名称，对 ElButton、ElLink、ElIcon 组件同时生效
     */
    icon?: Component;
    /**
     * ElButton、ElLink、ElIcon 组件对应的 props
     */
    elProps?: MaybeRef<ButtonRowProps> | ((row: TableRow, index: number, button: ButtonRaw) => ButtonRowProps);
    /**
     * ElTooltip 组件的 props， type 为 icon 时生效
     */
    tooltipProps?: Partial<ElTooltipProps>;
    /**
     * 按钮显示的逻辑 默认 true 显示，不需要显示给 false
     */
    show?: MaybeRef<boolean> | ((row: TableRow, index: number, button: ButtonRaw) => MaybeRef<boolean>);
    /**
     * 二次确认配置
     */
    confirm?: Props["confirm"];
    /**
     * 点击当前按钮时触发，可与PlusTable的事件 `clickAction` 同时触发； * 操作需要二次确认时：PlusTable的事件 `clickAction`会在确认时触发，而当前的onClick是在点击时触发
     */
    onClick?: (params: ButtonsCallBackParams) => void;
    /**
     * 操作需要二次确认时，点击确认时触发
     */
    onConfirm?: (params: ButtonsCallBackParams) => void;
    /**
     * 操作需要二次确认时，点击取消时触发， 可与PlusTable的事件 `clickActionConfirmCancel` 同时触发
     */
    onCancel?: (params: ButtonsCallBackParams) => void;
  }

  /**
   * 点击按钮回调的参数的类型
   */
  export interface ButtonsCallBackParams extends TableScope {
    /**
     * 点击按钮数据
     */
    buttonRaw: ButtonRaw;
    /**
     * 解析后的按钮数据中的 text
     */
    text: string;
    /**
     * 按钮点击事件数据
     */
    event: MouseEvent;
  }
}

export namespace TableColumnDataNamespace {
  export interface Props {
    column: TableColumn;
    editable?: boolean | "click" | "dblclick";
  }

  export interface Emits {
    /**
     * 表单值改变事件
     */
    formChange: [fromValue: unknown, prop: NonNullable<TableColumn["prop"]>, scope: TableScope];
    /**
     * 过滤事件，返回输入的值以及 prop
     */
    filter: [filterModel: Recordable, filterValue: unknown, prop: string | undefined];
    /**
     * 清空事件，返回输入的 prop
     */
    filterClear: [prop: string | undefined];
    /**
     * 重置所有表单事件
     */
    filterReset: [];
  }
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
    columnSetting?: {
      hideDragSort?: boolean; // 是否禁用拖拽显示
      hideHide?: boolean; // 是否禁用隐藏显示
      hideSortable?: boolean; // 是否禁用排序显示
      hideFilter?: boolean; // 是否禁用筛选显示
      disabledHide?: boolean; // 是否禁用隐藏选择
      disabledSortable?: boolean; // 是否禁用排序选择
      disabledFilter?: boolean; // 是否禁用筛选选择
    };
    /**
     * 表格基础配置
     */
    baseSetting?: {
      border?: boolean; // 是否开启边框，默认 false
      stripe?: boolean; // 是否开启斑马纹，默认 false
      headerBackground?: boolean; // 是否开启表头背景色，默认 true
      highlightCurrentRow?: boolean; // 是否开启单击高亮当前行，默认 true
      showHeader?: boolean; // 是否开启显示表头，默认 true
      disabledBorder?: boolean; // 是否开启禁用边框选择，默认 false
      disabledStripe?: boolean; // 是否开启禁用斑马纹选择，默认 false
      disabledHeaderBackground?: boolean; // 是否开启禁用表格高亮选择，默认 false
      disabledHighlightCurrentRow?: boolean; // 是否开启禁用单击高亮当前行选择，默认 false
      disabledShowHeader?: boolean; // 是否开启禁用单显示表头选择，默认 false
    };
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
     * 单选框 props
     */
    radioProps?: MaybeRef<Partial<RadioProps>>;
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

/**
 * ProTable 组件的类型命名空间
 */
export namespace ProTableNamespace {
  export interface Props extends ProTableMainNamespace.Props, ProTableHeadNamespace.Props {
    /**
     * 列配置项
     *
     * @default '[]'
     */
    columns?: TableColumn[];
    /**
     * table 数据
     *
     * @default '[]'
     */
    data?: Recordable[];
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
    beforeSearch?: (searchParams: Recordable) => boolean | Recordable;
    /**
     * 请求失败回调
     *
     * @param error 错误信息
     */
    requestError?: (error: unknown) => void;
    /**
     * 请求成功回调
     *
     * @param data 请求返回的数据
     */
    dataCallback?: (data: Recordable) => any;
    /**
     * 是否隐藏表格顶部栏
     *
     * @default false
     */
    hideHead?: boolean;
    /**
     * 是否使用卡片样式
     *
     * @default false
     */
    card?: boolean;
    /**
     * 分页信息
     */
    pageInfo?: ProTableMainNamespace.Props["pageInfo"];
    /**
     * 是否开启分页功能，pageMode 可以指定客户端（前端）分页还是服务端（后端）分页，当为 true 时，默认为客户端（前端）分页
     *
     * @default false
     */
    pageScope?: ProTableMainNamespace.Props["pageScope"];
    /**
     * 操作列 props
     */
    operationProps?: ProTableMainNamespace.Props["operationProps"];
    /**
     * ElTable 的 rowStyle
     */
    rowStyle?: TableProps<Recordable>["rowStyle"];
    /**
     * ElTable 的 cellStyle
     */
    cellStyle?: TableProps<Recordable>["cellStyle"];
    /**
     * ElTable 的 headerCellStyle
     */
    headerCellStyle?: TableProps<Recordable>["headerCellStyle"];
    /**
     * ElTable 的 border
     */
    border?: TableProps<Recordable>["border"];
    /**
     * ElTable 的 stripe
     */
    stripe?: TableProps<Recordable>["stripe"];
    /**
     * ElTable 的 showHeader
     */
    showHeader?: TableProps<Recordable>["showHeader"];
    /**
     * 是否显示表头背景
     *
     * @default true
     */
    headerBackground?: boolean;
    /**
     * ElTable 的 highlightCurrentRow
     */
    highlightCurrentRow?: TableProps<Recordable>["highlightCurrentRow"];
    /**
     * ElTable 的 props
     */
    [key: string]: any;
  }

  export interface Emits extends ProTableMainNamespace.Emits, ProTableHeadNamespace.Emits {
    /**
     * 注册组件实例
     */
    register: [proTableInstance: any, elTableInstance: TableInstance | null];
  }

  // 转为 onXxx: (xxx) => void
  export type OnEmits = Partial<keyOnPrefix<Emits>>;
}

/**
 * 表格列配置
 */
export interface TableColumn<T = any>
  extends Partial<Omit<TableColumnCtx<T>, "children" | "renderCell" | "renderHeader" | "width" | "label">> {
  /**
   * 表头宽度
   */
  width?: MaybeRefOrGetter<string | number>;
  /**
   * 列名称
   */
  label?: MaybeRefOrGetter<string>;
  /**
   * 列类型
   */
  type?: TableColumnTypeEnum | `${TableColumnTypeEnum}`;
  /**
   * 是否隐藏在表格当中
   *
   * @default false
   */
  hide?: MaybeRefOrGetter<boolean>;
  /**
   * 列配置中是否禁用列隐藏选择
   *
   * @default false
   */
  disabledHide?: MaybeRefOrGetter<boolean>;
  /**
   * 字典数据
   */
  options?: FormItemColumnProps["options"];
  /**
   * 指定 Options 的 key，如果设置了则优先从缓存获取对于 key 的 Options 数据
   */
  optionsProp?: string;
  /**
   * 字典指定 label && value && children 的 key 值
   *
   * @default '{ label: "label", value: "value", children: "children", disabled: "disabled" }'
   */
  optionField?: FormItemColumnProps["optionField"];
  /**
   * 当前单元格值是否根据 options 格式化（根据 value 找 label）
   *
   * @default true
   */
  isFilterOptions?: MaybeRefOrGetter<boolean>;
  /**
   * 自定义当前 option 选项
   */
  transformOption?: (value: unknown, options: ElOption[], row: Recordable) => ElOption;
  /**
   * 自定义表头内容渲染（tsx 语法）
   */
  headerRender?: (scope: TableScope<T>) => VNode;
  /**
   * 自定义单元格内容渲染（tsx 语法）
   */
  render?: (value: unknown, scope: TableScope<T>, options: ElOption[]) => VNode | string;
  /**
   * 自定义单元格内容渲染（返回 HTML），优先级低于 render，高于插槽
   */
  renderHTML?: (value: unknown, scope: TableScope<T>, options: ElOption[]) => string;
  /**
   * 多级表头
   */
  children?: TableColumn<T>[];
  /**
   * 表头右侧 ElToolTip 提示
   */
  tooltip?: FormItemColumnProps["tooltip"];
  /**
   * 是否开启 filter 功能
   *
   * @default false
   */
  filter?: MaybeRefOrGetter<boolean>;
  /**
   * 列配置中是否禁用 filter 功能选择
   *
   * @default false
   */
  disabledFilter?: MaybeRefOrGetter<boolean>;
  /**
   * 表头筛选配置项
   */
  filterProps?: TableFilterProps;
  /**
   * 列配置中是否禁用列排序选择
   *
   * @default false
   */
  disabledSortable?: MaybeRefOrGetter<boolean>;
  /**
   * 是否开启编辑功能
   */
  editable?: MaybeRefOrGetter<boolean>;
  /**
   * 编辑功能配置项
   */
  editProps?: TableEditProps;
  /**
   * 其他扩展
   */
  [key: string]: any;
}

/**
 * ProTable 组件实例
 */
export type ProTableInstance = InstanceType<typeof ProTable>;

/**
 * ProTableMain 组件实例
 */
export type ProTableMainInstance = InstanceType<typeof ProTableMain>;

/**
 * ProTableHead 组件实例
 */
export type ProTableHeadInstance = InstanceType<typeof ProTableHead>;
