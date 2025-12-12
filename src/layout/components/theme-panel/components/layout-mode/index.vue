<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { LayoutModeEnum } from "@/common/enums";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";

defineOptions({ name: "LayoutMode" });

const ns = useNamespace("layout-mode");
const settingStore = useSettingStore();
const { t } = useI18n();

const { layout } = storeToRefs(settingStore);

const layoutModeList = computed(() => [
  {
    name: t("_setting.layout.layoutModeSelect.vertical"),
    mode: LayoutModeEnum.Vertical,
    content: `<div class="dark"></div> <div class="container"> <div class="light"></div><div class="content"></div> </div>`,
  },
  {
    name: t("_setting.layout.layoutModeSelect.classic"),
    mode: LayoutModeEnum.Classic,
    content: `<div class="dark"></div> <div class="container"> <div class="light"></div><div class="content"></div> </div>`,
  },
  {
    name: t("_setting.layout.layoutModeSelect.horizontal"),
    mode: LayoutModeEnum.Horizontal,
    content: `<div class="dark"></div> <div class="content"></div>`,
  },
  {
    name: t("_setting.layout.layoutModeSelect.columns"),
    mode: LayoutModeEnum.Columns,
    content: `<div class="dark"></div> <div class="light"></div> <div class="content"></div>`,
  },
  {
    name: t("_setting.layout.layoutModeSelect.mixins"),
    mode: LayoutModeEnum.Mixins,
    content: `<div class="dark"></div> <div class="container"> <div class="dark"></div><div class="content"></div> </div>`,
  },
  {
    name: t("_setting.layout.layoutModeSelect.iframe"),
    mode: LayoutModeEnum.IFrame,
    content: `<div class="dark"></div> <div class="content"></div>`,
  },
]);

/**
 * 切换布局模式
 */
const switchLayoutMode = (layoutMode: LayoutModeEnum) => {
  settingStore.$patch({
    layout: { layoutMode },
  });
};
</script>

<template>
  <div :class="ns.b()" class="flx-wrap gap-15">
    <div v-for="item in layoutModeList" :key="item.mode" :class="ns.e('item')" @click="switchLayoutMode(item.mode)">
      <div
        :class="[ns.e('box'), ns.join(item.mode), ns.is('active', item.mode === layout.layoutMode)]"
        v-html="item.content"
      ></div>
      <Icon :class="ns.m('icon')" v-show="item.mode === layout.layoutMode"><CircleCheckFilled /></Icon>
      <p :class="ns.m('name')">{{ item.name }}</p>
    </div>
  </div>
</template>

<style lang="scss">
@use "./index";
</style>
