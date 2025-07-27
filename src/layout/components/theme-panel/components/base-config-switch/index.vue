<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/pinia";
import {
  HeaderMenuAlignEnum,
  HeaderStyleEnum,
  PageTransitionEnum,
  TabNavModeEnum,
  ThemePanelTriggerPositionEnum,
} from "@/common/enums";
import { useCommon, useNamespace } from "@/composables";

defineOptions({ name: "BaseConfigSwitch" });

const ns = useNamespace("base-config-switch");

const settingStore = useSettingStore();
const { isMobile } = useCommon();
const { t } = useI18n();

const { layout, tabNav, menu, transition, theme, breadcrumb, logo, header } = storeToRefs(settingStore);

/**
 * 标签栏模式选项
 */
const tabNavModeOptions = computed(() => [
  { value: TabNavModeEnum.Simple, label: t("_setting.tabNavModeSelect.simple") },
  { value: TabNavModeEnum.Classic, label: t("_setting.tabNavModeSelect.classic") },
  { value: TabNavModeEnum.Element, label: t("_setting.tabNavModeSelect.element") },
]);

/**
 * 页面过渡选项
 */
const pageTransitionOptions = computed(() => [
  { value: PageTransitionEnum.None, label: t("_setting.pageTransitionSelect.none") },
  { value: PageTransitionEnum.Fade, label: t("_setting.pageTransitionSelect.fade") },
  { value: PageTransitionEnum.SlideLeft, label: t("_setting.pageTransitionSelect.slideLeft") },
  { value: PageTransitionEnum.SlideTop, label: t("_setting.pageTransitionSelect.slideTop") },
  { value: PageTransitionEnum.SlideBottom, label: t("_setting.pageTransitionSelect.slideBottom") },
]);

/**
 * 头部样式选项
 */
const headerStyleOptions = computed(() => [
  { value: HeaderStyleEnum.Page, label: t("_setting.headerStyleSelect.page") },
  { value: HeaderStyleEnum.Bg, label: t("_setting.headerStyleSelect.background") },
  { value: HeaderStyleEnum.Line, label: t("_setting.headerStyleSelect.line") },
  { value: HeaderStyleEnum.BgLine, label: t("_setting.headerStyleSelect.backgroundLine") },
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

const headerMenuAlignOptions = [
  { value: HeaderMenuAlignEnum.Start, label: "Start" },
  { value: HeaderMenuAlignEnum.Center, label: "Center" },
  { value: HeaderMenuAlignEnum.End, label: "End" },
];

const themePanelTriggerPositionOptions = [
  { value: ThemePanelTriggerPositionEnum.Header, label: t("_setting.themePanelTriggerPosition.header") },
  { value: ThemePanelTriggerPositionEnum.Fixed, label: t("_setting.themePanelTriggerPosition.fixed") },
];
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.headerStyle") }}</span>
      <el-select v-model="header.style" placeholder="Select">
        <el-option v-for="item in headerStyleOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNavMode") }}</span>
      <el-select v-model="tabNav.tabNavMode" placeholder="Select">
        <el-option v-for="item in tabNavModeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.headerHeight") }}</span>
      <el-input-number v-model="header.height" :min="35" :max="70" :step="2" controls-position="right" />
      <!-- <el-slider v-model="header.headerHeight" :min="30" :max="70" /> -->
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.menuWidth") }}</span>
      <el-input-number v-model="menu.width" :min="100" :max="400" :step="10" controls-position="right" />
      <!-- <el-slider v-model="header.width" :min="100" :max="400" /> -->
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNavHeight") }}</span>
      <el-input-number v-model="tabNav.height" :min="25" :max="50" :step="10" controls-position="right" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.pageTransition") }}</span>
      <el-select v-model="transition.page" placeholder="Select">
        <el-option v-for="item in pageTransitionOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.radius") }}</span>
      <el-select v-model="theme.radius" placeholder="Select">
        <el-option v-for="item in customRadiusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.headerMenuAlign") }}</span>
      <el-select v-model="header.menuAlign" placeholder="Select">
        <el-option v-for="item in headerMenuAlignOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.themePanelTriggerPosition.label") }}</span>
      <el-select v-model="layout.themePanelTriggerPosition" placeholder="Select">
        <el-option
          v-for="item in themePanelTriggerPositionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.showHeader") }}</span>
      <el-switch v-model="header.enabled" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.collapseMenu") }}</span>
      <el-switch v-model="menu.isCollapse" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.menuAccordion") }}</span>
      <el-switch v-model="menu.accordion" />
    </div>

    <div :class="ns.e('item')" v-if="!isMobile">
      <span>{{ $t("_setting.showBreadcrumb") }}</span>
      <el-switch v-model="breadcrumb.enabled" />
    </div>

    <div :class="ns.e('item')" v-if="!isMobile">
      <span>{{ $t("_setting.showBreadcrumbIcon") }}</span>
      <el-switch v-model="breadcrumb.showIcon" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.showTabNav") }}</span>
      <el-switch v-model="tabNav.enabled" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.showTabNavIcon") }}</span>
      <el-switch v-model="tabNav.showTabNavIcon" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.showTabNavDot") }}</span>
      <el-switch v-model="tabNav.showTabNavDot" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.recordTabNav") }}</span>
      <el-switch v-model="tabNav.recordTabNav" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.fixTabNav") }}</span>
      <el-switch v-model="tabNav.fixTabNav" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.showLogo") }}</span>
      <el-switch v-model="logo.enable" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_tabNav.maximize") }}</span>
      <el-switch v-model="layout.maximize" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.watermark") }}</span>
      <el-switch v-model="layout.watermark" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.showProgress") }}</span>
      <el-switch v-model="transition.progress" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.breadcrumbHideOnlyOne") }}</span>
      <el-switch v-model="breadcrumb.hideOnlyOne" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.breadcrumbShowHome") }}</span>
      <el-switch v-model="breadcrumb.showHome" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.breadcrumbOnlyShowHomeIcon") }}</span>
      <el-switch v-model="breadcrumb.onlyShowHomeIcon" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNavDraggable") }}</span>
      <el-switch v-model="tabNav.draggable" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNavMiddleClickToClose") }}</span>
      <el-switch v-model="tabNav.middleClickToClose" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNavMiddleClickToOpen") }}</span>
      <el-switch v-model="tabNav.middleClickToOpen" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNavShowMore") }}</span>
      <el-switch v-model="tabNav.showMore" />
    </div>
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNavWheel") }}</span>
      <el-switch v-model="tabNav.wheel" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
