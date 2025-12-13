<script setup lang="ts">
import { watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ElContainer, ElAside, ElHeader, ElScrollbar } from "element-plus";
import { Fold, Expand } from "@element-plus/icons-vue";
import { serviceConfig, HOME_URL } from "@/common/config";
import { simplifyText } from "@/common/utils";
import { Tooltip } from "@/components";
import { useNamespace, useCommon, useMenu } from "@/composables";
import { useSettingStore } from "@/pinia";
import { useMenuAreaMouse, useHeaderAreaMouse } from "../use-area-mouse";
import PageContent from "../components/page-content/index.vue";
import Header from "../components/header/index.vue";
import Menu from "../components/menu/index.vue";
import TabNav from "../components/tab-nav/index.vue";

import "./index.scss";

defineOptions({ name: "LayoutVertical" });

const ns = useNamespace("columns-layout");
const route = useRoute();
const router = useRouter();
const settingStore = useSettingStore();
const { menuList } = useMenu();
const { getTitle } = useCommon();
const { asideStyle, rightContentStyle } = useMenuAreaMouse(72);
const { topStyle, staticClass } = useHeaderAreaMouse();

// 子菜单
const menuItem = ref<RouterConfig[]>([]);
// 菜单是否激活
const active = ref<string>("");
const showTitle = ref(true);

const { menu, logo, header } = storeToRefs(settingStore);

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

  if (item.children?.length) {
    const firstChild = item.children[0];

    menuItem.value = item.children;
    menu.value.autoActivateChild && router.push(firstChild.meta._fullPath);
    return;
  }

  menuItem.value = [];
  router.push(item.meta._fullPath || item.path);
};
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
    <div v-if="menu.enabled" :class="ns.e('aside')" class="flx-column">
      <div :class="[ns.e('logo'), ns.join('layout-logo')]" class="flx-center" @click="router.push(HOME_URL)">
        <img v-if="logo.enable" :src="serviceConfig.logo.source" alt="logo" />
      </div>

      <el-scrollbar>
        <ul :class="ns.e('aside__list')">
          <template v-for="item in menuList" :key="item.path">
            <el-tooltip :disabled="showTitle" effect="dark" placement="right" :content="getTitle(item)">
              <li
                :class="[
                  ns.e('aside__list-item'),
                  ns.is('active', [active, `/${active.split('/')[1]}`].includes(item.path)),
                  ns.no('title', !showTitle),
                ]"
                class="flx-center"
                @click="changeMenuItem(item)"
              >
                <div class="flx-column-center">
                  <Icon v-if="item.meta?.icon" :icon="item.meta.icon" />
                  <Tooltip v-show="showTitle">
                    <span class="title">{{ getTitle(item) }}</span>
                  </Tooltip>
                </div>
              </li>
            </el-tooltip>
          </template>
        </ul>
      </el-scrollbar>
      <div class="flx-center" :class="ns.e('collapse')" @click="showTitle = !showTitle">
        <Icon><component :is="showTitle ? Fold : Expand"></component></Icon>
      </div>
    </div>

    <el-aside
      v-if="menu.enabled"
      :class="[ns.join('layout-aside'), { 'not-aside': !menuItem.length }]"
      class="flx-column"
      :style="{ ...asideStyle, left: '72px' }"
    >
      <div :class="[ns.e('logo'), ns.join('layout-logo')]" class="flx-center">
        <span v-show="menuItem.length">
          {{ menu.collapsed ? simplifyText(serviceConfig.layout.name) : serviceConfig.layout.name }}
        </span>
      </div>

      <el-scrollbar v-if="menuItem?.length">
        <Menu
          :menu-list="menuItem"
          :class="[ns.join('layout-menu'), ns.b('menu'), ns.is(`style-${menu.style}`)]"
          :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')} ${ns.is(`theme-${menu.theme}`)} ${ns.is(`style-${menu.style}`)}`"
        />
      </el-scrollbar>
    </el-aside>

    <el-container direction="vertical" :class="staticClass" :style="menuItem?.length ? rightContentStyle : {}">
      <div :class="ns.join('auto-top')" :style="topStyle">
        <el-header v-if="header.enabled" :class="ns.join('layout-header')" class="flx-align-center-between">
          <Header />
        </el-header>
        <TabNav />
      </div>

      <PageContent />
    </el-container>
  </el-container>
</template>
