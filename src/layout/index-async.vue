<template>
  <suspense>
    <template #default>
      <component :is="LayoutComponents[layoutMode]" />
    </template>
    <template #fallback>
      <Loading />
    </template>
  </suspense>

  <ThemePanel />
  <Watermark />
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useMediaQuery } from "@vueuse/core";
import { useSettingStore } from "@/pinia";
import { useUpgrade } from "@/composables";
import { LayoutModeEnum } from "@/common/enums/appEnum";
import { mobileMaxWidthMedia } from "@/common/config";
import ThemePanel from "./components/theme-panel/index.vue";
import Watermark from "./components/watermark/index.vue";
import Loading from "./components/loading/index.vue";

import "./base-layout.scss";

defineOptions({ name: "Layout" });

const LayoutComponents: Record<string, Component> = {
  [LayoutModeEnum.Vertical]: defineAsyncComponent(() => import("./layout-vertical/index.vue")),
  [LayoutModeEnum.Classic]: defineAsyncComponent(() => import("./layout-classic/index.vue")),
  [LayoutModeEnum.Horizontal]: defineAsyncComponent(() => import("./layout-horizontal/index.vue")),
  [LayoutModeEnum.Columns]: defineAsyncComponent(() => import("./layout-columns/index.vue")),
  [LayoutModeEnum.Mixins]: defineAsyncComponent(() => import("./layout-mixins/index.vue")),
  [LayoutModeEnum.IFrame]: defineAsyncComponent(() => import("./layout-iframe/index.vue")),
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
