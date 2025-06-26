export interface StatsCardProps {
  /** 图标 */
  icon?: string;
  /** 标题 */
  title?: string;
  /** 数值 */
  count?: number;
  /** 描述 */
  description: string;
  /** 图标颜色 */
  iconColor?: string;
  /** 图标背景颜色 */
  iconBgColor?: string;
  /** 图标圆角大小 */
  iconBgRadius?: number;
  /** 图标大小 */
  iconSize?: number;
  /** 文本颜色 */
  textColor?: string;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 是否显示箭头 */
  showArrow?: boolean;
}
