<script setup lang="ts" name="MenuGroup">
import { directive, Contextmenu, ContextmenuItem, ContextmenuDivider, ContextmenuGroup } from "v-contextmenu";

const contextmenu = useTemplateRef("contextmenu");
const vContextmenu = directive;
</script>

<template>
  <div>
    <h1>按钮组</h1>
    <div v-contextmenu:contextmenu class="menu-group-component">
      <code>右键点击此区域</code>
    </div>

    <Contextmenu ref="contextmenu">
      <ContextmenuItem>菜单</ContextmenuItem>

      <ContextmenuGroup>
        <ContextmenuItem>Github</ContextmenuItem>
        <ContextmenuItem>Codepen</ContextmenuItem>
        <ContextmenuItem disabled>Alipay</ContextmenuItem>
        <ContextmenuItem>Wechat</ContextmenuItem>
      </ContextmenuGroup>

      <ContextmenuDivider />

      <ContextmenuGroup title="按钮组">
        <ContextmenuItem>菜单1</ContextmenuItem>
        <ContextmenuItem>菜单2</ContextmenuItem>
        <ContextmenuItem disabled>菜单3</ContextmenuItem>
      </ContextmenuGroup>
    </Contextmenu>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/function" as *;

.menu-group-component {
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
