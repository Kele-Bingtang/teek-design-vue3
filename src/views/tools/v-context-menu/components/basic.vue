<script setup lang="ts" name="Basic">
import { directive, Contextmenu, ContextmenuItem, ContextmenuDivider, ContextmenuSubmenu } from "v-contextmenu";

const contextmenu = useTemplateRef("contextmenu");

// 局部指令：vXxxx ==> v-xxx
const vContextmenu = directive;
</script>

<template>
  <div>
    <h1>基本使用</h1>
    <div v-contextmenu:contextmenu class="basic-component">
      <code>右键点击此区域</code>
    </div>

    <Contextmenu ref="contextmenu">
      <ContextmenuItem>GitHub</ContextmenuItem>
      <ContextmenuItem>GitLab</ContextmenuItem>

      <ContextmenuDivider />

      <ContextmenuSubmenu title="蔬菜菜">
        <ContextmenuItem>土豆</ContextmenuItem>

        <ContextmenuSubmenu title="青菜">
          <ContextmenuItem>小油菜</ContextmenuItem>
          <ContextmenuItem>空心菜</ContextmenuItem>
        </ContextmenuSubmenu>

        <ContextmenuItem>黄瓜</ContextmenuItem>
      </ContextmenuSubmenu>

      <ContextmenuItem disabled>菠萝蜜</ContextmenuItem>

      <ContextmenuDivider />

      <ContextmenuItem>哈密瓜</ContextmenuItem>
    </Contextmenu>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/function" as *;

.basic-component {
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
