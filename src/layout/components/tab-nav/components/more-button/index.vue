<script setup lang="ts">
import { ref, watch } from "vue";
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
  FolderDelete,
} from "@element-plus/icons-vue";
import { useDebounceFn } from "@vueuse/core";
import { useSettingStore } from "@/pinia";
import { useTabNav } from "../../use-tab-nav";

defineOptions({ name: "TabNavButton" });

const {
  contextMenuCondition,
  getTabByRoute,
  initContextMenu,
  refreshSelectedTab,
  closeCurrentTab,
  closeLeftTab,
  closeRightTab,
  closeOthersTabs,
  closeAllTabs,
} = useTabNav();

const route = useRoute();
const settingStore = useSettingStore();

const selectedTab = ref(getTabByRoute(route));

const expandDropdown = () => {
  useDebounceFn(() => {
    initContextMenu(selectedTab.value);
  }, 100)();
};

const useMaximize = () => {
  settingStore.$patch({ maximize: true });
};

watch(
  () => route.fullPath,
  () => (selectedTab.value = getTabByRoute(route))
);
</script>

<template>
  <el-dropdown trigger="click" :teleported="false">
    <slot>
      <el-button text size="small" @click="expandDropdown">
        <span>{{ $t("_tabNav.more") }}</span>
        <Icon class="el-icon--right"><ArrowDown /></Icon>
      </el-button>
    </slot>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="refreshSelectedTab(selectedTab)" :disabled="!contextMenuCondition.refresh">
          <Icon><Refresh /></Icon>
          {{ $t("_tabNav.refresh") }}
        </el-dropdown-item>
        <el-dropdown-item @click="useMaximize">
          <Icon><FullScreen /></Icon>
          {{ $t("_tabNav.maximize") }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="closeCurrentTab(selectedTab)" :disabled="!contextMenuCondition.current">
          <Icon><Close /></Icon>
          {{ $t("_tabNav.closeCurrent") }}
        </el-dropdown-item>
        <el-dropdown-item @click="closeLeftTab(selectedTab)" :disabled="!contextMenuCondition.left">
          <Icon><ArrowLeft /></Icon>
          {{ $t("_tabNav.closeLeft") }}
        </el-dropdown-item>
        <el-dropdown-item @click="closeRightTab(selectedTab)" :disabled="!contextMenuCondition.right">
          <Icon><ArrowRight /></Icon>
          {{ $t("_tabNav.closeRight") }}
        </el-dropdown-item>
        <el-dropdown-item @click="closeOthersTabs(selectedTab)" :disabled="!contextMenuCondition.other">
          <Icon><SemiSelect /></Icon>
          {{ $t("_tabNav.closeOthers") }}
        </el-dropdown-item>
        <el-dropdown-item @click="closeAllTabs()" :disabled="!contextMenuCondition.all">
          <Icon><FolderDelete /></Icon>
          {{ $t("_tabNav.closeAll") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
