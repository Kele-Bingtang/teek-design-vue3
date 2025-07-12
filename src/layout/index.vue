<template>
  <component :is="LayoutComponents[layoutMode]" />
  <ThemePanel />
  <LockPanel />
  <Watermark />
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/pinia";
import { useCommon, useUpgrade } from "@/composables";
import { LayoutModeEnum } from "@/common/enums/appEnum";
import LockPanel from "./components/lock-panel/index.vue";
import ThemePanel from "./components/theme-panel/index.vue";
import Watermark from "./components/watermark/index.vue";
import LayoutVertical from "./layout-vertical/index.vue";
import LayoutClassic from "./layout-classic/index.vue";
import LayoutHorizontal from "./layout-horizontal/index.vue";
import LayoutColumns from "./layout-columns/index.vue";
import LayoutMixins from "./layout-mixins/index.vue";
import LayoutIFrame from "./layout-iframe/index.vue";

import "./base-layout.scss";

defineOptions({ name: "Layout" });

// 布局组件
const LayoutComponents: Record<string, Component> = {
  [LayoutModeEnum.Vertical]: LayoutVertical,
  [LayoutModeEnum.Classic]: LayoutClassic,
  [LayoutModeEnum.Horizontal]: LayoutHorizontal,
  [LayoutModeEnum.Columns]: LayoutColumns,
  [LayoutModeEnum.Mixins]: LayoutMixins,
  [LayoutModeEnum.IFrame]: LayoutIFrame,
};

const settingStore = useSettingStore();
const { layoutMode } = storeToRefs(settingStore);

// 系统版本升级
useUpgrade();

const { isMobile } = useCommon();

// 移动端默认为 Vertical 布局
watch(isMobile, () => {
  settingStore.$patch({ layoutMode: LayoutModeEnum.Vertical });
});
</script>
