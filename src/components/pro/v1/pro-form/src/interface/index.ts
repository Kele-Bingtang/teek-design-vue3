import type { Component } from "vue";
import type {
  FormItemProps,
  ColProps,
  FormProps,
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
import type { VNode, ComputedRef, ComponentPublicInstance, ExtractPropTypes, InjectionKey, Ref } from "vue";
import ProForm, { type ProFormProps } from "../index.vue";
import type { TreeProps as CustomTreeProps } from "../components/tree.vue";
import type { TreeProps } from "element-plus/es/components/tree-v2/src/types";
import type { SelectProps } from "element-plus/es/components/select/src/select";
import type { SelectV2Props } from "element-plus/es/components/select-v2/src/defaults";
import type { TimeSelectProps } from "element-plus/es/components/time-select/src/time-select";

/**
 * 组件内置导入需要
 */
export enum ComponentNameEnum {
  EL_INPUT = "ElInput",
  EL_INPUT_NUMBER = "ElInputNumber",
  EL_SELECT = "ElSelect",
  EL_SELECT_V2 = "ElSelectV2",
  EL_TREE = "ElTree",
  EL_TREE_SELECT = "ElTreeSelect",
  EL_CASCADER = "ElCascader",
  EL_DATE_PICKER = "ElDatePicker",
  EL_TIME_PICKER = "ElTimePicker",
  EL_TIME_SELECT = "ElTimeSelect",
  EL_SWITCH = "ElSwitch",
  EL_SLIDER = "ElSlider",
  EL_RADIO = "ElRadio",
  EL_RADIO_GROUP = "ElRadioGroup",
  EL_RADIO_BUTTON = "ElRadioButton",
  EL_CHECKBOX = "ElCheckbox",
  EL_CHECKBOX_GROUP = "ElCheckboxGroup",
  EL_CHECKBOX_BUTTON = "ElCheckboxButton",
  EL_AUTOCOMPLETE = "ElAutocomplete",
  EL_RATE = "ElRate",
  EL_COLOR_PICKER = "ElColorPicker",
  EL_TRANSFER = "ElTransfer",
  EL_DIVIDER = "ElDivider",
  EL_UPLOAD = "ElUpload",
  CHECK_BOX_SELECT = "CheckBoxSelect",
  WANG_EDITOR = "WangEditor",
  TINYMCE = "Tinymce",
  ICON_PICKER = "IconPicker",
}

/**
 * el 字面量
 */
export type PascalCaseComponentName = keyof typeof ComponentNameEnum extends infer K
  ? K extends string
    ? K extends `${infer A}_${infer B}`
      ? K extends `${infer A}_${infer B}_${infer C}`
        ? `${Capitalize<Lowercase<A>>}${Capitalize<Lowercase<B>>}${Capitalize<Lowercase<C>>}`
        : `${Capitalize<Lowercase<A>>}${Capitalize<Lowercase<B>>}`
      : Capitalize<Lowercase<K>>
    : never
  : never;

/**
 * el 字面量
 */
export type HyphenCaseComponentName = keyof typeof ComponentNameEnum extends infer K
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
export type FormType = PascalCaseComponentName | HyphenCaseComponentName;

/**
 * 基本类型
 */
export type ValueType = string | number | boolean | any[];

/**
 * 字典数据类型
 */
export interface FormOptionProps {
  /**
   * 选项框显示的文字
   */
  label?: string;
  /**
   * 选项框值
   */
  value?: ValueType;
  /**
   * 是否禁用此选项
   */
  disabled?: boolean;
  /**
   * 为树形选择时，可以通过 children 属性指定子选项
   */
  children?: FormOptionProps[];
  [key: string]: any;
}

export interface ProElFormProps extends Partial<FormProps> {
  fixWidth?: boolean;
  width?: number | string;
}

/**
 * 自定义字典的 key
 */
export type FormFieldNamesProps = {
  label: string;
  value: string;
  disabled?: string;
  children?: string;
};

/**
 * 自定义 render 的参数类型
 */
export type FormRenderScope = {
  model: Record<string, any>;
  data: ValueType;
  enumData: Record<string, any>;
};

/**
 * setSchema 函数的参数类型
 */
export interface FormSetProps {
  prop: string;
  field: string;
  value: ValueType;
}

/**
 * 表单配置项
 */
export interface FormSchemaProps<T = any> {
  /**
   * ElCol Props
   */
  col?: Partial<ColProps>;
  /**
   * ElFormItem props
   */
  formItem?: Partial<FormItemProps>;
  /**
   * 表单组件 Props
   */
  prop: string;
  /**
   * ElFormItem 的 label 属性
   */
  label: ValueType | ((model: T) => any) | ComputedRef<ValueType>;
  /**
   * 使用的表单组件名
   */
  el?: FormType;
  /**
   * 字典数据，如果 enum 是接口调用，那么可以指定哪个 key 获取 enum 数据，默认返回的数据作为 enum
   */
  enum?:
    | FormOptionProps[]
    | ((model: T, enumMap: Map<string, Record<string, any>>) => Promise<any>)
    | ComputedRef<FormOptionProps[]>;
  /**
   * 是否缓存 enum 数据
   * @default true
   */
  useCacheEnum?: boolean;
  /**
   * 从 enumMap 中获取其他的 enum 数据
   */
  useEnumMap?: string | ((enumMap: Map<string, Record<string, any>>) => Record<string, any>);
  /**
   * 搭配 useEnumMap 使用，指定 enumMap 的 key
   */
  enumKey?: string;
  /**
   * 字典指定 label && value && children 的 key 值
   * @default Object { label: "label", value: "value", children: "children" }
   */
  fieldNames?: FormFieldNamesProps;
  /**
   * 级联表单的 prop
   */
  subProp?: string;
  /**
   * 级联表单的 enum
   */
  subEnum?: FormOptionProps[] | ((params?: any, enumData?: any) => Promise<any> | FormOptionProps[]);
  /**
   * 根据 element plus 官方文档来传递，该属性所有值会透传到表单组件
   */
  props?:
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
    | any;
  /**
   * 表单排序（从大到小）
   */
  order?: number;
  /**
   * 表单属性的默认值
   */
  defaultValue?:
    | ValueType
    | ((model: T, enumMap: Map<string, Record<string, any>>) => ValueType | any)
    | ComputedRef<ValueType>;
  /**
   * 表单组件宽度
   */
  width?: string | number;
  /**
   * 自定义搜索内容渲染（tsx 语法）
   */
  render?: (scope: FormRenderScope) => VNode;
  /**
   * 自定义 render 时候，需要填写 render 里表单组件使用 v-model 绑定的 prop
   */
  renderUseProp?: string[];
  /**
   * 是否销毁表单，true 销毁，false 不销毁，类似于 v-if
   * @default false
   */
  destroy?: boolean | ((model: T) => boolean);
  /**
   * 是否隐藏表单，true 隐藏，false 不隐藏，类似于 v-show
   * @default false
   */
  hidden?: boolean | ((model: T) => boolean);
  /**
   * 是否禁用表单，true 禁用，false 不禁用
   * @default false
   */
  disabled?: boolean | ((model: T) => boolean);
  /**
   * 表单绑定的值格式，针对 Enum Value 是 string "1"，而值是 number 1 导致编辑时无法匹配问题
   * @default default
   */
  valueFormat?: "default" | "string" | "number" | "boolean";
  /**
   * label 标题大小，默认 default。仅 el 为 el-divider | ElDivider 生效
   * @default default
   */
  labelSize?: "default" | "small" | "large";
  /**
   * 表单组件的插槽
   */
  slots?: any;
  /**
   * Label 使用 ElToolTip 提示的配置
   */
  tip?: Partial<ElTooltipProps> & {
    icon?: Component; // ElTooTip 绑定的元素图标
    render?: () => VNode | string; // 自定义 ElTooTip 绑定的元素，将会覆盖图标，传入 ElTooTip 的 default 插槽里
    contentRender?: () => VNode | string; // 自定义 ElTooTip 的内容，传入 ElTooTip 的 content 插槽里
  };
  /**
   * 其他拓展
   */
  [key: string]: any;
}

export type ProFormInstance = Omit<InstanceType<typeof ProForm>, keyof ComponentPublicInstance | keyof ProFormProps>;

/**
 * provide 类型
 */
export const formEnumMapKey: InjectionKey<Ref<Map<string, Record<string, any>[]>>> = Symbol("EnumMap");
