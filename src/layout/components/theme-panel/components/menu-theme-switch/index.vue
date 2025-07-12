<script setup lang="ts">
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { LayoutModeEnum, MenuThemeEnum } from "@/common/enums/appEnum";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";
import lightTheme from "@/common/assets/images/menu-theme/light.png";
import darkTheme from "@/common/assets/images/menu-theme/dark.png";
import { useI18n } from "vue-i18n";

defineOptions({ name: "MenuThemeSwitch" });

const ns = useNamespace("menu-theme-switch");
const settingStore = useSettingStore();
const { t } = useI18n();

const { menuTheme, layoutMode } = storeToRefs(settingStore);

const menuThemeModeList = [
  { name: t("_setting.menuThemeSelect.light"), theme: MenuThemeEnum.Light, img: lightTheme },
  { name: t("_setting.menuThemeSelect.dark"), theme: MenuThemeEnum.Dark, img: darkTheme },
];

const isDisable = computed(() => [LayoutModeEnum.Horizontal, LayoutModeEnum.Columns].includes(layoutMode.value));

/**
 * 切换菜单主题
 */
const switchMenuTheme = (menuTheme: MenuThemeEnum) => {
  if (isDisable.value) return;
  settingStore.$patch({ menuTheme });
};
</script>

<template>
  <div :class="ns.b()" class="flx-wrap gap-15">
    <div v-for="item in menuThemeModeList" :key="item.theme" :class="ns.e('item')">
      <div
        :class="[ns.e('box'), ns.is('active', item.theme === menuTheme)]"
        @click="switchMenuTheme(item.theme)"
        :style="{ cursor: isDisable ? 'not-allowed' : 'pointer' }"
      >
        <img :src="item.img" />
      </div>
      <Icon :class="ns.m('icon')" v-show="item.theme === menuTheme"><CircleCheckFilled /></Icon>
      <p :class="ns.m('name')">{{ item.name }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
