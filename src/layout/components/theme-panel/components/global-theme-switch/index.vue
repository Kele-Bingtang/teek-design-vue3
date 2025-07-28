<script setup lang="ts">
import { useNamespace, useTheme } from "@/composables";
import { useSettingStore } from "@/pinia";
import { serviceConfig } from "@/common/config";

defineOptions({ name: "GlobalThemeSwitch" });

const ns = useNamespace("global-theme-select");

const { changePrimaryColor, changeGreyOrWeak } = useTheme();
const settingStore = useSettingStore();

const { theme } = storeToRefs(settingStore);

// 预定义主题颜色
const colorList = [serviceConfig.theme.primaryColor, ...serviceConfig.theme.presetsColor];

/**
 * 自定义圆角选项
 */
const customRadiusOptions = [
  { value: "0", label: "0" },
  { value: "0.25", label: "0.25" },
  { value: "0.5", label: "0.5" },
  { value: "0.75", label: "0.75" },
  { value: "1", label: "1" },
  { value: "1.25", label: "1.25" },
  { value: "1.5", label: "1.5" },
  { value: "1.75", label: "1.75" },
  { value: "2", label: "2" },
];
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.theme.primaryColor") }}</span>
      <el-color-picker v-model="theme.primaryColor" :predefine="colorList" @change="changePrimaryColor()" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.theme.greyMode") }}</span>
      <el-switch v-model="theme.greyMode" @change="changeGreyOrWeak($event as boolean, 'greyMode')" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.theme.weakMode") }}</span>
      <el-switch v-model="theme.weakMode" @change="changeGreyOrWeak($event as boolean, 'weakMode')" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.theme.radius") }}</span>
      <el-select v-model="theme.radius" placeholder="Select">
        <el-option v-for="item in customRadiusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
