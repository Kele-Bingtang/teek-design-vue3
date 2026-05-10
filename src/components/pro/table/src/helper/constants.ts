import type { UseTooltipProps } from "element-plus";
import type { ToolButtonEnum } from "./enums";

export const defaultToolButton: `${ToolButtonEnum}`[] = [
  "refresh",
  "size",
  "fullscreen",
  "export",
  "columnSetting",
  "baseSetting",
];

export const defaultTooltipProps: Partial<UseTooltipProps> = {
  placement: "top",
  effect: "light",
};
