<script setup lang="ts">
import { ref, watch, unref } from "vue";
import { useRoute } from "vue-router";
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton } from "element-plus";
import {
  ArrowDown,
  Refresh,
  FullScreen,
  Close,
  ArrowLeft,
  ArrowRight,
  SemiSelect,
  CircleClose,
  Lock,
  Unlock,
} from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import { useDebounceFn } from "@vueuse/core";
import { useSettingStore } from "@/pinia";
import { useTabNav } from "../../use-tab-nav";

defineOptions({ name: "TabNavButton" });

const {
  contextMenuCondition: condition,
  getTabByPath,
  getTabByRoute,
  initContextMenu,
  refreshSelectedTab,
  toggleFixedTab,
  closeCurrentTab,
  closeLeftTab,
  closeRightTab,
  closeOthersTabs,
  closeAllTabs,
} = useTabNav();

const route = useRoute();
const settingStore = useSettingStore();
const { t } = useI18n();

const selectedTab = ref(getTabByPath(route.meta._fullPath || route.path) || getTabByRoute(route));

const expandDropdown = () => {
  useDebounceFn(() => {
    initContextMenu(selectedTab.value);
  }, 100)();
};

const useMaximize = () => {
  settingStore.$patch({ maximize: true });
};

const dropdownMenuItem = [
  {
    label: t("_tabNav.refresh"),
    icon: Refresh,
    disabled: computed(() => !condition.refresh),
    click: () => refreshSelectedTab(selectedTab.value),
  },
  {
    label: computed(() => (selectedTab.value.close ? t("_tabNav.fixed") : t("_tabNav.unfixed"))),
    icon: computed(() => (selectedTab.value.close ? Lock : Unlock)),
    click: () => toggleFixedTab(selectedTab.value.path),
  },
  {
    label: t("_tabNav.maximize"),
    icon: FullScreen,
    click: useMaximize,
  },
  {
    label: t("_tabNav.closeCurrent"),
    icon: Close,
    disabled: computed(() => !condition.current),
    click: () => closeCurrentTab(selectedTab.value),
    divided: true,
  },
  {
    label: t("_tabNav.closeLeft"),
    icon: ArrowLeft,
    disabled: computed(() => !condition.left),
    click: () => closeLeftTab(selectedTab.value),
  },
  {
    label: t("_tabNav.closeRight"),
    icon: ArrowRight,
    disabled: computed(() => !condition.right),
    click: () => closeRightTab(selectedTab.value),
  },
  {
    label: t("_tabNav.closeOthers"),
    icon: SemiSelect,
    disabled: computed(() => !condition.other),
    click: () => closeOthersTabs(selectedTab.value),
  },
  {
    label: t("_tabNav.closeAll"),
    icon: CircleClose,
    disabled: computed(() => !condition.all),
    click: () => closeAllTabs(),
  },
];

watch(
  () => route.fullPath,
  () => (selectedTab.value = getTabByPath(route.meta._fullPath || route.path) || getTabByRoute(route))
);
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
