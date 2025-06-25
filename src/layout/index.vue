<template>
  <component :is="LayoutComponents[layoutMode]" />
  <ThemePanel />
  <Watermark />
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { storeToRefs } from "pinia";
import { useMediaQuery } from "@vueuse/core";
import { useSettingStore } from "@/pinia";
import { useUpgrade } from "@/composables";
import { LayoutModeEnum } from "@/common/enums/appEnum";
import { mobileMaxWidthMedia } from "@/common/config";
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

const isMobile = useMediaQuery(mobileMaxWidthMedia);

// 移动端默认为 Vertical 布局
watch(isMobile, () => {
  settingStore.$patch({ layoutMode: LayoutModeEnum.Vertical });
});
</script>
