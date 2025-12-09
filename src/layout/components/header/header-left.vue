<script setup lang="ts" name="HeaderLeft">
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/pinia";
import { useCommon, useNamespace } from "@/composables";
import Breadcrumb from "./components/breadcrumb/index.vue";
import Refresh from "./components/refresh/index.vue";
import CollapseTrigger from "./components/collapse-trigger/index.vue";

defineOptions({ name: "HeaderLeft" });

const ns = useNamespace("header-left");
const settingStore = useSettingStore();
const { breadcrumb, widget } = storeToRefs(settingStore);

const { isMobile } = useCommon();
</script>

<template>
  <div :class="ns.b()" class="flx-center">
    <CollapseTrigger v-if="widget.menuCollapse" />
    <Refresh v-if="widget.refresh" />
    <Breadcrumb v-if="breadcrumb.enabled && !isMobile" />
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(header-left) {
  height: 100%;
  padding-right: 15px;
  overflow: hidden;
  white-space: nowrap;

  > div:not(.customize) {
    &:hover {
      background-color: cssVar(layout-header-bg-hover-color);
    }
  }
}
</style>
