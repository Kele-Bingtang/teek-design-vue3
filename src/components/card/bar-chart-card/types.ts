export interface BarChartCard {
  /** 数值 */
  value: number;
  /** 标签 */
  label: string;
  /** 百分比 +（绿色）-（红色） */
  percentage: number;
  /** 日期 */
  date?: string;
  /** 高度，默认 11 */
  height?: string | number;
  /** 颜色 */
  color?: string;
  /** 图表数据 */
  chartData?: number[];
  /** 柱状图宽度，默认 26% */
  barWidth?: string;
  /** 是否为迷你图表，默认 false */
  isMiniChart?: boolean;
}
