<script setup lang="ts" name="MenuDynamic">
import {
  directive,
  Contextmenu,
  ContextmenuItem,
  ContextmenuDivider,
  ContextmenuSubmenu,
  ContextmenuGroup,
} from "v-contextmenu";

const contextmenu = useTemplateRef("contextmenu");
const extra = ref<string[]>([]);
const vContextmenu = directive;
</script>

<template>
  <div>
    <h1>动态菜单</h1>
    <div v-contextmenu:contextmenu class="menu-dynamic-component">
      <code>右键点击此区域</code>
    </div>

    <Contextmenu ref="contextmenu">
      <ContextmenuGroup title="操作">
        <ContextmenuItem :hide-on-click="false" @click="extra.push('item')">添加菜单</ContextmenuItem>
        <ContextmenuItem :hide-on-click="false" @click="extra.push('group')">添加菜单组</ContextmenuItem>
        <ContextmenuItem :hide-on-click="false" @click="extra.push('submenu')">添加子菜单</ContextmenuItem>
        <ContextmenuItem :hide-on-click="false" @click="extra.pop()">删除</ContextmenuItem>
      </ContextmenuGroup>

      <template v-for="(item, index) of extra" :key="index">
        <ContextmenuDivider />

        <ContextmenuGroup v-if="item === 'group'" :title="`菜单组 ${index + 1}`">
          <ContextmenuItem>菜单1</ContextmenuItem>
          <ContextmenuItem>菜单2</ContextmenuItem>
          <ContextmenuItem>菜单3</ContextmenuItem>
        </ContextmenuGroup>

        <ContextmenuSubmenu v-else-if="item === 'submenu'" :title="`子菜单 ${index + 1}`">
          <ContextmenuItem>菜单1</ContextmenuItem>
          <ContextmenuItem>菜单2</ContextmenuItem>
          <ContextmenuItem>菜单3</ContextmenuItem>
        </ContextmenuSubmenu>

        <ContextmenuItem v-else>菜单 {{ index + 1 }}</ContextmenuItem>
      </template>
    </Contextmenu>
  </div>
</template>

<style lang="scss" scoped>
.menu-dynamic-component {
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
