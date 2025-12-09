import type { MaybeRef, MaybeRefOrGetter } from "vue";
import type { ColProps, FormInstance, FormItemProp, FormProps, FormValidateCallback, RowProps } from "element-plus";
import type { FormItemColumnProps, BaseValueType, ProFormItemEmits } from "@/components/pro/form-item";
import type ProForm from "./index.vue";
import type ProFormMain from "./form-main.vue";

export type ElFormProps = Partial<FormProps>;
export type ElRowProps = Partial<RowProps>;
export type ElColProps = Partial<ColProps>;

/**
 * defaultValue 为函数的参数类型
 */
export interface DefaultValueParams<T = Record<string, any>> {
  /**
   * 表单数据
   */
  model: T;
  /**
   * 字典枚举数据缓存，key 为 prop，value 为 options
   */
  optionsMap: Map<string, Record<string, any>>;
  /**
   * 当前列配置
   */
  prop: string;
}

/**
 * ProForm 组件的命名空间类型
 */
export namespace ProFormNamespace {
  export interface Props extends Omit<FormMainNamespace.Props, "columns"> {
    /**
     * 表单配置项
     */
    columns?: MaybeRef<FormColumn[]>;
    /**
     * ElForm props
     */
    elFormProps?: MaybeRefOrGetter<ElFormProps>;
    /**
     * 表单提交时，如果校验失败，是否使用 ElMessage 提示错误信息
     *
     * @default true
     */
    showErrorTip?: boolean;
    /**
     * 是否显示 Footer（两个按钮）
     *
     * @default true
     */
    showFooter?: boolean;
    /**
     * 是否显示重置按钮
     *
     * @default true
     */
    showReset?: boolean;
    /**
     * 提交按钮文字
     *
     * @default '提交'
     */
    submitText?: string;
    /**
     * 重置按钮文字
     *
     * @default '重置'
     */
    resetText?: string;
    /**
     * 提交按钮 loading
     *
     * @default false
     */
    submitLoading?: boolean;
    /**
     * 底部对齐方式
     *
     * @default 'right'
     */
    footerAlign?: "left" | "center" | "right";
    /**
     * 是否阻止表单提交时默认的表单提交行为（即自动校验表单）
     *
     * @default false
     */
    preventNativeSubmit?: boolean;
  }

  export interface Emits extends FormMainNamespace.Emits {
    /**
     * 注册 ProForm 组件实例和 elForm 实例
     */
    register: [proFormInstance: any, elFormInstance: FormInstance | null];
    /**
     * ElForm 自带的事件
     */
    validate: [prop: FormItemProp, isValid: boolean, message: string];
    /**
     * 提交按钮事件
     */
    submit: [model: Recordable];
    /**
     * 表单提交后校验失败事件
     */
    submitError: [invalidFields: Parameters<FormValidateCallback>[1]];
    /**
     * 重置按钮事件
     */
    reset: [model: Recordable];
  }

  /**
   * 转为 onXxx: (xxx) => void
   */
  export type OnEmits = Partial<keyOnPrefix<Emits>>;
}

/**
 * FormMain 组件的命名空间类型
 */
export namespace FormMainNamespace {
  export interface Props {
    /**
     * 表单配置项
     */
    columns?: FormColumn[];
    /**
     * 动态 model，如果 column 发生变化，则重新渲染 model 表单数据（将不存在 column 的 prop 从 model 中去掉）
     *
     * @default false
     */
    cleanModel?: boolean;
    /**
     * 清除 model 不存在的 prop 时，指定保留 prop，仅当 cleanModel 为 true 生效
     */
    notCleanModelKeys?: string[];
    /**
     * 是否使用栅格布局
     *
     * @default true
     */
    flexLayout?: boolean;
    /**
     * ElRow Props
     */
    rowProps?: ElRowProps;
    /**
     * ElCol Props
     */
    colProps?: ElColProps;
    /**
     * 是否显示 label，优先级低于 FormItemColumnProps["showLabel"]
     *
     * @default true
     */
    showLabel?: FormItemColumnProps["showLabel"];
    /**
     * 是否显示清除按钮，优先级低于 FormItemColumnProps["clearable"]
     *
     * @default true
     */
    clearable?: FormItemColumnProps["clearable"];
    /**
     * 是否允许编辑
     *
     * @default true
     */
    editable?: FormItemColumnProps["editable"];
    /**
     * 表单组件宽度，优先级低于 FormItemColumnProps["width"]
     *
     * @default '100%'
     */
    width?: FormItemColumnProps["width"];
  }

  export interface Emits extends Omit<ProFormItemEmits, "change"> {
    /**
     * 注册 ProForm 组件实例和 elForm 实例
     */
    register: [proFormInstance: any, elFormInstance: FormInstance | null];
    /**
     * 表单值改变事件
     */
    change: [model: any, model: Recordable, column: FormItemColumnProps];
  }
}

/**
 * ProForm 表单配置项
 */
export interface FormColumn<T = Recordable> extends FormItemColumnProps<T> {
  /**
   * ElFormItem 的 prop 属性，当表单数据 model 为对象时，prop 也是 model 的 key
   */
  prop: NonNullable<FormItemColumnProps<T>["prop"]>;
  /**
   * ElCol Props
   */
  colProps?: MaybeRef<Partial<ColProps>>;
  /**
   * 表单属性的默认值
   */
  defaultValue?:
    | MaybeRef<BaseValueType>
    | Promise<BaseValueType>
    | ((defaultValueParams: DefaultValueParams) => BaseValueType | Promise<BaseValueType>);
  /**
   * 表单排序（从大到小）
   */
  order?: number;
  /**
   * 是否销毁表单，true 销毁，false 不销毁，类似于 v-if
   *
   * @default false
   */
  destroy?: MaybeRef<boolean> | ((model: T) => MaybeRef<boolean>);
  /**
   * 是否隐藏表单，true 隐藏，false 不隐藏，类似于 v-show
   *
   * @default false
   */
  hidden?: MaybeRef<boolean> | ((model: T) => MaybeRef<boolean>);
  /**
   * 指定 Options 的 key，如果设置了则优先从缓存获取对于 key 的 Options 数据
   */
  optionsProp?: string;
  /**
   * 是否缓存字典数据
   *
   * @default true
   */
  optionCache?: boolean;
  /**
   * 其他拓展
   */
  [key: string]: any;
}

/**
 * ProForm 组件实例
 */
export type ProFormInstance = InstanceType<typeof ProForm>;

/**
 * ProFormMain 组件实例
 */
export type ProFormMainInstance = InstanceType<typeof ProFormMain>;
