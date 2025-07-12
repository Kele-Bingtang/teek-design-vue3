import type { FormValidateCallback, FormValidationResult, TableColumnCtx } from "element-plus";
import type { ProFormInstance } from "@/components/pro/form";
import type { ElOption, FormItemColumnProps, RenderTypes } from "@/components/pro/form-item";
import type { TableFilterProps } from "./table-filter";
import type { TableEditProps } from "./table-edit";
import type { TableColumnTypeEnum } from "../helper";
import type { ElDisplayProps } from "./el-display";

export interface RenderParams<T = any> extends TableScope<T> {
  value: unknown;
  /**
   * 字典枚举数据
   */
  options: ElOption[];
  /**
   * 其他扩展属性，如果组件自带插槽的数据
   */
  [key: string]: any;
}

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
  /**
   * options 字典枚举
   */
  _options: Recordable;
  /**
   * 当前列的 option 相关配置，_getValue 里需要使用，因此需要提前缓存起来
   */
  _optionProps: Recordable;
  /**
   * 获取单元格值
   */
  _getValue: (prop: string, column?: TableColumn) => unknown;
  /**
   * 获取当前行的数据
   */
  _getData: () => Recordable;
  /**
   * 表格是否可编辑
   */
  _editable: boolean | undefined;
  /**
   * 表格单元格是否可编辑
   */
  _editableCol: Record<string, boolean>;
  /***
   * 编辑态的 ProForm 实例
   */
  _proFormInstance: Record<string, ProFormInstance>;
  /**
   * 开启编辑态方法
   */
  _openCellEdit: (prop?: string) => void;
  /**
   * 停止编辑态方法
   */
  _closeCellEdit: (prop?: string) => void;
  /**
   * 是否处于编辑态方法
   */
  _isCellEdit: (prop?: string) => boolean;
  /**
   * 校验编辑态表单方法
   */
  _validateCellEdit: (callback?: FormValidateCallback, prop?: string) => FormValidationResult | undefined;
};

/**
 * 表格列配置
 */
export interface TableColumn<T = any>
  extends Partial<Omit<TableColumnCtx<T>, "children" | "renderCell" | "renderHeader" | "width" | "label">>,
    Omit<ElDisplayProps, "value" | "options"> {
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
  hidden?: MaybeRefOrGetter<boolean>;
  /**
   * 列配置中是否禁用列隐藏选择
   *
   * @default false
   */
  disabledHidden?: MaybeRefOrGetter<boolean>;
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
   * 如果 options 里找不到对应的 label，则使用 value 作为 label
   *
   * @default false
   */
  ignoreOptionIfAbsent?: MaybeRefOrGetter<boolean>;
  /**
   * 自定义当前 option 选项
   */
  transformOption?: (value: unknown, options: ElOption[], row: Recordable) => ElOption;
  /**
   * 自定义表头内容渲染（tsx 语法）
   */
  headerRender?: (scope: RenderParams<T>) => RenderTypes;
  /**
   * 自定义单元格内容渲染（tsx 语法）
   */
  render?: (scope: RenderParams<T>) => RenderTypes;
  /**
   * 自定义单元格内容渲染（返回 HTML），优先级低于 render，高于插槽
   */
  renderHTML?: (scope: RenderParams<T>) => string;
  /**
   * 自定义单元格内容
   */
  formatValue?: (value: unknown, scope: RenderParams<T>) => string | number;
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
   * 过滤前置处理，可以返回新的过滤值或者 false 来阻止过滤
   */
  beforeFilter?: (
    filterValue: unknown,
    filterModel: Recordable,
    prop: string | undefined
  ) => unknown | false | undefined;
  /**
   * 列配置中是否禁用列排序选择
   *
   * @default false
   */
  disabledSortable?: MaybeRefOrGetter<boolean>;
  /**
   * 列配置中是否禁用列拖拽排序
   *
   * @default false
   */
  disabledDragSort?: MaybeRefOrGetter<boolean>;
  /**
   * 是否开启编辑功能
   */
  editable?: MaybeRefOrGetter<boolean>;
  /**
   * 编辑功能配置项
   */
  editProps?: TableEditProps;
  /**
   * el 组件的插槽
   */
  elSlots?: {
    [slotName: string]: (data: RenderParams) => RenderTypes;
  };
  /**
   * 其他扩展
   */
  [key: string]: any;
}
