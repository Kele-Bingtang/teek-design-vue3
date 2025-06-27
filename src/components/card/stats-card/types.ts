export interface StatsCardProps {
  /** 图标 */
  icon?: string;
  /** 标题 */
  title?: string;
  /** 数值，默认 0 */
  count?: number;
  /** 描述 */
  description: string;
  /** 图标颜色 */
  iconColor?: string;
  /** 图标背景颜色 */
  iconBgColor?: string;
  /** 图标圆角大小，默认 50 */
  iconBgRadius?: string | number;
  /** 图标大小，默认 30 */
  iconSize?: string | number;
  /** 文本颜色 */
  textColor?: string;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 是否显示箭头 */
  showArrow?: boolean;
}
