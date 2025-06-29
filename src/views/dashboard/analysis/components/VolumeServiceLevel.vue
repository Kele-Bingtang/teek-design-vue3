<script setup lang="ts">
import { BarChart } from "@/components";

// 服务类别数据
const serviceCategories = ref(["产品A", "产品B", "产品C", "产品D", "产品E"]);

// 服务量数据
const volumeServiceData = ref([
  {
    name: "业务量",
    data: [20, 25, 30, 35, 40],
    stack: "total",
    // color: '#0095FF'
  },
  {
    name: "服务量",
    data: [30, 35, 40, 45, 50],
    stack: "total",
    // color: '#95E0FB'
  },
]);
</script>

<template>
  <div class="tk-card-minimal card volume-service-level">
    <div class="card-header">
      <span class="title">业务量与服务水平</span>
    </div>
    <div class="card-body">
      <BarChart
        height="14.3rem"
        :data="volumeServiceData"
        :xAxisData="serviceCategories"
        :showLegend="true"
        :showAxisLine="false"
        :stack="true"
        barWidth="22%"
      />
    </div>
  </div>
</template>
