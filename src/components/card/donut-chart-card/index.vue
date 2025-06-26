<!-- 环型图卡片 -->
<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { DonutChartCardProps } from "./types";
import { useChartOps, useChartComponent } from "@/components";
import { useNamespace } from "@/composables";

defineOptions({ name: "DonutChartCard" });

const props = withDefaults(defineProps<DonutChartCardProps>(), {
  height: 9,
  radius: () => ["70%", "90%"],
  data: () => [0, 0],
});

const ns = useNamespace("donut-chart-card");

const formatNumber = (num: number) => {
  return num.toLocaleString();
};

// 使用新的图表组件抽象
const { chartInstance } = useChartComponent({
  chartOptions: { instanceName: "chartInstance" },
  props: {
    height: `${props.height}rem`,
    loading: false,
    isEmpty: props.data.every(val => val === 0),
  },
  checkEmpty: () => props.data.every(val => val === 0),
  watchSources: [
    () => props.data,
    () => props.color,
    () => props.radius,
    () => props.currentValue,
    () => props.previousValue,
  ],
  generateOptions: (): EChartsOption => {
    const computedColor = props.color || useChartOps().themeColor;

    return {
      series: [
        {
          type: "pie",
          radius: props.radius,
          avoidLabelOverlap: false,
          label: {
            show: false,
          },
          data: [
            {
              value: props.data[0],
              name: props.currentValue,
              itemStyle: { color: computedColor },
            },
            {
              value: props.data[1],
              name: props.previousValue,
              itemStyle: { color: "#e6e8f7" },
            },
          ],
        },
      ],
    };
  },
});
</script>

<template>
  <div :class="[ns.b(), ns.join('card-secondary')]" :style="{ height: `${height}rem` }">
    <div :class="ns.e('body')">
      <div :class="ns.e('content')">
        <div :class="ns.e('data-section')">
          <p class="title">{{ title }}</p>

          <div>
            <p class="value">{{ formatNumber(value) }}</p>
            <div class="percentage" :class="ns.is('increase', percentage > 0)">
              {{ percentage > 0 ? "+" : "" }}{{ percentage }}%
              <span v-if="percentageLabel">{{ percentageLabel }}</span>
            </div>
          </div>

          <div :class="ns.e('chart-legend')">
            <span class="legend-item current" v-if="currentValue">{{ currentValue }}</span>
            <span class="legend-item previous" v-if="previousValue">{{ previousValue }}</span>
          </div>
        </div>

        <div :class="ns.e('chart-section')">
          <div ref="chartInstance" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
