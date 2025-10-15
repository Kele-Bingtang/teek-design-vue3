import type { VNode, ExtractPropTypes, UnwrapRef, MaybeRefOrGetter, Component, MaybeRef } from "vue";
import type { JSX } from "vue/jsx-runtime";
import type {
  FormItemProps,
  InputProps,
  AutocompleteProps,
  CascaderProps,
  ColorPickerProps,
  DatePickerProps,
  DividerProps,
  InputNumberProps,
  RadioButtonProps,
  RadioGroupProps,
  RateProps,
  SwitchProps,
  TransferProps,
  UploadProps,
  SliderProps,
  CheckboxProps,
  CheckboxGroupProps,
  RadioProps,
  TimePickerDefaultProps,
  ElTooltipProps,
} from "element-plus";
import type { TreeProps } from "element-plus/es/components/tree-v2/src/types";
import type { SelectProps } from "element-plus/es/components/select/src/select";
import type { SelectV2Props } from "element-plus/es/components/select-v2/src/defaults";
import type { TimeSelectProps } from "element-plus/es/components/time-select/src/time-select";
import type { FormElComponentEnum } from "./helper";
import type { TreeProps as CustomTreeProps } from "./components/tree.vue";
import type ProFormItem from "./index.vue";

export type ElFormItemProps = Partial<FormItemProps>;

/**
 * 表单数据类型
 */
export type ModelBaseValueType =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | string[]
  | number[]
  | boolean[]
  | Date[]
  | [Date, Date]
  | [number, number]
  | [string, string]
  | string[][]
  | number[][]
  | Record<any, any>;

/**
 * el 字面量，转为 PascalCase 格式
 */
export type FormPascalCaseComponentName = keyof typeof FormElComponentEnum extends infer K
  ? K extends string
    ? K extends `${infer A}_${infer B}`
      ? K extends `${infer A}_${infer B}_${infer C}`
        ? `${Capitalize<Lowercase<A>>}${Capitalize<Lowercase<B>>}${Capitalize<Lowercase<C>>}`
        : `${Capitalize<Lowercase<A>>}${Capitalize<Lowercase<B>>}`
      : Capitalize<Lowercase<K>>
    : never
  : never;

/**
 * el 字面量，转为 HyphenCase 格式
 */
export type FormHyphenCaseComponentName = keyof typeof FormElComponentEnum extends infer K
  ? K extends string
    ? K extends `${infer A}_${infer B}`
      ? K extends `${infer A}_${infer B}_${infer C}`
        ? `${Lowercase<A>}-${Lowercase<B>}-${Lowercase<C>}`
        : `${Lowercase<A>}-${Lowercase<B>}`
      : Lowercase<K>
    : never
  : never;

/**
 * el 字面量
 */
export type FormElType = FormPascalCaseComponentName | FormHyphenCaseComponentName;

/**
 * 渲染函数的返回值的类型
 */
export type RenderTypes = string | VNode | JSX.Element | Component;

/**
 * render、插槽参数类型
 */
export interface FormItemRenderParams {
  /**
   * 当前值
   */
  value: unknown;
  /**
   * 当前表单数据
   */
  model: ModelBaseValueType;
  /**
   * 当前描述列表标签
   */
  label: string | number;
  /**
   * 字典枚举
   */
  options: ElOption[];
  /**
   * el 组件的 props
   */
  elProps: Recordable;
  /**
   * el-form-item 的 props
   */
  formItemProps: Partial<FormItemProps>;
  /**
   * 更新当前 prop 的表单值函数
   */
  update: (value: unknown) => void;
  /**
   * 当前列配置
   */
  column: FormItemColumnProps;
}

/**
 * 字典数据类型
 */
export interface ElOption {
  /**
   * 选项框显示的文字
   */
  label?: string;
  /**
   * 选项框值
   */
  value?: any;
  /**
   * 是否禁用此选项
   */
  disabled?: boolean;
  /**
   * 为树形选择时，可以通过 children 属性指定子选项
   */
  children?: ElOption[];
  /**
   * 拓展其他选项，如 ProTable 也是用该类型，可以接收 tagType、tagEffect 等 ElTag 相关属性
   */
  [key: string]: any;
}

/**
 * 自定义字典的 key
 */
export type ElOptionField = {
  label?: string;
  value?: string;
  disabled?: string;
  children?: string;
};

/**
 * ProFormItem 的 props
 */
