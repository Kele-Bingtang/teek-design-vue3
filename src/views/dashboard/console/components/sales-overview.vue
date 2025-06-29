<script setup lang="ts">
import { LineChart } from "@/components";
import { useNamespace } from "@/composables";

const ns = useNamespace();

const data = [50, 25, 40, 20, 70, 35, 65, 30, 35, 20, 40, 44];
const xAxisData = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
</script>

<template>
  <div class="tk-card-minimal sales-overview-card">
    <div class="card-header">
      <div class="title">
        <h4 class="box-title">访问量</h4>
        <p class="subtitle">
          今年增长
          <span :class="ns.join('text-success')">+15%</span>
        </p>
      </div>
    </div>
    <LineChart class="chart flx-1" :data="data" :xAxisData="xAxisData" :showAreaColor="true" :showAxisLine="false" />
  </div>
</template>

<style lang="scss" scoped>
.sales-overview-card {
  width: 100%;
  height: 420px;

  .chart {
    width: 100%;
    padding: 20px 0;
  }
}

@media screen and (max-width: $device-phone) {
  .sales-overview-card {
    height: 280px;
  }
}
</style>
