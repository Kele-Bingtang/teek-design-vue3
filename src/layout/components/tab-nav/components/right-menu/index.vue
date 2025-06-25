<script setup lang="ts">
import type { TabProp } from "@/pinia";
import { useTabNav, type ContextMenuCondition } from "../../use-tab-nav";
import { Refresh, Close, ArrowLeft, ArrowRight, SemiSelect, FolderDelete } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "RightMenu" });

const ns = useNamespace("right-menu");

const { refreshSelectedTab, closeCurrentTab, closeLeftTab, closeRightTab, closeOthersTabs, closeAllTabs } = useTabNav();

interface RightMenuProps {
  selectedTab: TabProp;
  visible?: boolean;
  left?: number;
  top?: number;
  condition?: ContextMenuCondition;
}

withDefaults(defineProps<RightMenuProps>(), {
  visible: false,
  left: 0,
  right: 0,
  condition: () => ({ refresh: false, current: false, left: false, right: false, other: false, all: false }),
});
</script>

<template>
  <ul v-show="visible" :style="{ left: `${left}px`, top: `${top}px` }" :class="ns.b()">
    <li v-if="condition.refresh" @click="refreshSelectedTab(selectedTab)">
      <Icon class="right-menu-icon"><Refresh /></Icon>
      {{ $t("_tabNav.refresh") }}
    </li>
    <li v-if="condition.current" @click="closeCurrentTab(selectedTab)">
      <Icon class="right-menu-icon"><Close /></Icon>
      {{ $t("_tabNav.closeCurrent") }}
    </li>
    <li v-if="condition.left" @click="closeLeftTab(selectedTab)">
      <Icon class="right-menu-icon"><ArrowLeft /></Icon>
      {{ $t("_tabNav.closeLeft") }}
    </li>
    <li v-if="condition.right" @click="closeRightTab(selectedTab)">
      <Icon class="right-menu-icon"><ArrowRight /></Icon>
      {{ $t("_tabNav.closeRight") }}
    </li>
    <li v-if="condition.other" @click="closeOthersTabs(selectedTab)">
      <Icon class="right-menu-icon"><SemiSelect /></Icon>
      {{ $t("_tabNav.closeOthers") }}
    </li>
    <li v-if="condition.all" @click="closeAllTabs()">
      <Icon class="right-menu-icon"><FolderDelete /></Icon>
      {{ $t("_tabNav.closeAll") }}
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
