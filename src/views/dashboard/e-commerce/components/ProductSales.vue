<script setup lang="ts">
import { TopRight } from "@element-plus/icons-vue";
import { BarChart } from "@/components";
import { useNamespace } from "@/composables";

const ns = useNamespace();
</script>

<template>
  <div class="tk-card-minimal card">
    <div class="card-header">
      <p class="title" style="font-size: 24px">
        14.5k
        <Icon :icon="TopRight" class="icon-teek" :class="ns.join('text-success')" />
      </p>
      <p class="subtitle">销售量</p>
    </div>

    <BarChart
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="[50, 80, 50, 90, 60, 70, 50]"
      barWidth="16px"
      height="4rem"
    />
  </div>
</template>
