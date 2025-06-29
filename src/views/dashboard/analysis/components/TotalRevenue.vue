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
  <div class="tk-card-minimal card height-large">
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
