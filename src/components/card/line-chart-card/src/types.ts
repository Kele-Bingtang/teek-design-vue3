export interface LineChartProps {
  /** 数值 */
  value: number;
  /** 标签 */
  label: string;
  /** 百分比 */
  percentage: number;
  /** 日期 */
  date?: string;
  /** 高度 */
  height?: string | number;
  /** 颜色 */
  color?: string;
  /** 是否显示区域颜色 */
  showAreaColor?: boolean;
  /** 图表数据 */
  chartData?: number[];
  /** 是否为迷你图表 */
  isMiniChart?: boolean;
}
