<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useLayoutStore, useSettingStore } from "@/pinia";
import {
  HeaderMenuAlignEnum,
  HeaderStyleEnum,
  LanguageEnum,
  MenuShowModeEnum,
  PageTransitionEnum,
  TabNavElementModeEnum,
  ThemePanelTriggerPositionEnum,
  LayoutModeEnum,
  HeaderShowModeEnum,
  MenuStyleEnum,
} from "@/common/enums";
import { languageOptions } from "@/common/languages";
import { useBrowserTitle, useCommon, useNamespace } from "@/composables";

defineOptions({ name: "BaseConfig" });

const ns = useNamespace("base-config");

const settingStore = useSettingStore();
const layoutStore = useLayoutStore();
const { isMobile } = useCommon();
const { getBrowserTitle } = useBrowserTitle();
const { t, locale } = useI18n();

const { layout, header, menu, tabNav, breadcrumb, transition, logo, widget, shortcutKey } = storeToRefs(settingStore);
const { language } = storeToRefs(layoutStore);

/**
 * 标签栏模式选项
 */
const tabNavElementModeOptions = computed(() => [
  { value: TabNavElementModeEnum.Simple, label: t("_setting.tabNav.modeSelect.simple") },
  { value: TabNavElementModeEnum.Classic, label: t("_setting.tabNav.modeSelect.classic") },
  { value: TabNavElementModeEnum.Element, label: t("_setting.tabNav.modeSelect.element") },
]);

/**
 * 页面过渡选项
 */
const pageTransitionOptions = computed(() => [
  { value: PageTransitionEnum.None, label: t("_setting.transition.pageEnterSelect.none") },
  { value: PageTransitionEnum.Fade, label: t("_setting.transition.pageEnterSelect.fade") },
  { value: PageTransitionEnum.SlideLeft, label: t("_setting.transition.pageEnterSelect.slideLeft") },
  { value: PageTransitionEnum.SlideTop, label: t("_setting.transition.pageEnterSelect.slideTop") },
  { value: PageTransitionEnum.SlideBottom, label: t("_setting.transition.pageEnterSelect.slideBottom") },
]);

/**
 * 头部样式选项
 */
const headerStyleOptions = computed(() => [
  { value: HeaderStyleEnum.Page, label: t("_setting.header.styleSelect.page") },
  { value: HeaderStyleEnum.Bg, label: t("_setting.header.styleSelect.background") },
  { value: HeaderStyleEnum.Line, label: t("_setting.header.styleSelect.line") },
  { value: HeaderStyleEnum.BgLine, label: t("_setting.header.styleSelect.backgroundLine") },
]);

const headerMenuAlignOptions = [
  { value: HeaderMenuAlignEnum.Start, label: t("_setting.header.menuAlignSelect.start") },
  { value: HeaderMenuAlignEnum.Center, label: t("_setting.header.menuAlignSelect.center") },
  { value: HeaderMenuAlignEnum.End, label: t("_setting.header.menuAlignSelect.end") },
];

const menuStyleOptions = computed(() => [
  { value: MenuStyleEnum.Simple, label: t("_setting.menu.styleSelect.simple") },
  { value: MenuStyleEnum.Round, label: t("_setting.menu.styleSelect.round") },
]);

const menuShowModeOptions = computed(() => [
  { value: MenuShowModeEnum.Static, label: t("_setting.menu.showModeSelect.static") },
  { value: MenuShowModeEnum.AutoCollapse, label: t("_setting.menu.showModeSelect.autoCollapse") },
  { value: MenuShowModeEnum.AutoHidden, label: t("_setting.menu.showModeSelect.autoHidden") },
]);

const headerShowModeOptions = computed(() => [
  { value: HeaderShowModeEnum.Static, label: t("_setting.header.showModeSelect.static") },
  { value: HeaderShowModeEnum.Fixed, label: t("_setting.header.showModeSelect.fixed") },
  { value: HeaderShowModeEnum.AutoHidden, label: t("_setting.header.showModeSelect.autoHidden") },
  { value: HeaderShowModeEnum.ScrollHidden, label: t("_setting.header.showModeSelect.scrollHidden") },
]);

