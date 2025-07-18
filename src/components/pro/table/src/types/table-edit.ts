import type { FormItemColumnProps } from "@/components/pro/form-item";

export interface TableEditProps extends FormItemColumnProps {
  /**
   * 表单组件的值
   */
  value?: unknown;
  elForms?: FormItemColumnProps["elProps"];
}

export interface TableEditEmits {
  /**
   * 表单值改变事件
   */
  change: [value: unknown, model: Recordable, column: FormItemColumnProps];
}
