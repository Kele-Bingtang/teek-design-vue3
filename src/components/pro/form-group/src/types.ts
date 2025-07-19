import type { MaybeRefOrGetter, Component } from "vue";
import type { FormColumn, ProFormNamespace } from "@/components/pro/form";
import type { CardProps } from "element-plus";
import type ProFormGroup from "./index.vue";

export interface FormGroupColumn {
  /**
   * 卡片标题
   */
  title: MaybeRefOrGetter<string>;
  /**
   * 当前分组表单唯一标识，可用于插槽
   */
  prop?: string;
  /**
   * el-icon 组件的图标
   */
  icon?: Component;
  /**
   * el-card 的 props，优先级高于整体的 cardProps
   */
  cardProps?: Partial<CardProps>;
  /**
   * 是否隐藏分组
   *
   * @default false
   */
  hidden?: MaybeRefOrGetter<boolean>;
  /**
   * 表单列配置
   */
  columns: FormColumn[];
}

export interface ProFormGroupProps extends Omit<ProFormNamespace.Props, "columns"> {
  /**
   * 列配置项
   */
  columns?: FormGroupColumn[];
  /**
   * el-card 的 props
   */
  cardProps?: Partial<CardProps>;
}

export type ProFormGroupEmits = Omit<ProFormNamespace.Emits, "register"> & {
  /**
   * 注册 ProFormGroup 组件实例
   */
  register: [proFormGroupInstance: any];
};

export type ProFormGroupOnEmits = keyOnPrefix<ProFormGroupEmits>;

/**
 * ProFormGroup 组件实例
 */
export type ProFormGroupInstance = InstanceType<typeof ProFormGroup>;
