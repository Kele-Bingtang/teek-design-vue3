<script setup lang="ts">
const MapChart = defineAsyncComponent(() => import("@/components/chart/map-chart/src/index.vue"));

const handleRegionClick = (region: any) => {
  console.log(`选中区域: ${region.name}`, region);
};
</script>

<template>
  <div class="page-content" element-loading-text="加载中...">
    <MapChart @region-click="handleRegionClick" />
  </div>
</template>

<style lang="scss" scoped>
.page-content {
  height: 100%;
}
</style>
