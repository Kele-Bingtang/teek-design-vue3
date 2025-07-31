<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Expand, Fold } from "@element-plus/icons-vue";
import { UpdateInMenuAreaStateKey } from "@/common/config";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";

defineOptions({ name: "CollapseTrigger" });

const ns = useNamespace("collapse-trigger");
const settingStore = useSettingStore();
const { menu } = storeToRefs(settingStore);

const updateInMenuAreaState = inject(UpdateInMenuAreaStateKey);

/**
 * 切换侧边菜单
 */
const toggleTrigger = () => {
  settingStore.toggleSideMenu();
  updateInMenuAreaState?.();
};

const rightClick = () => {
  if (menu.value.rightClickMenuCollapseToClose) menu.value.enabled = !menu.value.enabled;
};
</script>

<template>
  <div :class="ns.b()" class="flx-center" @click.left="toggleTrigger" @click.right.prevent="rightClick">
    <Icon :icon="menu.collapsed ? Expand : Fold" />
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
