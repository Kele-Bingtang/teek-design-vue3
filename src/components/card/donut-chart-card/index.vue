<!-- 环型图卡片 -->
<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { DonutChartCardProps } from "./types";
import { useChartOps, useChartComponent } from "@/components";
import { useNamespace } from "@/composables";
import { addUnit } from "@/common/utils";

defineOptions({ name: "DonutChartCard" });

const props = withDefaults(defineProps<DonutChartCardProps>(), {
  percentageLabel: "",
  currentValue: "",
  previousValue: "",
  height: 9,
  color: "",
  radius: () => ["70%", "90%"],
  data: () => [0, 0],
});

const ns = useNamespace("donut-chart-card");
const chartOps = useChartOps();

const formatNumber = (num: number) => {
  return num.toLocaleString();
};

const colorPrimary = props.color || chartOps.themeColor;
const colorSecondary = "#e6e8f7";

// 使用新的图表组件抽象
const { chartInstance } = useChartComponent({
  chartOptions: { instanceName: "chartInstance" },
  props: {
    height: addUnit(props.height, "rem"),
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
    return {
      series: [
        {
          type: "pie",
          radius: props.radius,
          avoidLabelOverlap: false,
          label: { show: false },
          data: [
            { value: props.data[0], name: props.currentValue, itemStyle: { color: colorPrimary } },
            { value: props.data[1], name: props.previousValue, itemStyle: { color: colorSecondary } },
          ],
        },
      ],
    };
  },
});
</script>

<template>
  <div
    :class="[ns.b(), ns.join('card-minimal')]"
    :style="{
      height: addUnit(props.height, 'rem'),
      '--text-color-primary': colorPrimary,
      '--text-color-secondary': colorSecondary,
    }"
  >
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

        <div :class="ns.e('legend')">
          <span class="legend-item current" v-if="currentValue">{{ currentValue }}</span>
          <span class="legend-item previous" v-if="previousValue">{{ previousValue }}</span>
        </div>
      </div>

      <div :class="ns.e('section')">
        <div ref="chartInstance" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
