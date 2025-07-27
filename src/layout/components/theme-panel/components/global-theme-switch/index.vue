<script setup lang="ts">
import { useNamespace, useTheme } from "@/composables";
import { useSettingStore } from "@/pinia";
import { serviceConfig } from "@/common/config";

defineOptions({ name: "GlobalThemeSwitch" });

const ns = useNamespace("global-theme-select");

const { changePrimaryColor, changeGreyOrWeak } = useTheme();
const settingStore = useSettingStore();

const { layout, theme } = storeToRefs(settingStore);

// 预定义主题颜色
const colorList = [
  serviceConfig.theme.primaryColor,
  "#DAA96E",
  "#0C819F",
  "#5D87FF",
  "#27ae60",
  "#ff5c93",
  "#e74c3c",
  "#fd726d",
  "#f39c12",
  "#9b59b6",
];

const sizeOptions = [
  { label: "Large", value: "large" },
  { label: "Default", value: "default" },
  { label: "Small", value: "small" },
];
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.primaryColor") }}</span>
      <el-color-picker v-model="theme.primaryColor" :predefine="colorList" @change="changePrimaryColor()" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.greyMode") }}</span>
      <el-switch v-model="layout.isGrey" @change="changeGreyOrWeak($event as boolean, 'grey')" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.weakMode") }}</span>
      <el-switch v-model="layout.isWeak" @change="changeGreyOrWeak($event as boolean, 'weak')" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.epSize") }}</span>
      <el-select v-model="layout.elementPlusSize" placeholder="Select">
        <el-option v-for="item in sizeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
