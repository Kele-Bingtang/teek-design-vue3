export interface ProgressCardProps {
  /** 进度百分比 */
  percentage: number;
  /** 标题 */
  title?: string;
  /** 颜色 */
  color?: string;
  /** 图标 */
  icon?: string;
  /** 图标颜色 */
  iconColor?: string;
  /** 图标背景颜色 */
  iconBgColor?: string;
  /** icon 背景圆角大小，默认 8 */
  iconBgRadius?: number;
  /** 图标大小 */
  iconSize?: string | number;
  /** 进度条宽度，默认 5 */
  strokeWidth?: number;
}
