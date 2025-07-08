<script setup lang="ts">
const MapChart = defineAsyncComponent(() => import("@/components/chart/map-chart/src/index.vue"));
</script>

<template>
  <div class="page-content" element-loading-text="加载中...">
    <MapChart />
  </div>
</template>

<style lang="scss" scoped>
.page-content {
  height: 100%;
}
</style>
