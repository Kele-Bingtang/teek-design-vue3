<script setup lang="ts">
import { TabNavElementModeEnum } from "@/common/enums";
import { useSettingStore } from "@/pinia";
import SimpleTabNav from "./tab-nav-simple/index.vue";
import ClassicTabNav from "./tab-nav-classic/index.vue";
import ElTabNav from "./tab-nav-element/index.vue";

defineOptions({ name: "TabNav" });

const settingStore = useSettingStore();
const { tabNav } = storeToRefs(settingStore);

// 标签栏组件
const TabNavComponents: Record<string, Component> = {
  [TabNavElementModeEnum.Simple]: SimpleTabNav,
  [TabNavElementModeEnum.Classic]: ClassicTabNav,
  [TabNavElementModeEnum.Element]: ElTabNav,
};
</script>

<template>
  <component v-if="tabNav.enabled" :is="TabNavComponents[tabNav.elementMode]" />
</template>
