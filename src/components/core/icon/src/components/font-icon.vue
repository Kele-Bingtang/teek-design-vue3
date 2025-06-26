<script setup lang="ts">
defineOptions({ name: "FontIcon" });

defineProps<{ icon: string; iconType: "unicode" | "iconfont" | "symbol" }>();
</script>

<template>
  <i v-if="iconType === 'unicode'" class="iconfont-sys" v-html="icon" />
  <i v-else-if="iconType === 'iconfont'" :class="`iconfont-sys ${icon}`"></i>
  <svg v-else-if="iconType === 'symbol'" class="icon-svg" aria-hidden="true">
    <use :xlink:href="`#${icon}`"></use>
  </svg>
</template>
