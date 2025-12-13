<script setup lang="ts">
import { computed, watch, ref, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ElContainer, ElAside, ElHeader } from "element-plus";
import { serviceConfig, HOME_URL } from "@/common/config";
import { useMenu, useRouteFn, useNamespace } from "@/composables";
import { useSettingStore, useRouteStore } from "@/pinia";
import { useMenuAreaMouse, useHeaderAreaMouse } from "../use-area-mouse";
import PageContent from "../components/page-content/index.vue";
import CollapseTrigger from "../components/header/components/collapse-trigger/index.vue";
import HeaderRight from "../components/header/header-right.vue";
import Refresh from "../components/header/components/refresh/index.vue";
import Menu from "../components/menu/index.vue";
import TabNav from "../components/tab-nav/index.vue";

import "./index.scss";

defineOptions({ name: "LayoutMixins" });

const ns = useNamespace("mixins-layout");
const route = useRoute();
const router = useRouter();
const settingStore = useSettingStore();
const routeStore = useRouteStore();
const { asideStyle, rightContentStyle } = useMenuAreaMouse();
const { heightStyle } = useHeaderAreaMouse();

const { findParentRoutesByPath } = useRouteFn();
const { menuList } = useMenu();

// 子菜单
const activeMenu = ref("");
const childrenMenu = ref<RouterConfig[]>([]);

const { menu, logo, header, widget } = storeToRefs(settingStore);

/**
 * 头部菜单
 */
const headerMenu = computed(() => {
  const parentMenu: RouterConfig[] = [];

  menuList.value.forEach(menuItem => {
    const item = { ...menuItem };
    if (item.children) item.children = [];

    parentMenu.push({ ...item });
  });

  return parentMenu;
});

watch(
  () => route.path,
  async () => {
    await nextTick();
    // 当前菜单没有数据直接 return
    if (!menuList.value.length) return;

    const item = menuList.value.filter(
      item =>
        [route.path, `/${route.path.split("/")[1]}`].includes(item.path) ||
        route.path === item.redirect ||
        findParentRoutesByPath(route.path, routeStore.loadedRouteList, "path")[0] === item.path ||
        findParentRoutesByPath(`/${route.path.split("/")[1]}`, routeStore.loadedRouteList, "path")[0] === item.path
    );

    activeMenu.value = item[0]?.path || "";

    if (item[0]?.children?.length) childrenMenu.value = item[0].children;
    else {
      childrenMenu.value = [];
      // 关闭菜单栏折叠功能
      settingStore.$patch({ menu: { collapsed: false } });
    }
  },
  { immediate: true }
);
</script>

<template>
  <el-container
    :class="[
      ns.b(),
      ns.join('layout'),
      ns.join(`menu-theme-${menu.theme}`),
      ns.is('menu-collapse', menu.collapsed),
      ns.is('menu-expand', !menu.collapsed),
    ]"
  >
    <el-header
      v-if="header.enabled"
      :class="[ns.join('layout-header'), ns.join('auto-top')]"
      class="flx-align-center-between"
      :style="heightStyle"
    >
      <div :class="[ns.join('layout-logo'), ns.no('collapse')]" class="flx-center" @click="router.push(HOME_URL)">
        <img v-if="logo.enable" :src="serviceConfig.logo.source" alt="logo" />
        <span>{{ serviceConfig.layout.name }}</span>
      </div>

      <CollapseTrigger :class="ns.has('trigger', !childrenMenu.length)" />
      <Refresh v-if="widget.refresh" />

      <Menu
        :menu-list="headerMenu"
        :active-menu="activeMenu"
        mode="horizontal"
        :is-collapse="false"
        :class="[ns.join('layout-menu'), ns.e('header-menu'), ns.is(`align-${header.menuAlign}`)]"
        :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')}`"
      />

      <HeaderRight />
    </el-header>

    <el-container :class="ns.e('content')">
      <el-aside v-if="childrenMenu.length" :class="ns.join('layout-aside')" :style="asideStyle">
        <Menu
          :menu-list="childrenMenu"
          :class="[ns.join('layout-menu'), ns.e('aside-menu'), ns.is(`style-${menu.style}`)]"
          :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')} ${ns.is(`theme-${menu.theme}`)} ${ns.is(`style-${menu.style}`)}`"
        />
      </el-aside>

      <div class="flx-1">
        <TabNav :class="ns.join('auto-top')" :style="heightStyle" />
        <PageContent :style="rightContentStyle" />
      </div>
    </el-container>
  </el-container>
</template>
