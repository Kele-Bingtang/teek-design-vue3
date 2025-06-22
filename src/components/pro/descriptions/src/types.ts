import type { DescriptionItemProps } from "element-plus";
import type { ProFormNamespace } from "@/components/pro/form";
import type { ElOption, FormItemColumnProps, RenderTypes } from "@/components/pro/form-item";

export interface DescriptionColumn extends Omit<Partial<DescriptionItemProps>, "label"> {
  /**
   * 唯一键
   */
  prop?: FormItemColumnProps["prop"];
  /**
   * 标签
   */
  label?: MaybeRefOrGetter<string>;
  /**
   * 是否隐藏
   *
   * @default false
   */
  hidden?: MaybeRefOrGetter<boolean>;
  /**
   * 字典枚举数据
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
   * 自定义当前 option 选项
   */
  transformOption?: (value: unknown, options: ElOption[], data: Recordable) => ElOption;
  /**
   * 排序（从大到小）
   */
  order?: number;
  /**
   * 自定义内容渲染
   */
  render?: (scope: { value: string; column: DescriptionColumn; data: Recordable }) => RenderTypes;
  /**
   * 自定义 label 渲染
   */
  renderLabel?: (scope: { label: string; column: DescriptionColumn; data: Recordable }) => RenderTypes;
  /**
   * ProForm Props
   */
  form?: FormItemColumnProps;
}

export interface ProDescriptionsProp {
  /**
   * 描述列表数据
   */
  data?: Recordable;
  /**
   * 描述列表列配置
   */
  columns?: DescriptionColumn[];
  /**
   * 描述列表 DescriptionItem 全局配置
   */
  descriptionsItemProps?: Partial<DescriptionItemProps>;
  /**
   * ProForm Props
   */
  formProps?: ProFormNamespace.Props;
  /**
   * 是否使用卡片背景
   */
  card?: boolean;
}

export interface ProDescriptionsEmits {
  /**
   * 表单改变事件
   */
  change: [model: Recordable, column: FormItemColumnProps];
}
