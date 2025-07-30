<script setup lang="ts">
import type { TabProps } from "@/pinia";
import type { ContextMenuCondition } from "../../use-tab-nav";
import { unref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useEventListener } from "@vueuse/core";
import {
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
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";
import { useTabNav } from "../../use-tab-nav";

defineOptions({ name: "RightMenu" });

const ns = useNamespace("right-menu");
const settingStore = useSettingStore();

const {
  tabNavList,
  refreshSelectedTab,
  toggleFixed,
  closeTab,
  closeLeftTab,
  closeRightTab,
  closeOthersTabs,
  closeAllTabs,
} = useTabNav();

interface RightMenuProps {
  selectedTab: TabProps;
  left?: number;
  top?: number;
  condition?: Partial<ContextMenuCondition>;
}

const props = withDefaults(defineProps<RightMenuProps>(), {
  left: 0,
  right: 0,
  condition: () => ({}),
});

const visible = defineModel({ default: false });

const { t } = useI18n();

const triggerMaximize = () => {
  settingStore.$patch({ layout: { maximize: true } });
};

const rightMenuItem = [
  {
    label: t("_tabNav.refresh"),
    icon: Refresh,
    disabled: computed(() => !props.condition.refresh),
    click: () => refreshSelectedTab(props.selectedTab),
  },
  {
    label: computed(() => (props.selectedTab.close ? t("_tabNav.fixed") : t("_tabNav.unfixed"))),
    icon: computed(() => (props.selectedTab.close ? Lock : Unlock)),
    disabled: computed(() => tabNavList.value.length <= 1),
    click: () => toggleFixed(props.selectedTab.path),
  },
  {
    label: t("_tabNav.maximize"),
    icon: FullScreen,
    click: triggerMaximize,
  },
  {
    label: t("_tabNav.openInNewTab"),
    icon: TopRight,
    click: () => openRouteInNewWindow(props.selectedTab.path),
  },
  {
    label: t("_tabNav.closeCurrent"),
    icon: Close,
    disabled: computed(() => !props.condition.current),
    click: () => closeTab(props.selectedTab),
    divided: true,
  },
  {
    label: t("_tabNav.closeLeft"),
    icon: ArrowLeft,
    disabled: computed(() => !props.condition.left),
    click: () => closeLeftTab(props.selectedTab),
  },
  {
    label: t("_tabNav.closeRight"),
    icon: ArrowRight,
    disabled: computed(() => !props.condition.right),
    click: () => closeRightTab(props.selectedTab),
  },
  {
    label: t("_tabNav.closeOthers"),
    icon: SemiSelect,
    disabled: computed(() => !props.condition.other),
    click: () => closeOthersTabs(props.selectedTab),
  },
  {
    label: t("_tabNav.closeAll"),
    icon: CircleClose,
    disabled: computed(() => !props.condition.all),
    click: () => closeAllTabs(),
  },
];

const close = () => (visible.value = false);

const handleClick = (item: (typeof rightMenuItem)[0]) => {
  if (unref(item.disabled) ?? false) return;
  item.click();
  close();
};

const handleOutsideClick = (e: Event) => {
  // 检查点击是否在菜单内部
  const target = e.target as Element;
  const menuElement = document.querySelector(`.${ns.b()}`);

  if (menuElement && menuElement.contains(target)) return;

  close();
};

// Escape 关闭右键菜单
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && visible.value) close();
};

useEventListener("click", handleOutsideClick, { capture: true });
useEventListener("keydown", handleKeydown, { capture: true });
</script>

<template>
  <ul v-show="visible" :style="{ left: `${left}px`, top: `${top}px` }" :class="ns.b()">
    <template v-for="item in rightMenuItem" :key="unref(item.label)">
      <li v-if="item.divided" class="divided" />

      <li :class="[ns.e('item'), ns.is('disabled', unref(item.disabled) ?? false)]" @click="handleClick(item)">
        <Icon class="right-menu-icon" :icon="unref(item.icon)" />
        {{ item.label }}
      </li>
    </template>
  </ul>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
