<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Expand, Fold } from "@element-plus/icons-vue";
import { useSettingStore } from "@/pinia";
import { useNamespace } from "@/composables";

defineOptions({ name: "CollapseTrigger" });

const ns = useNamespace("collapse-trigger");
const settingStore = useSettingStore();
const { isCollapse } = storeToRefs(settingStore);

const toggleTrigger = () => {
  settingStore.toggleSideMenu();
};
</script>

<template>
  <Icon :class="ns.b()" @click.stop="toggleTrigger">
    <component :is="isCollapse ? Expand : Fold"></component>
  </Icon>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
