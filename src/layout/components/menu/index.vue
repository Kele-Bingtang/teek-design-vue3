<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ElScrollbar, ElMenu } from "element-plus";
import { isFunction } from "@/common/utils";
import { useMenu } from "@/composables";
import { useSettingStore } from "@/pinia";
import MenuItem from "./menu-item.vue";

defineOptions({ name: "AsideMenu" });

interface MenuProps {
  /** 菜单列表 */
  menuList?: RouterConfig[];
  /** 默认激活的菜单 */
  activeMenu?: string;
  /** 菜单是否默认折叠 */
  isCollapse?: boolean;
}

const props = withDefaults(defineProps<MenuProps>(), {
  menuList: () => [],
  activeMenu: "",
  isCollapse: undefined,
});

const route = useRoute();
const settingStore = useSettingStore();
const { menuList: menuListRef } = useMenu();

const { menu } = storeToRefs(settingStore);

// 当前激活菜单
const activeMenu = computed(() => {
  if (props.activeMenu) return props.activeMenu;

  const { activeMenu, _fullPath } = route.meta;

  return isFunction(activeMenu) ? activeMenu(route) : route.meta.activeMenu || _fullPath || route.path;
});

const isCollapse = computed(() => (props.isCollapse === undefined ? menu.value.collapsed : props.isCollapse));

// 菜单列表
const menuList = computed(() => {
  if (props.menuList?.length) return props.menuList;
  return menuListRef.value;
});
</script>

<template>
  <el-scrollbar>
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="menu.accordion"
      :collapse-transition="false"
      v-bind="{ ...$attrs, class: undefined }"
    >
      <MenuItem v-for="menu in menuList" :key="menu.path" :menu-item="menu" />
    </el-menu>
  </el-scrollbar>
</template>