export interface FormItemColumnProps<T = any> {
  /**
   * ElFormItem 的 prop 属性，当表单数据 model 为对象时，prop 也是 model 的 key
   */
  prop?: string;
  /**
   * 标签，ElFormItem 的 label 属性
   */
  label?: MaybeRefOrGetter<string | number>;
  /**
   * 是否显示 label
   *
   * @default true
   */
  showLabel?: MaybeRefOrGetter<boolean>;
  /**
   * 表单组件宽度
   */
  width?: MaybeRefOrGetter<string | number>;
  /**
   * 使用的表单组件名
   *
   * @default 'ElInput'
   */
  el?: MaybeRefOrGetter<FormElType>;
  /**
   * 表单组件的 Props，即会透传到表单组件
   */
  elProps?: MaybeRefOrGetter<
    | InputProps
    | InputNumberProps
    | ExtractPropTypes<SelectProps>
    | ExtractPropTypes<SelectV2Props>
    | TreeProps
    | CustomTreeProps
    | CascaderProps
    | DatePickerProps
    | TimePickerDefaultProps
    | TimeSelectProps
    | SwitchProps
    | SliderProps
    | RadioProps
    | RadioGroupProps
    | RadioButtonProps
    | CheckboxProps
    | CheckboxGroupProps
    | AutocompleteProps
    | RateProps
    | ColorPickerProps
    | TransferProps
    | DividerProps
    | UploadProps
    | { labelSize?: "default" | "small" | "large" } // ElDivider 字体大小
    | Recordable
  >;
  /**
   * 表单组件的插槽
   */
  elSlots?: {
    [slotName: string]: (
      data: Omit<FormItemColumnProps, "options" | "label" | "elProps" | "formItemProps"> & {
        value: unknown;
        model: ModelBaseValueType;
        options: ElOption[];
        label: string;
        elProps: UnwrapRef<FormItemColumnProps["elProps"]>;
        formItemProps: UnwrapRef<FormItemColumnProps["formItemProps"]>;
      }
    ) => RenderTypes;
  };
  /**
   * 字典枚举数据
   */
  options?:
    | string[]
    | MaybeRef<ElOption[]>
    | Promise<ElOption[]>
    | ((
        model: T,
        optionsMap?: Map<string, Recordable>
      ) =>
        | ElOption[]
        | Promise<ElOption[] | { data: ElOption[] } | { list: ElOption[] } | { data: { list: ElOption[] } }>);
  /**
   * 字典指定 label && value && children 的 key 值
   *
   * @default '{ label: "label", value: "value", children: "children", disabled: "disabled" }'
   */
  optionField?: ElOptionField;
  /**
   * ElFormItem props
   */
  formItemProps?: MaybeRefOrGetter<ElFormItemProps>;
  /**
   * 是否显示清除按钮
   *
   * @default true
   */
  clearable?: boolean;
  /**
   * Label 右侧 ElToolTip 提示
   */
  tooltip?:
    | MaybeRefOrGetter<string>
    | ({
        icon?: Component; // ElTooTip 绑定的元素图标
        render?: () => RenderTypes; // 自定义 ElTooTip 绑定的元素，将会覆盖图标，传入 ElTooTip 的 default 插槽里
        contentRender?: () => RenderTypes; // 自定义 ElTooTip 的内容，传入 ElTooTip 的 content 插槽里
      } & Partial<ElTooltipProps>);
  /**
   * 表单绑定的值格式，场景：select 下拉 value 为 "1"，而 value 值是 1 导致无法匹配，可以设置为 valueFormat: "string" 解决
   */
  valueFormat?: "string" | "number" | "boolean" | ((value: unknown) => unknown);
  /**
   * 自定义 label 标题
   */
  renderLabel?: (scope: FormItemRenderParams) => RenderTypes;
  /**
   * 自定义 Label 内容渲染（返回 HTML），优先级低于 render，高于插槽
   */
  renderLabelHTML?: (scope: FormItemRenderParams) => string;
  /**
   * 自定义渲染 el-form-item 下的表单组件
   */
  render?: (scope: FormItemRenderParams) => RenderTypes;
  /**
   * 是否为编辑态
   *
   * @default true
   */
  editable?: MaybeRefOrGetter<boolean>;
}

export interface ProFormItemEmits {
  /**
   * 表单值改变事件
   */
  change: [value: any, model: ModelBaseValueType, column: FormItemColumnProps];
}

/**
 * ProFormItem 组件实例
 */
export type ProFormItemInstance = InstanceType<typeof ProFormItem>;
