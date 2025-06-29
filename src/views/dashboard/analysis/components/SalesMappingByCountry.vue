<script setup lang="ts">
import { RingChart } from "@/components";
</script>

<template>
  <div class="tk-card-minimal card">
    <div class="card-header">
      <span class="title">全国销售分布</span>
    </div>
    <RingChart
      :data="[
        { value: 30, name: '北京' },
        { value: 25, name: '上海' },
        { value: 45, name: '广州' },
      ]"
      :color="['#4C87F3', '#93F1B4', '#8BD8FC']"
      :radius="['46%', '60%']"
    />
  </div>
</template>
