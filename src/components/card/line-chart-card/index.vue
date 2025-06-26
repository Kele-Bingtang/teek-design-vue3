<!-- 折线图卡片 -->
<script setup lang="ts">
import type { EChartsOption } from "echarts";
import * as echarts from "echarts";
import { getCssVar, hexToRgba } from "@/common/utils";
import { useChartOps, useChartComponent } from "@/components/chart";
import type { LineChartProps } from "./types";
import { useNamespace } from "@/composables";

defineOptions({ name: "LineChartCard" });

const props = withDefaults(defineProps<LineChartProps>(), {
  height: 11,
});

const ns = useNamespace("line-chart-card");

// 使用新的图表组件抽象
const { chartInstance } = useChartComponent({
  chartOptions: { instanceName: "chartInstance" },
  props: {
    height: `${props.height}rem`,
    loading: false,
    isEmpty: !props.chartData?.length || props.chartData.every(val => val === 0),
  },
  checkEmpty: () => !props.chartData?.length || props.chartData.every(val => val === 0),
  watchSources: [() => props.chartData, () => props.color, () => props.showAreaColor],
  generateOptions: (): EChartsOption => {
    const computedColor = props.color || useChartOps().themeColor;

    return {
      grid: { top: 0, right: 0, bottom: 0, left: 0 },
      xAxis: { type: "category", show: false, boundaryGap: false },
      yAxis: { type: "value", show: false },
      series: [
        {
          data: props.chartData,
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 3, color: computedColor },
          areaStyle: props.showAreaColor
            ? {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: props.color
                      ? hexToRgba(props.color, 0.2).rgba
                      : hexToRgba(getCssVar("--el-color-primary"), 0.2).rgba,
                  },
                  {
                    offset: 1,
                    color: props.color
                      ? hexToRgba(props.color, 0.01).rgba
                      : hexToRgba(getCssVar("--el-color-primary"), 0.01).rgba,
                  },
                ]),
              }
            : undefined,
        },
      ],
    };
  },
});
</script>

<template>
  <div :class="[ns.b(), ns.join('card-secondary')]" :style="{ height: `${height}rem` }">
    <div :class="ns.e('header')">
      <div :class="ns.em('header', 'metric')">
        <p class="value">{{ value }}</p>
        <p class="label">{{ label }}</p>
      </div>
      <div
        :class="[ns.em('header', 'percentage'), ns.is('increase', percentage > 0), ns.is('mini-chart', isMiniChart)]"
      >
        {{ percentage > 0 ? "+" : "" }}{{ percentage }}%
      </div>
      <div v-if="date" :class="[ns.em('header', 'date'), ns.is('mini-chart', isMiniChart)]">
        {{ date }}
      </div>
    </div>

    <div
      ref="chartInstance"
      :class="[ns.e('content'), ns.is('mini-chart', isMiniChart)]"
      :style="{ height: `calc(${height}rem - 5rem)` }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
