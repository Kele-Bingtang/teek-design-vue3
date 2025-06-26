<!-- 图表空状态 -->
<script setup lang="ts">
import { useNamespace } from "@/composables";

defineOptions({ name: "ChartEmpty", inheritAttrs: false });

const ns = useNamespace("chart-empty");
</script>

<template>
  <div :class="ns.b()">
    <el-empty v-bind="$attrs" />
  </div>
</template>

<style scoped lang="scss">
@use "@styles/mixins/bem" as *;

@include b(chart-empty) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
