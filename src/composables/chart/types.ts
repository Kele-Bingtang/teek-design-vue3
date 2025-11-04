import type { EChartsOption } from "echarts";

// 图表主题配置
export interface ChartThemeConfig {
  /** 图表高度 */
  chartHeight: string;
  /** 字体大小 */
  fontSize: number;
  /** 字体颜色 */
  fontColor: string;
  /** 主题颜色 */
  themeColor: string;
  /** 颜色组 */
  colors: string[];
}

// 图表初始化选项
export interface UseChartOptions {
  /**
   * 初始化选项
   */
  options?: EChartsOption;
  /**
   * 延迟初始化时间(ms)
   *
   * @default 0
   */
  initDelay?: number;
  /**
   * IntersectionObserver 阈值
   *
   * @default 0.1
   */
  threshold?: number;
  /**
   * 是否自动响应主题变化
   *
   * @default true
   */
  autoTheme?: boolean;

  /**
   * 图表实例 Name
   *
   * @default 'chartInstance'
   */
  instanceName?: string;
}

// 基础图表 Props 接口 - 统一所有图表的基础属性
export interface BaseChartProps {
  /** 图表高度 */
  height?: string;
  /** 是否加载中 */
  loading?: boolean;
  isEmpty?: boolean;
  /** 颜色配置 */
  colors?: string[];
}
