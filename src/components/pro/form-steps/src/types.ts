import type { StepProps } from "element-plus";
import type { ProFormNamespace } from "@/components/pro/form";
import type { FormItemColumnProps } from "@/components/pro/form-item";

export interface FormStepColumn {
  /**
   * ElSteps 的 title
   */
  title: StepProps["title"];
  /**
   * ElSteps 的 description
   */
  description?: StepProps["description"];
  /**
   * ElSteps 的 icon
   */
  icon?: StepProps["icon"];
  /**
   * ElSteps 的 status
   */
  status?: StepProps["status"];
  /**
   * ProForm Props
   */
  form?: ProFormNamespace.Props & { modelValue?: Recordable };
}

export interface ProFormStepsProps {
  /**
   * 数据
   */
  columns?: FormStepColumn[];
  /**
   * 提交按钮文字
   *
   * @default '提交'
   */
  submitText?: string;
  /**
   * 下一步按钮文字
   *
   * @default '下一步'
   */
  nextText?: string;
  /**
   * 上一步按钮文字
   *
   * @default '上一步'
   */
  preText?: string;
}

export interface ProFormStepsEmits {
  /**
   * 上一步按钮点击事件
   */
  pre: [currentIndex: number];
  /**
   * 下一步按钮点击事件
   */
  next: [currentIndex: number, currentModel: Recordable, allModel: Recordable];
  /**
   * 提交按钮点击事件
   */
  submit: [currentIndex: number, currentModel: Recordable, allModel: Recordable];
  /**
   * 表单值改变事件
   */
  change: [value: unknown, model: Recordable, column: FormItemColumnProps];
}
