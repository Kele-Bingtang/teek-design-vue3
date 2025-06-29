<script setup lang="ts">
import { LineChartCard } from "@/components";
</script>

<template>
  <LineChartCard
    class="tk-card-minimal card"
    :value="2545"
    label="购物车转化率"
    :percentage="1.2"
    :height="13.5"
    :chartData="[120, 132, 101, 134, 90, 230, 210]"
    :showAreaColor="true"
  />
</template>
