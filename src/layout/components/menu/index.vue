<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ElScrollbar, ElMenu } from "element-plus";
import { useMenu } from "@/composables";
import { useSettingStore } from "@/pinia";
import MenuItem from "./menu-item.vue";

defineOptions({ name: "AsideMenu" });

interface MenuProps {
  menuList?: RouterConfig[];
  activeMenu?: string;
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

// 当前激活菜单
const activeMenu = computed(() =>
  props.activeMenu ? props.activeMenu : route.meta.activeMenu || route.meta._fullPath || route.path
);
const isCollapse = computed(() => (props.isCollapse === undefined ? settingStore.isCollapse : props.isCollapse));

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
      :unique-opened="settingStore.menuAccordion"
      :collapse-transition="false"
      v-bind="{ ...$attrs, class: undefined }"
    >
      <MenuItem v-for="menu in menuList" :key="menu.path" :menu-item="menu" />
    </el-menu>
  </el-scrollbar>
</template>
