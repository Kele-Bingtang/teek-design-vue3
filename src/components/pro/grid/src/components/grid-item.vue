<script setup lang="ts">
import type { Ref } from "vue";
import type { GridItemProps, BreakPoint } from "../types";
import { computed, inject, ref, useAttrs, watch, nextTick } from "vue";

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
  collapseTransition: false,
  collapseDuration: 300,
});

const attrs = useAttrs() as { index: string };

const isShow = ref(true);
const transitionName = ref();

// 引入断点
const breakPoint = inject<Ref<BreakPoint>>("breakPoint", ref("xl"));
const shouldHiddenIndex = inject<Ref<number>>("shouldHiddenIndex", ref(-1));

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

const collapseDuration = computed(() => `${props.collapseDuration}ms`);

watch(
  () => [shouldHiddenIndex.value, breakPoint.value],
  nv => {
    if (attrs.index) {
      isShow.value = !(nv[0] !== -1 && parseInt(attrs.index) >= Number(nv[0]));
    }
  },
  { immediate: true }
);

watch(
  () => props.collapseTransition,
  async newVal => {
    // 避免第一次进入就开启动画
    await nextTick();
    if (newVal) transitionName.value = "fade";
  },
  { flush: "post", immediate: true }
);
</script>

<template>
  <Transition :name="transitionName">
    <div v-show="isShow" :style="style">
      <slot></slot>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity v-bind(collapseDuration) linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
