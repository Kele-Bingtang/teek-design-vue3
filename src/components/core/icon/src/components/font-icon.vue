<script setup lang="ts">
defineOptions({ name: "FontIcon" });

defineProps<{ icon: string; iconType: "unicode" | "iconfont" | "symbol" | "" }>();
</script>

<template>
  <i v-if="iconType === 'unicode'" class="iconfont iconfont-sys" v-html="icon" />
  <svg v-else-if="iconType === 'symbol'" class="svg-icon" aria-hidden="true">
    <use :xlink:href="`#${icon}`"></use>
  </svg>
  <!-- 默认为  iconfont-->
  <i v-else :class="`iconfont iconfont-sys ${icon}`" />
</template>
