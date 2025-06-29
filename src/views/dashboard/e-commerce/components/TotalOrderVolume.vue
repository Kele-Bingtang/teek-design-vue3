<script setup lang="ts">
import { RingChart } from "@/components";
</script>

<template>
  <div class="tk-card-minimal card">
    <div class="card-header">
      <p class="title" style="font-size: 24px">205,216</p>
      <p class="subtitle">总订单量</p>
    </div>
    <RingChart
      :data="[
        { value: 30, name: '已完成' },
        { value: 25, name: '处理中' },
        { value: 45, name: '待发货' },
      ]"
      :color="['#4C87F3', '#93F1B4', '#8BD8FC']"
      :radius="['56%', '76%']"
      height="7rem"
      :showLabel="false"
      :borderRadius="0"
    />
  </div>
</template>
