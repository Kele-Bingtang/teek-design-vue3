<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useSettingStore } from "@/pinia";
import { HeaderStyleEnum, PageTransitionEnum, TabNavModeEnum } from "@/common/enums";
import { useCommon, useNamespace } from "@/composables";

defineOptions({ name: "BaseConfigSwitch" });

const ns = useNamespace("base-config-switch");

const settingStore = useSettingStore();
const { isMobile } = useCommon();
const { t } = useI18n();

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
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.headerStyle") }}</span>
      <el-select v-model="settingStore.headerStyle" placeholder="Select">
        <el-option v-for="item in headerStyleOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.tabNavMode") }}</span>
      <el-select v-model="settingStore.tabNavMode" placeholder="Select">
        <el-option v-for="item in tabNavModeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.headerHeight") }}</span>
      <el-input-number v-model="settingStore.headerHeight" :min="35" :max="70" :step="2" controls-position="right" />
      <!-- <el-slider v-model="settingStore.headerHeight" :min="30" :max="70" /> -->
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.menuWidth") }}</span>
      <el-input-number v-model="settingStore.menuWidth" :min="100" :max="400" :step="10" controls-position="right" />
      <!-- <el-slider v-model="settingStore.menuWidth" :min="100" :max="400" /> -->
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.pageTransition") }}</span>
      <el-select v-model="settingStore.pageTransition" placeholder="Select">
        <el-option v-for="item in pageTransitionOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.radius") }}</span>
      <el-select v-model="settingStore.radius" placeholder="Select">
        <el-option v-for="item in customRadiusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.collapseMenu") }}</span>
      <el-switch v-model="settingStore.isCollapse" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.menuAccordion") }}</span>
      <el-switch v-model="settingStore.menuAccordion" />
    </div>

    <div :class="ns.e('item')" v-if="!isMobile">
      <span>{{ $t("_setting.showBreadcrumb") }}</span>
      <el-switch v-model="settingStore.showBreadcrumb" />
    </div>

    <div :class="ns.e('item')" v-if="!isMobile">
      <span>{{ $t("_setting.showBreadcrumbIcon") }}</span>
      <el-switch v-model="settingStore.showBreadcrumbIcon" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.showTabNav") }}</span>
      <el-switch v-model="settingStore.showTabNav" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.showTabNavIcon") }}</span>
      <el-switch v-model="settingStore.showTabNavIcon" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.showTabNavDot") }}</span>
      <el-switch v-model="settingStore.showTabNavDot" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.recordTabNav") }}</span>
      <el-switch v-model="settingStore.recordTabNav" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.fixTabNav") }}</span>
      <el-switch v-model="settingStore.fixTabNav" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.showLayoutLogo") }}</span>
      <el-switch v-model="settingStore.showLayoutLogo" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_tabNav.maximize") }}</span>
      <el-switch v-model="settingStore.maximize" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.watermark") }}</span>
      <el-switch v-model="settingStore.watermark" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
