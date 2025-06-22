import type { FormItemColumnProps } from "@/components/pro/form-item";

export interface TableEditProps extends FormItemColumnProps {
  /**
   * 表单组件值
   */
  value?: unknown;
}
