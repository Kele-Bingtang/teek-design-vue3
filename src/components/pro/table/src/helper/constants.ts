import type { ElTooltipProps } from "element-plus";
import type { ToolButtonEnum } from "./enums";

export const defaultToolButton: `${ToolButtonEnum}`[] = ["refresh", "size", "export", "columnSetting", "baseSetting"];

export const defaultTooltipProps: Partial<ElTooltipProps> = {
  placement: "top",
  effect: "light",
};
