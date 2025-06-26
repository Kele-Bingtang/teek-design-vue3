export interface DonutChartCardProps {
  /** 数值 */
  value: number;
  /** 标题 */
  title: string;
  /** 百分比 */
  percentage: number;
  /** 百分比标签 */
  percentageLabel?: string;
  /** 当前年份 */
  currentValue?: string;
  /** 去年年份 */
  previousValue?: string;
  /** 高度 */
  height?: number;
  /** 颜色 */
  color?: string;
  /** 半径 */
  radius?: [string, string];
  /** 数据 */
  data?: [number, number];
}
