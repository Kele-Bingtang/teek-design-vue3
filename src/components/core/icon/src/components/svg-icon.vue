<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "SvgIcon" });

interface SvgProps {
  icon: string; // 图标的名称，必传
  prefix?: string; // 图标的前缀，非必传（默认为 icon）
}

// 接收父组件参数并设置默认值
const props = withDefaults(defineProps<SvgProps>(), {
  prefix: "icon",
});

const iconName = computed(() => `#${props.prefix}-${props.icon}`);
const iconClass = computed(() => {
  if (props.icon) return `svg-icon ${props.icon}`;
  return "svg-icon";
});
</script>

<template>
  <svg :class="iconClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>
