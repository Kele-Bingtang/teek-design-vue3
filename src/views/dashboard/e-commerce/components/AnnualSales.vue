<script setup lang="ts">
import { Money, Sell } from "@element-plus/icons-vue";
import { BarChart } from "@/components";
</script>

<template>
  <div class="card tk-card-secondary yearly-card">
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
      height="calc(100% - 155px)"
    />
    <div class="icon-text-widget">
      <div class="item">
        <div class="icon">
          <Icon :icon="Money" class="icon-sys" />
        </div>
        <div class="content">
          <p>¥200,858</p>
          <span>线上销售</span>
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <Icon :icon="Sell" class="icon-sys" />
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
.card {
  height: 28.2rem;

  .icon-text-widget {
    margin-top: 2.5rem;
  }
}

@media screen and (max-width: $device-phone) {
  .card {
    height: 20rem;
  }
}
</style>
