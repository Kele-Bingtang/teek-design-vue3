<!-- 柱状图卡片 -->
<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { BarChartCard } from "./types";
import { useChartOps, useChartComponent } from "@/components/chart";
import { useNamespace } from "@/composables";
import { addUnit } from "@/common/utils";

defineOptions({ name: "BarChartCard" });

const props = withDefaults(defineProps<BarChartCard>(), {
  date: "",
  height: 11,
  color: "",
  chartData: () => [],
  barWidth: "26%",
  isMiniChart: false,
});

const ns = useNamespace("bar-chart-card");

// 使用新的图表组件抽象
const { chartInstance } = useChartComponent({
  chartOptions: { instanceName: "chartInstance" },
  props: {
    height: addUnit(props.height, "rem"),
    loading: false,
    isEmpty: !props.chartData?.length || props.chartData.every(val => val === 0),
  },
  checkEmpty: () => !props.chartData?.length || props.chartData.every(val => val === 0),
  watchSources: [() => props.chartData, () => props.color, () => props.barWidth],
  generateOptions: (): EChartsOption => {
    const computedColor = props.color || useChartOps().themeColor;

    return {
      grid: {
        top: 0,
        right: 0,
        bottom: 15,
        left: 0,
      },
      xAxis: { type: "category", show: false },
      yAxis: { type: "value", show: false },
      series: [
        {
          data: props.chartData,
          type: "bar",
          barWidth: props.barWidth,
          itemStyle: { color: computedColor, borderRadius: 2 },
        },
      ],
    };
  },
});
</script>

<template>
  <div :class="[ns.b(), ns.join('card-secondary')]" :style="{ height: addUnit(props.height, 'rem') }">
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

      <div v-if="date" :class="[ns.em('header', 'date'), ns.is('mini-chart', isMiniChart)]">{{ date }}</div>
    </div>

    <div
      ref="chartInstance"
      :class="[ns.e('content'), ns.is('mini-chart', isMiniChart)]"
      :style="{ height: `calc(${addUnit(props.height, 'rem')} - 5rem)` }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
