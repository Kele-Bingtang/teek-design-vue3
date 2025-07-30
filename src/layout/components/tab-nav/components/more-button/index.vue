<script setup lang="ts">
import { unref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useDebounceFn } from "@vueuse/core";
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton } from "element-plus";
import {
  ArrowDown,
  Refresh,
  FullScreen,
  TopRight,
  Close,
  ArrowLeft,
  ArrowRight,
  SemiSelect,
  CircleClose,
  Lock,
  Unlock,
} from "@element-plus/icons-vue";
import { openRouteInNewWindow } from "@/common/utils";
import { useSettingStore } from "@/pinia";
import { useTabNav } from "../../use-tab-nav";

defineOptions({ name: "TabNavButton" });

const {
  tabNavList,
  activeTab,
  contextMenuCondition: condition,
  initContextMenu,
  refreshSelectedTab,
  toggleFixed,
  closeTab,
  closeLeftTab,
  closeRightTab,
  closeOthersTabs,
  closeAllTabs,
} = useTabNav();

const settingStore = useSettingStore();
const { t } = useI18n();

const expandDropdown = () => {
  useDebounceFn(() => {
    initContextMenu(activeTab.value);
  }, 100)();
};

const triggerMaximize = () => {
  settingStore.$patch({ layout: { maximize: true } });
};

const dropdownMenuItem = [
  {
    label: t("_tabNav.refresh"),
    icon: Refresh,
    disabled: computed(() => !condition.refresh),
    click: () => refreshSelectedTab(activeTab.value),
  },
  {
    label: computed(() => (activeTab.value.close ? t("_tabNav.fixed") : t("_tabNav.unfixed"))),
    icon: computed(() => (activeTab.value.close ? Lock : Unlock)),
    disabled: computed(() => tabNavList.value.length <= 1),
    click: () => toggleFixed(activeTab.value.path),
  },
  {
    label: t("_tabNav.maximize"),
    icon: FullScreen,
    click: triggerMaximize,
  },
  {
    label: t("_tabNav.openInNewTab"),
    icon: TopRight,
    click: () => openRouteInNewWindow(activeTab.value.path),
  },
  {
    label: t("_tabNav.closeCurrent"),
    icon: Close,
    disabled: computed(() => !condition.current),
    click: () => closeTab(activeTab.value),
    divided: true,
  },
  {
    label: t("_tabNav.closeLeft"),
    icon: ArrowLeft,
    disabled: computed(() => !condition.left),
    click: () => closeLeftTab(activeTab.value),
  },
  {
    label: t("_tabNav.closeRight"),
    icon: ArrowRight,
    disabled: computed(() => !condition.right),
    click: () => closeRightTab(activeTab.value),
  },
  {
    label: t("_tabNav.closeOthers"),
    icon: SemiSelect,
    disabled: computed(() => !condition.other),
    click: () => closeOthersTabs(activeTab.value),
  },
  {
    label: t("_tabNav.closeAll"),
    icon: CircleClose,
    disabled: computed(() => !condition.all),
    click: () => closeAllTabs(),
  },
];
</script>

<template>
  <el-dropdown trigger="click" :teleported="false">
    <el-button text size="small" @click="expandDropdown">
      <span>{{ $t("_tabNav.more") }}</span>
      <Icon class="el-icon--right"><ArrowDown /></Icon>
    </el-button>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in dropdownMenuItem"
          :key="unref(item.label)"
          :divided="item.divided ?? false"
          :disabled="unref(item.disabled)"
          :icon="unref(item.icon)"
          @click="item.click"
        >
          {{ unref(item.label) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
