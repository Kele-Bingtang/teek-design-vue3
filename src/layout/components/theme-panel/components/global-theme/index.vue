<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { useNamespace, useTheme } from "@/composables";
import { useSettingStore } from "@/pinia";
import { serviceConfig } from "@/common/config";
import { GlobalThemeEnum } from "@/common/enums";
import lightTheme from "@/common/assets/images/system-theme/light.png";
import darkTheme from "@/common/assets/images/system-theme/dark.png";
import systemTheme from "@/common/assets/images/system-theme/system.png";

defineOptions({ name: "GlobalTheme" });

const ns = useNamespace("global-theme");

const { changeGlobalTheme, changePrimaryColor, changeGreyOrWeak } = useTheme();
const settingStore = useSettingStore();
const { t } = useI18n();

const { theme, primaryColor } = storeToRefs(settingStore);

const globalThemeModeList = [
  { name: computed(() => t("_setting.theme.modeSelect.light")), theme: GlobalThemeEnum.Light, img: lightTheme },
  { name: computed(() => t("_setting.theme.modeSelect.darkBlue")), theme: GlobalThemeEnum.DarkBlue, img: darkTheme },
  { name: computed(() => t("_setting.theme.modeSelect.darkDeep")), theme: GlobalThemeEnum.DarkDeep, img: darkTheme },
  {
    name: computed(() => t("_setting.theme.modeSelect.darkMidnight")),
    theme: GlobalThemeEnum.DarkMidnight,
    img: darkTheme,
  },
  {
    name: computed(() => t("_setting.theme.modeSelect.darkNeutral")),
    theme: GlobalThemeEnum.DarkNeutral,
    img: darkTheme,
  },
  { name: computed(() => t("_setting.theme.modeSelect.system")), theme: GlobalThemeEnum.System, img: systemTheme },
];

// 预定义主题颜色
const colorList = computed(() => [
  primaryColor.value,
  ...(serviceConfig.theme.presetsColor[
    theme.value.globalThemeMode === GlobalThemeEnum.System ? theme.value.defaultDarkMode : theme.value.globalThemeMode
  ] ?? []),
]);

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
    <div class="flx-wrap gap-15">
      <div
        v-for="item in globalThemeModeList"
        :key="item.theme"
        :class="ns.e('theme-item')"
        @click="changeGlobalTheme(item.theme)"
      >
        <div :class="[ns.e('box'), ns.is('active', item.theme === theme.globalThemeMode)]">
          <img :src="item.img" />
        </div>
        <Icon :class="ns.m('icon')" v-show="item.theme === theme.globalThemeMode"><CircleCheckFilled /></Icon>
        <p :class="ns.m('name')">{{ item.name }}</p>
      </div>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.theme.primaryColor") }}</span>
      <el-color-picker v-model="primaryColor" :predefine="colorList" @change="val => val && changePrimaryColor(val)" />
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
