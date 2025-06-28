export interface HighlightProps {
  /**
   * 高亮标签
   */
  tag?: string;
  /**
   * 高亮字段
   */
  keys?: string[];
  /**
   * 高亮颜色
   */
  color?: string;
}

export interface HighlightEmits {
  click: [key: string];
}
