<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Expand, Fold } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";

defineOptions({ name: "CollapseTrigger" });

const ns = useNamespace("collapse-trigger");
const settingStore = useSettingStore();
const { menu } = storeToRefs(settingStore);

/**
 * 切换侧边菜单
 */
const toggleTrigger = () => settingStore.toggleSideMenu();
</script>

<template>
  <div :class="ns.b()" class="flx-center" @click.stop="toggleTrigger">
    <Icon>
      <component :is="menu.collapsed ? Expand : Fold" />
    </Icon>

    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
