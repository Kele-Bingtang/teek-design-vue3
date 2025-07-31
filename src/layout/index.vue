<template>
  <component :is="LayoutComponents[layout.layoutMode]" />
  <ThemePanel />
  <LockPanel />
  <Watermark />
  <el-button v-if="showThemePanelTrigger" type="primary" class="theme-panel__trigger" @click="openThemePanel">
    <Icon :size="20"><Setting /></Icon>
  </el-button>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { Setting } from "@element-plus/icons-vue";
import { LayoutModeEnum, ThemePanelTriggerPositionEnum } from "@/common/enums";
import { useCommon, useMittBus, useUpgrade } from "@/composables";
import { useSettingStore } from "@/pinia";
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
const { layout, header } = storeToRefs(settingStore);

const { isMobile } = useCommon();
const { openThemePanel } = useMittBus();

// 系统版本升级
useUpgrade();

const showThemePanelTrigger = computed(() => {
  const { Header, Fixed } = ThemePanelTriggerPositionEnum;
  const { themePanelTriggerPosition } = layout.value;

  if (themePanelTriggerPosition === Fixed) return true;
  if (themePanelTriggerPosition === Header && header.value.enabled !== true) return true;

  return false;
});

// 移动端默认为 Vertical 布局
watch(isMobile, () => {
  settingStore.$patch({ layout: { layoutMode: LayoutModeEnum.Vertical } });
});
</script>

<style lang="scss" scoped>
.theme-panel__trigger {
  position: fixed;
  right: 0;
  bottom: 5rem;
  z-index: 99;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
