<script setup lang="ts">
import { serviceConfig } from "@/common/config";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";
import { getCssVar } from "@/common/utils";

import "./index.scss";

defineOptions({ name: "Watermark" });

const ns = useNamespace("watermark");
const settingStore = useSettingStore();

const { layout, isDark } = storeToRefs(settingStore);

const watermark = serviceConfig.layout.name;

const color = computed(() => {
  const fontColor = getCssVar(ns.cssVarName("gray-color-300")) ?? undefined;
  // 监听 isDark 变化
  return isDark.value ? fontColor : fontColor;
});
</script>

<template>
  <div v-if="layout.watermark" :class="ns.b()">
    <el-watermark :content="watermark" :font="{ color }">
      <div style="height: 100vh"></div>
    </el-watermark>
  </div>
</template>
