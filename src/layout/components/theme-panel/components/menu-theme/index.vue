<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { MenuThemeEnum } from "@/common/enums";
import lightTheme from "@/common/assets/images/menu-theme/light.png";
import darkTheme from "@/common/assets/images/menu-theme/dark.png";
import blueTheme from "@/common/assets/images/menu-theme/blue.png";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";

defineOptions({ name: "MenuTheme" });

const ns = useNamespace("menu-theme");
const settingStore = useSettingStore();
const { t } = useI18n();

const { menu, isDark } = storeToRefs(settingStore);

const menuThemeModeList = computed(() => [
  {
    name: t("_setting.menu.themeSelect.light"),
    theme: MenuThemeEnum.Light,
    img: lightTheme,
  },
  {
    name: t("_setting.menu.themeSelect.dark"),
    theme: MenuThemeEnum.Dark,
    img: darkTheme,
  },
  {
    name: t("_setting.menu.themeSelect.blue"),
    theme: MenuThemeEnum.Blue,
    img: blueTheme,
  },
]);

/**
 * 切换菜单主题
 */
const switchMenuTheme = (theme: MenuThemeEnum) => {
  if (isDark.value) return;
  settingStore.$patch({ menu: { theme } });
};
</script>

<template>
  <div :class="ns.b()" class="flx-wrap gap-15">
    <div v-for="item in menuThemeModeList" :key="item.theme" :class="ns.e('item')">
      <div
        :class="[ns.e('box'), ns.is('active', item.theme === menu.theme)]"
        @click="switchMenuTheme(item.theme)"
        :style="{ cursor: isDark ? 'not-allowed' : 'pointer' }"
      >
        <img :src="item.img" />
      </div>
      <Icon :class="ns.m('icon')" v-show="item.theme === menu.theme"><CircleCheckFilled /></Icon>
      <p :class="ns.m('name')">{{ item.name }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
