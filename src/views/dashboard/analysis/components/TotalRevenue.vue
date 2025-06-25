<script setup lang="ts">
import { BarChart } from "@/components";

const weekDays = ref(["周一", "周二", "周三", "周四", "周五", "周六", "周日"]);

const revenueData = ref([
  {
    name: "线上销售",
    data: [12, 13, 5, 15, 10, 15, 18],
  },
  {
    name: "线下销售",
    data: [10, 11, 20, 5, 11, 13, 10],
  },
]);
</script>

<template>
  <div class="card total-revenue-card tk-card-secondary">
    <div class="card-header">
      <span class="title">总收入</span>
    </div>
    <div class="card-body">
      <BarChart
        height="100%"
        :data="revenueData"
        :xAxisData="weekDays"
        :showLegend="true"
        :showAxisLine="false"
        barWidth="18%"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.total-revenue-card {
  height: 400px;

  .card-body {
    height: calc(100% - 108px);
    padding: 20px;
  }
}

@media screen and (max-width: $device-phone) {
  .total-revenue-card {
    height: 300px;
  }
}
</style>
