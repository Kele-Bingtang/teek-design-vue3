import type { PascalCaseComponentName } from "../types";
import { ElLink, ElTag, ElProgress, ElImage, ElAvatar } from "element-plus";

/**
 * 组件名枚举，key 要求是大写和 PascalCase 格式（自动与 componentMap 映射），value 则是 el 的字面量（使用配置项的 el 时用到）
 */
export enum ComponentNameEnum {
  EL_LINK = "ElLink",
  EL_TAG = "ElTag",
  EL_PROGRESS = "ElProgress",
  EL_IMAGE = "ElImage",
  EL_AVATAR = "ElAvatar",
}

/**
 * 这里可以注册其他组件，先需要在 PascalCaseComponentName 里添加 el 名，再在这里进行组件映射
 */
const componentsMap: Record<PascalCaseComponentName, Component> = {
  ElLink,
  ElTag,
  ElProgress,
  ElImage,
  ElAvatar,
};

export { componentsMap };
