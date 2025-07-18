<script setup lang="ts">
import { watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ElContainer, ElAside, ElHeader, ElScrollbar } from "element-plus";
import SystemConfig, { HOME_URL } from "@/common/config";
import { Tooltip } from "@/components";
import { useMenu } from "@/composables";
import { useSettingStore } from "@/pinia";
import { useNamespace } from "@/composables";
import PageContent from "../components/page-content/index.vue";
import Header from "../components/header/index.vue";
import Menu from "../components/menu/index.vue";

import "./index.scss";

defineOptions({ name: "LayoutVertical" });

const ns = useNamespace("columns-layout");
const route = useRoute();
const router = useRouter();
const settingStore = useSettingStore();
const { menuList } = useMenu();

// 子菜单
const menuItem = ref<RouterConfig[]>([]);
// 菜单是否激活
const active = ref<string>("");

const { isCollapse } = storeToRefs(settingStore);

watch(
  () => route.path,
  () => {
    // 当前菜单没有数据直接 return
    if (!menuList.value.length) return;
    // 查找 route.path 所属的一级菜单
    const findTopMenu = (menus: RouterConfig[], path: string): RouterConfig | undefined => {
      for (const menu of menus) {
        if (menu.meta._fullPath === path) return menu;
        if (menu.children?.length) {
          // 如果 children 里有 path，则返回当前 menu
          const found = menu.children.find(child => child.meta._fullPath === path);
          if (found) return menu;
          // 递归查找更深层级
          const deepFound = findTopMenu(menu.children, path);
          if (deepFound) return menu;
        }
      }
      return undefined;
    };

    const item = [findTopMenu(menuList.value, route.path)].filter(Boolean);

    active.value = item[0]?.path || route.path;

    if (item[0]?.children?.length) return (menuItem.value = item[0].children);
    menuItem.value = [];
  },
  { immediate: true }
);

/**
 * 切换菜单事件
 */
const changeMenuItem = (item: RouterConfig) => {
  active.value = item.path;
  if (item.children?.length) return (menuItem.value = item.children);
  menuItem.value = [];
  router.push(item.path);
};
</script>

<template>
  <el-container :class="[ns.join('layout'), ns.b(), ns.is('collapse', isCollapse), ns.is('expand', !isCollapse)]">
    <div :class="ns.e('aside')" class="flx-column">
      <div :class="[ns.e('logo'), ns.join('layout-logo')]" class="flx-center" @click="router.push(HOME_URL)">
        <img src="@/common/assets/images/logo.png" alt="logo" v-if="settingStore.showLayoutLogo" />
      </div>

      <el-scrollbar>
        <ul :class="ns.e('aside__list')">
          <li
            :class="[
              ns.e('aside__list-item'),
              ns.is('active', [active, `/${active.split('/')[1]}`].includes(item.path)),
            ]"
            class="flx-center"
            v-for="item in menuList"
            :key="item.path"
            @click="changeMenuItem(item)"
          >
            <Icon v-if="item.meta?.icon" :icon="item.meta.icon" />
            <div class="flx-center" style="width: 100%">
              <Tooltip>
                <span class="title">{{ item.meta?.title }}</span>
              </Tooltip>
            </div>
          </li>
        </ul>
      </el-scrollbar>
    </div>

    <el-aside :class="[ns.join('layout-aside'), { 'not-aside': !menuItem.length }]" class="flx-column">
      <div :class="[ns.e('logo'), ns.join('layout-logo')]" class="flx-center">
        <span v-show="menuItem.length">{{ isCollapse ? "K" : SystemConfig.systemInfo.name }}</span>
      </div>

      <el-scrollbar v-if="menuItem?.length">
        <Menu
          :menu-list="menuItem"
          :class="[ns.join('layout-menu'), ns.b('menu')]"
          :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')}`"
        />
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header :class="ns.join('layout-header')" class="flx-align-center-between">
        <Header />
      </el-header>
      <PageContent />
    </el-container>
  </el-container>
</template>
