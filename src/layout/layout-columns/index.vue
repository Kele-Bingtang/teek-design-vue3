<script setup lang="ts">
import { watch, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { ElContainer, ElAside, ElHeader, ElScrollbar } from "element-plus";
import { useSettingStore } from "@/pinia";
import { useMenu } from "@/composables";
import { Tooltip } from "@/components";
import { useNamespace } from "@/composables";
import SystemConfig, { HOME_URL } from "@/common/config";
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
  route,
  () => {
    // 当前菜单没有数据直接 return
    if (!menuList.value.length) return;
    active.value = route.path;
    const item = menuList.value.filter(item => [route.path, `/${route.path.split("/")[1]}`].includes(item.path));

    if (item[0] && item[0].children?.length) return (menuItem.value = item[0].children);
    menuItem.value = [];
  },
  {
    deep: true,
    immediate: true,
  }
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
    <div :class="[ns.e('aside'), 'flx-column']">
      <div :class="[ns.e('logo'), ns.join('layout-logo'), 'flx-center']" @click="router.push(HOME_URL)">
        <img src="@/common/assets/images/logo.png" alt="logo" v-if="settingStore.showLayoutLogo" />
      </div>

      <el-scrollbar>
        <ul :class="ns.e('aside__list')">
          <li
            :class="[
              ns.e('aside__list-item'),
              ns.is('active', [active, `/${active.split('/')[1]}`].includes(item.path)),
              'flx-center',
            ]"
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

    <el-aside :class="[ns.join('layout-aside'), 'flx-column', { 'not-aside': !menuItem.length }]">
      <div :class="[ns.e('logo'), ns.join('layout-logo'), 'flx-center']">
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
      <el-header :class="[ns.join('layout-header'), 'flx-align-center-between']">
        <Header />
      </el-header>
      <PageContent />
    </el-container>
  </el-container>
</template>