const sizeOptions = computed(() => [
  { label: "Large", value: "large" },
  { label: "Default", value: "default" },
  { label: "Small", value: "small" },
]);

const themePanelTriggerPositionOptions = computed(() => [
  { value: ThemePanelTriggerPositionEnum.Header, label: t("_setting.layout.themePanelTriggerPositionSelect.header") },
  { value: ThemePanelTriggerPositionEnum.Fixed, label: t("_setting.layout.themePanelTriggerPositionSelect.fixed") },
]);

/**
 * 切换语言
 */
const handleSelectLanguage = (lang: LanguageEnum) => {
  locale.value = lang;
  layoutStore.$patch({ language: lang });
  document.documentElement.lang = lang;
  window.document.title = getBrowserTitle();
};
</script>

<template>
  <div :class="ns.b()">
    <h3>{{ $t("_setting.header.label") }}</h3>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.header.enabled") }}</span>
      <el-switch v-model="header.enabled" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.header.height") }}</span>
      <el-input-number v-model="header.height" :min="35" :max="70" :step="2" controls-position="right" />
      <!-- <el-slider v-model="header.height" :min="30" :max="70" /> -->
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.header.style") }}</span>
      <el-select v-model="header.style" placeholder="Select">
        <el-option v-for="item in headerStyleOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.header.showMode") }}</span>
      <el-select v-model="header.showMode" placeholder="Select">
        <el-option v-for="item in headerShowModeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.header.menuAlign") }}</span>
      <el-select v-model="header.menuAlign" placeholder="Select">
        <el-option v-for="item in headerMenuAlignOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <h3>{{ $t("_setting.menu.label") }}</h3>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.menu.enabled") }}</span>
      <el-switch v-model="menu.enabled" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.menu.collapse") }}</span>
      <el-switch v-model="menu.collapsed" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.menu.accordion") }}</span>
      <el-switch v-model="menu.accordion" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.menu.autoActivateChild") }}</span>
      <el-switch v-model="menu.autoActivateChild" :disabled="![LayoutModeEnum.Columns].includes(layout.layoutMode)" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.menu.showModeAutoFixed") }}</span>
      <el-switch v-model="menu.showModeAutoFixed" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.menu.width") }}</span>
      <el-input-number v-model="menu.width" :min="100" :max="400" :step="10" controls-position="right" />
      <!-- <el-slider v-model="menu.width" :min="100" :max="400" /> -->
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.menu.style") }}</span>
      <el-select v-model="menu.style" placeholder="Select">
        <el-option v-for="item in menuStyleOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.menu.showMode") }}</span>
      <el-select v-model="menu.showMode" placeholder="Select">
        <el-option v-for="item in menuShowModeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.menu.rightClickMenuCollapseToClose") }}</span>
      <el-switch v-model="menu.rightClickMenuCollapseToClose" />
    </div>

    <h3>{{ $t("_setting.breadcrumb.label") }}</h3>

    <div :class="ns.e('item')" v-if="!isMobile">
      <span>{{ $t("_setting.breadcrumb.enabled") }}</span>
      <el-switch v-model="breadcrumb.enabled" />
    </div>

    <div :class="ns.e('item')" v-if="!isMobile">
      <span>{{ $t("_setting.breadcrumb.showIcon") }}</span>
      <el-switch v-model="breadcrumb.showIcon" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.breadcrumb.hideOnlyOne") }}</span>
      <el-switch v-model="breadcrumb.hideOnlyOne" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.breadcrumb.showHome") }}</span>
      <el-switch v-model="breadcrumb.showHome" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.breadcrumb.onlyShowHomeIcon") }}</span>
      <el-switch v-model="breadcrumb.onlyShowHomeIcon" />
    </div>

    <h3>{{ $t("_setting.tabNav.label") }}</h3>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNav.enabled") }}</span>
      <el-switch v-model="tabNav.enabled" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNav.mode") }}</span>
      <el-select v-model="tabNav.elementMode" placeholder="Select">
        <el-option v-for="item in tabNavElementModeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNav.height") }}</span>
      <el-input-number v-model="tabNav.height" :min="25" :max="50" :step="2" controls-position="right" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNav.maxCount") }}</span>
      <el-input-number v-model="tabNav.maxCount" :min="0" :max="30" :step="5" controls-position="right" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNav.showIcon") }}</span>
      <el-switch v-model="tabNav.showIcon" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNav.showDot") }}</span>
      <el-switch v-model="tabNav.showDot" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNav.persistence") }}</span>
      <el-switch v-model="tabNav.persistence" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNav.fixed") }}</span>
      <el-switch v-model="tabNav.fixed" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNav.draggable") }}</span>
      <el-switch v-model="tabNav.draggable" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNav.middleClickToClose") }}</span>
      <el-switch v-model="tabNav.middleClickToClose" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNav.middleClickToOpen") }}</span>
      <el-switch v-model="tabNav.middleClickToOpen" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNav.middleClickToOpenInNewWindow") }}</span>
      <el-switch v-model="tabNav.middleClickToOpenInNewWindow" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNav.showMore") }}</span>
      <el-switch v-model="tabNav.showMore" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNav.wheel") }}</span>
      <el-switch v-model="tabNav.wheel" />
    </div>

    <h3>{{ $t("_setting.commonLabel") }}</h3>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.logo.enable") }}</span>
      <el-switch v-model="logo.enable" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_tabNav.maximize") }}</span>
      <el-switch v-model="layout.maximize" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.layout.watermark") }}</span>
      <el-switch v-model="layout.watermark" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.layout.language") }}</span>
      <el-select v-model="language" @change="handleSelectLanguage" placeholder="Select">
        <el-option
          v-for="item in languageOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="language === item.value"
        />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.layout.epSize") }}</span>
      <el-select v-model="layout.elementPlusSize" placeholder="Select">
        <el-option v-for="item in sizeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.layout.themePanelTriggerPosition") }}</span>
      <el-select v-model="layout.themePanelTriggerPosition" placeholder="Select">
        <el-option
          v-for="item in themePanelTriggerPositionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <h3>{{ $t("_setting.transition.label") }}</h3>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.transition.pageEnter") }}</span>
      <el-select v-model="transition.pageEnter" placeholder="Select">
        <el-option v-for="item in pageTransitionOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.transition.progress") }}</span>
      <el-switch v-model="transition.progress" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.transition.loading") }}</span>
      <el-switch v-model="transition.loading" />
    </div>

    <h3>{{ $t("_setting.widget.label") }}</h3>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.widget.menuCollapse") }}</span>
      <el-switch v-model="widget.menuCollapse" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.widget.refresh") }}</span>
      <el-switch v-model="widget.refresh" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.widget.search") }}</span>
      <el-switch v-model="widget.search" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.widget.fullscreen") }}</span>
      <el-switch v-model="widget.fullscreen" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.widget.notification") }}</span>
      <el-switch v-model="widget.notification" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.widget.language") }}</span>
      <el-switch v-model="widget.language" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.widget.theme") }}</span>
      <el-switch v-model="widget.theme" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.widget.lockScreen") }}</span>
      <el-switch v-model="widget.lockScreen" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.widget.searchIcon") }}</span>
      <el-switch v-model="widget.searchIcon" />
    </div>

    <h3>{{ $t("_setting.shortcutKey.label") }}</h3>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.shortcutKey.enable") }}</span>
      <el-switch v-model="shortcutKey.enable" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.shortcutKey.search") }} Ctrl K</span>
      <el-switch v-model="shortcutKey.search" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.shortcutKey.logout") }} Alt Q</span>
      <el-switch v-model="shortcutKey.logout" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.shortcutKey.lockScreen") }} Alt L</span>
      <el-switch v-model="shortcutKey.lockScreen" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
