<script setup lang="ts">
import { Money, Sell } from "@element-plus/icons-vue";
import { BarChart } from "@/components";
</script>

<template>
  <div class="tk-card-minimal card yearly-card">
    <div class="card-header">
      <p class="title">年度销售额</p>
      <p class="subtitle">按季度统计</p>
    </div>

    <BarChart
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="[50, 80, 50, 90, 60, 70, 50]"
      barWidth="26px"
    />
    <div class="icon-text-widget">
      <div class="item">
        <div class="icon">
          <Icon :icon="Money" class="icon-teek" />
        </div>
        <div class="content">
          <p>¥200,858</p>
          <span>线上销售</span>
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <Icon :icon="Sell" class="icon-teek" />
        </div>
        <div class="content">
          <p>¥102,927</p>
          <span>线下销售</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.yearly-card {
  .icon-text-widget {
    margin-top: 2.5rem;
  }
}
</style>
