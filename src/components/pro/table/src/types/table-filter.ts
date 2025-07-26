import type { PopoverProps } from "element-plus";
import type { FormItemColumnProps } from "@/components/pro/form-item";

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
  /**
   * 字典数据
   */
  options?: FormItemColumnProps["options"];
  /**
   * 字典指定 label && value && children 的 key 值
   *
   * @default '{ label: "label", value: "value", children: "children", disabled: "disabled" }'
   */
  optionField?: FormItemColumnProps["optionField"];
}

export interface TableFilterEmits {
  /**
   * 过滤事件，返回输入的值以及 prop
   */
  filter: [filterValue: any, prop: string];
  /**
   * 清空事件，返回输入的 prop
   */
  clear: [prop: string];
  /**
   * 重置所有表单事件
   */
  reset: [];
}
