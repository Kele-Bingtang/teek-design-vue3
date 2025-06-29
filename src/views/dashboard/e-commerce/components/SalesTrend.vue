<script setup lang="ts">
import { DualBarCompareChart } from "@/components";
</script>

<template>
  <div class="tk-card-minimal card">
    <div class="card-header">
      <p class="title">销售趋势</p>
      <p class="subtitle">月度销售对比</p>
    </div>
    <DualBarCompareChart
      :positiveData="[50, 80, 120, 90, 60]"
      :negativeData="[30, 60, 90, 70, 40]"
      :xAxisData="['一月', '二月', '三月', '四月', '五月']"
      height="19rem"
    />
  </div>
</template>
