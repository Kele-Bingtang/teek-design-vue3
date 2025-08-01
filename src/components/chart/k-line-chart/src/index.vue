<!-- k 线图表 -->
<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { KLineChartProps } from "../../types";
import { useChartOps, useChartComponent } from "@/composables";
import { ChartEmpty } from "../../chart-empty";

defineOptions({ name: "KLineChart" });

const props = withDefaults(defineProps<KLineChartProps>(), {
  // 基础配置
  height: useChartOps().chartHeight,
  loading: false,
  isEmpty: false,
  colors: () => useChartOps().colors,

  // 数据配置
  data: () => [],
  showDataZoom: false,
  dataZoomStart: 0,
  dataZoomEnd: 100,
});

// 获取实际使用的颜色
const getActualColors = () => {
  const defaultUpColor = "#4C87F3";
  const defaultDownColor = "#8BD8FC";

  return {
    upColor: props.colors?.[0] || defaultUpColor,
    downColor: props.colors?.[1] || defaultDownColor,
  };
};

// 使用新的图表组件抽象
const {
  chartInstance,
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
    return (
      !props.data?.length ||
      props.data.every(item => item.open === 0 && item.close === 0 && item.high === 0 && item.low === 0)
    );
  },
  watchSources: [
    () => props.data,
    () => props.colors,
    () => props.showDataZoom,
    () => props.dataZoomStart,
    () => props.dataZoomEnd,
  ],
  generateOptions: (): EChartsOption => {
    const { upColor, downColor } = getActualColors();

    return {
      grid: { top: 20, right: 20, bottom: props.showDataZoom ? 80 : 20, left: 20, containLabel: true },
      tooltip: getTooltipStyle("axis", {
        axisPointer: {
          type: "cross",
        },
        formatter: (params: any) => {
          const param = params[0];
          const data = param.data;
          return `
              <div style="padding: 5px;">
                <div><strong>时间：</strong>${param.name}</div>
                <div><strong>开盘：</strong>${data[0]}</div>
                <div><strong>收盘：</strong>${data[1]}</div>
                <div><strong>最低：</strong>${data[2]}</div>
                <div><strong>最高：</strong>${data[3]}</div>
              </div>
            `;
        },
      }),
      xAxis: {
        type: "category",
        data: props.data.map(item => item.time),
        axisTick: getAxisTickStyle(),
        axisLine: getAxisLineStyle(true),
        axisLabel: getAxisLabelStyle(true),
      },
      yAxis: {
        type: "value",
        scale: true,
        axisLabel: getAxisLabelStyle(true),
        axisLine: getAxisLineStyle(true),
        splitLine: getSplitLineStyle(true),
      },
      series: [
        {
          type: "candlestick",
          data: props.data.map(item => [item.open, item.close, item.low, item.high]),
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: upColor,
            borderColor0: downColor,
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: { borderWidth: 2, shadowBlur: 10, shadowColor: "rgba(0, 0, 0, 0.3)" },
          },
          ...getAnimationConfig(),
        },
      ],
      dataZoom: props.showDataZoom
        ? [
            { type: "inside", start: props.dataZoomStart, end: props.dataZoomEnd },
            { show: true, type: "slider", top: "90%", start: props.dataZoomStart, end: props.dataZoomEnd },
          ]
        : undefined,
    };
  },
});
</script>

<template>
  <div ref="chartInstance" :style="{ height: props.height }" v-loading="props.loading">
    <ChartEmpty v-if="isEmpty" />
  </div>
</template>
