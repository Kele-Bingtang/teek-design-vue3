<script setup lang="ts" name="UseComponent">
import { Vue3Menus, type menusItemType } from "vue3-menus";

defineProps<{ menus: menusItemType[] }>();

const isOpen = ref(false);
const eventVal = ref<any>({});
const rightClick = (event: MouseEvent) => {
  isOpen.value = false;
  nextTick(() => {
    eventVal.value = event;
    isOpen.value = true;
  });
  event.preventDefault();
};
</script>

<template>
  <div class="component-component" @click.stop @contextmenu="rightClick">组件方式打开菜单</div>
  <vue3-menus v-model:open="isOpen" :event="eventVal" :menus="menus"></vue3-menus>

  <!-- <vue3-menus v-model:open="isOpen" :event="eventVal" :menus="menus">
    <template #icon="{ menu }"><span v-html="menu.icon"></span></template>
    <template #label="{ menu }">插槽：{{ menu.label }}</template>
  </vue3-menus> -->
</template>

<style lang="scss" scoped>
.component-component {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 200px;
  background-color: cssVarEl(color-primary-light-9);
  border: 3px dashed cssVarEl(color-primary);
  border-radius: 8px;
}
</style>
