export interface BarChartCard {
  /** 数值 */
  value: number;
  /** 标签 */
  label: string;
  /** 百分比 +（绿色）-（红色） */
  percentage: number;
  /** 日期 */
  date?: string;
  /** 高度 */
  height?: number;
  /** 颜色 */
  color?: string;
  /** 图表数据 */
  chartData: number[];
  /** 柱状图宽度 */
  barWidth?: string;
  /** 是否为迷你图表 */
  isMiniChart?: boolean;
}
