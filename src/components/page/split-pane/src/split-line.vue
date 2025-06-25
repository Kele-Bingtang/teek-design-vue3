<script setup lang="ts">
import { computed } from "vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "SplitLine" });

const ns = useNamespace("split-trigger");

const props = defineProps<{ mode: "vertical" | "horizontal" }>();

const isVertical = computed(() => props.mode === "vertical");
const classes = computed(() => (isVertical.value ? ns.e("vertical") : ns.e("horizontal")));
const barConClasses = computed(() => (isVertical.value ? "vertical" : "horizontal"));
</script>

<template>
  <div :class="[ns.b(), classes]">
    <div :class="`${ns.e('bar')} ${barConClasses}`"></div>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

$trigger-background: #f8f8f9;

@include b(split-trigger) {
  @include e(bar) {
    position: absolute;
    overflow: hidden;

    &.horizontal {
      transform: translate(0, -50%);
    }

    &.vertical {
      transform: translate(-50%, 0);
    }
  }

  @include e(vertical, true) {
    width: 5px;
    height: 100%;
    cursor: col-resize;
    background: $trigger-background;

    @include e(bar) {
      position: absolute;
      left: 3px;
      z-index: 1;
      box-sizing: border-box;
      width: 1px;
      height: 100%;
      background: #000000;
      background-clip: padding-box;
      opacity: 0.3;
    }
  }

  @include e(horizontal, true) {
    width: 100%;
    height: 3px;
    cursor: row-resize;
    background: $trigger-background;
    box-shadow: 0 0 4px 0 rgb(28 36 56 / 40%);
  }
}
</style>
