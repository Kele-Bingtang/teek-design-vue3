import type { CommonIcon } from "@components";
import type { FormInstance } from "element-plus";

export interface MaterialInputProps {
  /** 输入框类型 */
  type?: string;
  /** 输入框 id */
  id?: string;
  /** 输入框图标 */
  icon?: CommonIcon;
  /** 输入框名称 */
  name?: string;
  /** 输入框占位符 */
  placeholder?: string;
  /** 输入框是否只读 */
  readonly?: boolean;
  /** 输入框是否禁用 */
  disabled?: boolean;
  /** 输入框是否必填 */
  required?: boolean;
  /** 输入框自动完成 */
  autoComplete?: string;
  /** 输入框最小值 */
  min?: number | string;
  /** 输入框最大值 */
  max?: number | string;
  /** 输入框步长 */
  step?: number;
  /** 输入框最小长度 */
  minLength?: number;
  /** 输入框最大长度 */
  maxLength?: number;
  /** 输入框激活颜色 */
  activeColor?: string;
  /** 输入框主题 */
  theme?: string;
  /** ElForm 组件实例 */
  elForm?: FormInstance | null;
  /** 输入框是否验证事件 */
  validateTrigger?: "blur" | "change";
}

export interface MaterialInputEmits {
  /** 输入框聚焦事件 */
  focus: [event: FocusEvent];
  /** 输入框失去焦点事件 */
  blur: [event: FocusEvent];
  /** 输入框输入事件 */
  input: [event: Event];
}
