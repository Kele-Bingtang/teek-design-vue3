<script setup lang="ts">
import { useNamespace } from "@/composables";

defineOptions({ name: "PointTag" });

const ns = useNamespace("point-tag");

interface PointTagProps {
  /** 颜色 */
  color?: string;
  /** 主题，当传入 color 时，会覆盖主题 */
  theme?: "primary" | "success" | "warning" | "danger" | "info" | "error" | "";
  /** 大小 */
  size?: number | string;
  /** 位置 */
  position?: "left" | "right";
  /** 偏移量 */
  offset?: number | string;
}

withDefaults(defineProps<PointTagProps>(), {
  color: "",
  theme: "primary",
  size: 8,
  position: "left",
  offset: 4,
});
</script>

<template>
  <i
    :class="[ns.b(), ns.is(position), ns.is(theme, !color)]"
    :style="{ '--point-color': color, '--point-size': size, '--point-offset': offset }"
  />
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(point-tag) {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: calc(var(--point-size) * 1px);
  height: calc(var(--point-size) * 1px);
  background-color: var(--point-color);
  border-radius: 50%;

  @include is(left) {
    margin-right: calc(var(--point-offset) * 1px);
  }

  @include is(right) {
    margin-left: calc(var(--point-offset) * 1px);
  }

  @include is(primary) {
    background-color: cssVarEl(color-primary);
  }

  @include is(success) {
    background-color: cssVarEl(color-success);
  }

  @include is(warning) {
    background-color: cssVarEl(color-warning);
  }

  @include is(danger) {
    background-color: cssVarEl(color-danger);
  }

  @include is(info) {
    background-color: cssVarEl(color-info);
  }

  @include is(error) {
    background-color: cssVarEl(color-error);
  }
}
</style>
