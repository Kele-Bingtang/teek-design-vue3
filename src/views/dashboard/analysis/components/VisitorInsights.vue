<script setup lang="ts">
import type { LineDataItem } from "@/components/chart/types";
import { computed } from "vue";
import { LineChart } from "@/components";

// 图表数据配置
const chartData = computed<LineDataItem[]>(() => [
  {
    name: "老客户",
    data: [280, 350, 300, 250, 230, 210, 240, 280, 320, 350, 300, 200],
    // color: '#4ABEFF'
  },
  {
    name: "新客户",
    data: [260, 200, 150, 130, 180, 270, 340, 380, 300, 220, 170, 130],
    // color: '#6E93FF'
  },
]);

// X轴数据
const xAxisData = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
</script>

<template>
  <div class="tk-card-minimal card">
    <div class="card-header">
      <span class="title">访客洞察</span>
    </div>
    <div class="card-body">
      <LineChart
        height="15rem"
        :data="chartData"
        :xAxisData="xAxisData"
        :showLegend="true"
        :showAxisLabel="true"
        :showAxisLine="false"
        :showSplitLine="true"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-body {
  padding-right: 16px;
}
</style>
