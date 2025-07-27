<script setup lang="ts">
import { Close } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";

defineOptions({ name: "CustomTransition" });

const ns = useNamespace("maximize");

const settingStore = useSettingStore();

/**
 * 退出最大化
 */
const exitMaximize = () => {
  settingStore.$patch({ layout: { maximize: false } });
};
</script>

<template>
  <div :class="ns.b()" @click="exitMaximize">
    <Icon class="close-icon"><Close /></Icon>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(maximize) {
  position: fixed;
  top: -25px;
  right: -25px;
  z-index: 999;
  width: 52px;
  height: 52px;
  cursor: pointer;
  background-color: cssVar(gray-600);
  border-radius: 50%;
  opacity: 0.7;

  &:hover {
    background-color: cssVar(gray-700);
  }

  .close-icon {
    position: relative;
    top: 68%;
    left: 32%;
    font-size: 16px;
    color: #ffffff;
    transform: translate(-50%, -50%);
  }
}
</style>
