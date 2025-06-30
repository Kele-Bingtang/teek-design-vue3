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
  <div :class="[ns.b(), 'flx-center']" @click.stop="toggleTrigger">
    <Icon>
      <component :is="isCollapse ? Expand : Fold" />
    </Icon>

    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
