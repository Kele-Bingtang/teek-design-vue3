<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import lightTheme from "@/common/assets/images/system-theme/light.png";
import darkTheme from "@/common/assets/images/system-theme/dark.png";
import systemTheme from "@/common/assets/images/system-theme/system.png";
import { useNamespace, useTheme } from "@/composables";
import { SystemThemeEnum } from "@/common/enums/appEnum";
import { useSettingStore } from "@/pinia";

defineOptions({ name: "SystemThemeSwitch" });

const ns = useNamespace("system-theme-switch");
const settingStore = useSettingStore();
const { t } = useI18n();

const { changeSystemTheme } = useTheme();

const { systemThemeMode } = storeToRefs(settingStore);

const systemThemeModeList = [
  { name: t("_setting.systemThemeModeSelect.light"), theme: SystemThemeEnum.Light, img: lightTheme },
  { name: t("_setting.systemThemeModeSelect.dark"), theme: SystemThemeEnum.Dark, img: darkTheme },
  { name: t("_setting.systemThemeModeSelect.system"), theme: SystemThemeEnum.System, img: systemTheme },
];
</script>

<template>
  <div :class="ns.b()" class="flx-wrap gap-15">
    <div
      v-for="item in systemThemeModeList"
      :key="item.theme"
      :class="ns.e('item')"
      @click="changeSystemTheme(item.theme)"
    >
      <div :class="[ns.e('box'), ns.is('active', item.theme === systemThemeMode)]">
        <img :src="item.img" />
      </div>
      <Icon :class="ns.m('icon')" v-show="item.theme === systemThemeMode"><CircleCheckFilled /></Icon>
      <p :class="ns.m('name')">{{ item.name }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
