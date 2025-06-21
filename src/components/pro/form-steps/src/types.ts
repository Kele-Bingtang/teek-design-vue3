import type { StepProps } from "element-plus";
import type { ProFormNamespace } from "@/components/pro/form";
import type { FormItemColumnProps } from "@/components/pro/form-item";

export interface FormStepColumn {
  title: StepProps["title"];
  description?: StepProps["description"];
  icon?: StepProps["icon"];
  status?: StepProps["status"];
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
  pre: [currentIndex: number];
  next: [currentIndex: number, currentModel: Recordable, allModel: Recordable];
  submit: [currentIndex: number, currentModel: Recordable, allModel: Recordable];
  change: [model: Recordable, column: FormItemColumnProps];
}
