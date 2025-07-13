<script setup lang="ts">
import type { Ref } from "vue";
import type { GridItemProps, BreakPoint } from "../types";
import { computed, inject, ref, useAttrs, watch } from "vue";

defineOptions({ name: "GridItem" });

const props = withDefaults(defineProps<GridItemProps>(), {
  offset: 0,
  span: 1,
  suffix: false,
  xs: undefined,
  sm: undefined,
  md: undefined,
  lg: undefined,
  xl: undefined,
});

const attrs = useAttrs() as { index: string };

const isShow = ref(true);

// 引入断点
const breakPoint = inject<Ref<BreakPoint>>("breakPoint", ref("xl"));
const shouldHiddenIndex = inject<Ref<number>>("shouldHiddenIndex", ref(-1));

watch(
  () => [shouldHiddenIndex.value, breakPoint.value],
  nv => {
    if (attrs.index) {
      isShow.value = !(nv[0] !== -1 && parseInt(attrs.index) >= Number(nv[0]));
    }
  },
  { immediate: true }
);

const gap = inject("gap", 0);
const cols = inject("cols", ref(4));

// 计算 grid 布局样式
const style = computed(() => {
  const span = props[breakPoint.value]?.span ?? props.span;
  const offset = props[breakPoint.value]?.offset ?? props.offset;
  if (props.suffix) {
    return {
      gridColumnStart: cols.value - span - offset + 1,
      gridColumnEnd: `span ${span + offset}`,
      marginLeft: offset !== 0 ? `calc(((100% + ${gap}px) / ${span + offset}) * ${offset})` : "unset",
    };
  } else {
    const c = cols.value;
    return {
      gridColumn: `span ${span + offset > c ? c : span + offset}/span ${span + offset > c ? c : span + offset}`,
      marginLeft: offset !== 0 ? `calc(((100% + ${gap}px) / ${span + offset}) * ${offset})` : "unset",
    };
  }
});
</script>

<template>
  <div v-show="isShow" :style="style">
    <slot></slot>
  </div>
</template>
