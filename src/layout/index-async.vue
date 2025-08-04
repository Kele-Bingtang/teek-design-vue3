<template>
  <suspense>
    <template #default>
      <component :is="LayoutComponents[layout.layoutMode]" />
    </template>
    <template #fallback>
      <Loading />
    </template>
  </suspense>

  <ThemePanel />
  <Watermark />

  <el-button v-if="showThemePanelTrigger" type="primary" class="theme-panel__trigger" @click="openThemePanel">
    <Icon :size="20"><Setting /></Icon>
  </el-button>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { defineAsyncComponent, watch } from "vue";
import { storeToRefs } from "pinia";
import { LayoutModeEnum, ThemePanelTriggerPositionEnum } from "@/common/enums";
import { useCommon, useUpgrade, useMittBus } from "@/composables";
import { useSettingStore } from "@/pinia";
import ThemePanel from "./components/theme-panel/index.vue";
import Watermark from "./components/watermark/index.vue";
import Loading from "./components/loading/index.vue";

import "./base-layout.scss";

defineOptions({ name: "Layout" });

// 布局组件
const LayoutComponents: Record<string, Component> = {
  [LayoutModeEnum.Vertical]: defineAsyncComponent(() => import("./layout-vertical/index.vue")),
  [LayoutModeEnum.Classic]: defineAsyncComponent(() => import("./layout-classic/index.vue")),
  [LayoutModeEnum.Horizontal]: defineAsyncComponent(() => import("./layout-horizontal/index.vue")),
  [LayoutModeEnum.Columns]: defineAsyncComponent(() => import("./layout-columns/index.vue")),
  [LayoutModeEnum.Mixins]: defineAsyncComponent(() => import("./layout-mixins/index.vue")),
  [LayoutModeEnum.IFrame]: defineAsyncComponent(() => import("./layout-iframe/index.vue")),
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
