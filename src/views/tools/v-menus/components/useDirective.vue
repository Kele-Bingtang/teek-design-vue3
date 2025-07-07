<script setup lang="ts" name="UseDirective">
import { directive, type menusItemType } from "vue3-menus";

const vMenus = directive;

defineProps<{ menus: menusItemType[] }>();
</script>

<template>
  <div class="directive-component" v-menus:left="menus">指令方式打开菜单（左击）</div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/function" as *;

.directive-component {
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
