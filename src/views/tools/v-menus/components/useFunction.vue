<script setup lang="ts" name="UseFunction">
import type { menusItemType } from "vue3-menus";
import { menusEvent } from "vue3-menus";

const props = defineProps<{ menus: menusItemType[] }>();

const rightClick = (event: MouseEvent) => {
  menusEvent(event, props.menus, "");
  event.preventDefault();
};
</script>

<template>
  <div class="function-component" @click.stop @contextmenu="rightClick">事件方式打开菜单</div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/function" as *;

.function-component {
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
