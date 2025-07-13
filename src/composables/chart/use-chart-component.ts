import type { EChartsOption } from "echarts";
import type { BaseChartProps, UseChartOptions } from "@/components/chart/types";
import { computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useChart } from "./use-chart";

// 高级图表组件抽象
interface UseChartComponentOptions<T extends BaseChartProps> {
  /** Props响应式对象 */
  props: T;
  /** 图表配置生成函数 */
  generateOptions: () => EChartsOption;
  /** 空数据检查函数 */
  checkEmpty?: () => boolean;
  /** 自定义监听的响应式数据 */
  watchSources?: (() => any)[];
  /** 自定义可视事件处理 */
  onVisible?: () => void;
  /** useChart选项 */
  chartOptions?: UseChartOptions;
}

export function useChartComponent<T extends BaseChartProps>(options: UseChartComponentOptions<T>) {
  const { props, generateOptions, checkEmpty, watchSources = [], onVisible, chartOptions = {} } = options;

  const chart = useChart(chartOptions);
  const { chartInstance, initChart, isDark } = chart;

  // 检查是否为空数据
  const isEmpty = computed(() => {
    if (props.isEmpty) return true;
    if (checkEmpty) return checkEmpty();
    return false;
  });

  // 更新图表
  const updateChart = () => {
    if (!isEmpty.value) initChart(generateOptions());
  };

  // 处理图表进入可视区域时的逻辑
  const handleChartVisible = () => {
    if (onVisible) onVisible();
    else updateChart();
  };

  // 设置数据监听
  const setupWatchers = () => {
    // 监听自定义数据源
    if (watchSources.length > 0) watch(watchSources, updateChart, { deep: true });

    // 监听主题变化
    watch(isDark, updateChart);
  };

  // 设置生命周期
  const setupLifecycle = () => {
    onMounted(() => {
      updateChart();

      // 监听图表可见事件
      if (chartInstance.value) chartInstance.value.addEventListener("chartVisible", handleChartVisible);
    });

    onBeforeUnmount(() => {
      // 清理事件监听器
      if (chartInstance.value) chartInstance.value.removeEventListener("chartVisible", handleChartVisible);
    });
  };

  // 初始化
  setupWatchers();
  setupLifecycle();

  return {
    ...chart,
    isEmpty,
    updateChart,
    handleChartVisible,
  };
}
