<!-- 散点图 -->
<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { ScatterChartProps } from "../../types";
import { getCssVar } from "@/common/utils";
import { useNamespace, useChartOps, useChartComponent } from "@/composables";
import { ChartEmpty } from "../../chart-empty";

defineOptions({ name: "ScatterChart" });

const props = withDefaults(defineProps<ScatterChartProps>(), {
  // 基础配置
  height: useChartOps().chartHeight,
  loading: false,
  isEmpty: false,
  colors: () => useChartOps().colors,

  // 数据配置
  data: () => [{ value: [0, 0] }, { value: [0, 0] }],
  symbolSize: 14,

  // 轴线显示配置
  showAxisLabel: true,
  showAxisLine: true,
  showSplitLine: true,

  // 交互配置
  showTooltip: true,
  showLegend: false,
  legendPosition: "bottom",
});

const ns = useNamespace();

// 使用新的图表组件抽象
const {
  chartInstance,
  isDark,
  getAxisLineStyle,
  getAxisLabelStyle,
  getAxisTickStyle,
  getSplitLineStyle,
  getAnimationConfig,
  getTooltipStyle,
  isEmpty,
} = useChartComponent({
  chartOptions: { instanceName: "chartInstance" },
  props,
  checkEmpty: () => {
    return !props.data?.length || props.data.every(item => item.value.every(val => val === 0));
  },
  watchSources: [() => props.data, () => props.colors, () => props.symbolSize],
  options: (): EChartsOption => {
    const computedColor = props.colors[0] || getCssVar(ns.cssVarNameEl("color-primary"));

    return {
      grid: { top: 20, right: 20, bottom: 20, left: 20, containLabel: true },
      tooltip: props.showTooltip
        ? getTooltipStyle("item", {
            formatter: (params: { value: [number, number] }) => {
              const [x, y] = params.value;
              return `X: ${x}<br/>Y: ${y}`;
            },
          })
        : undefined,
      xAxis: {
        type: "value",
        axisLabel: getAxisLabelStyle(props.showAxisLabel),
        axisLine: getAxisLineStyle(props.showAxisLine),
        axisTick: getAxisTickStyle(),
        splitLine: getSplitLineStyle(props.showSplitLine),
      },
      yAxis: {
        type: "value",
        axisLabel: getAxisLabelStyle(props.showAxisLabel),
        axisLine: getAxisLineStyle(props.showAxisLine),
        axisTick: getAxisTickStyle(),
        splitLine: getSplitLineStyle(props.showSplitLine),
      },
      series: [
        {
          type: "scatter",
          data: props.data,
          symbolSize: props.symbolSize,
          itemStyle: {
            color: computedColor,
            shadowBlur: 6,
            shadowColor: isDark.value ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
            shadowOffsetY: 2,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 12,
              shadowColor: isDark.value ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
            },
            scale: true,
          },
          ...getAnimationConfig(),
        },
      ],
    };
  },
});
</script>

<template>
  <div ref="chartInstance" class="scatter-chart" :style="{ height: props.height }" v-loading="props.loading">
    <ChartEmpty v-if="isEmpty" />
  </div>
</template>

<style lang="scss" scoped>
.scatter-chart {
  position: relative;
  width: 100%;
}
</style>
