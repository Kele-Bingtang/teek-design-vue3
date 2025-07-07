export interface HighlightProps {
  /** 高亮标签，默认 span */
  tag?: string;
  /** 高亮字段，默认 [] */
  keys?: string[];
  /** 高亮颜色，默认 cssVarEl(color-primary) */
  color?: string;
}

export interface HighlightEmits {
  /** 点击高亮字段 */
  click: [key: string];
}
