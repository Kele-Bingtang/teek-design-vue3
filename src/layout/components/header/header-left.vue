<script setup lang="ts" name="HeaderLeft">
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/pinia";
import { useNamespace } from "@/composables";
import { useMediaQuery } from "@vueuse/core";
import { mobileMaxWidthMedia } from "@/common/config";
import Breadcrumb from "./components/breadcrumb/index.vue";
import CollapseTrigger from "./components/collapse-trigger/index.vue";

defineOptions({ name: "HeaderLeft" });

const ns = useNamespace("header-left");
const settingStore = useSettingStore();
const { showBreadcrumb } = storeToRefs(settingStore);

const isMobile = useMediaQuery(mobileMaxWidthMedia);
</script>

<template>
  <div :class="[ns.b(), 'flx-center']">
    <CollapseTrigger />
    <Breadcrumb v-if="showBreadcrumb && !isMobile" />
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(header-left) {
  height: 100%;
  padding-right: 15px;
  overflow: hidden;
  white-space: nowrap;
}
</style>
