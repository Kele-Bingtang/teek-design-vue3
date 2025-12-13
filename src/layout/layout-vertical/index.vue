<script setup lang="ts">
import { watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ElContainer, ElAside, ElHeader } from "element-plus";
import { serviceConfig, HOME_URL } from "@/common/config";
import { useCommon, useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";
import { useMenuAreaMouse, useHeaderAreaMouse } from "../use-area-mouse";
import PageContent from "../components/page-content/index.vue";
import Header from "../components/header/index.vue";
import Menu from "../components/menu/index.vue";
import TabNav from "../components/tab-nav/index.vue";

import "./index.scss";

defineOptions({ name: "LayoutVertical" });

const ns = useNamespace("vertical-layout");
const router = useRouter();
const settingStore = useSettingStore();

const { menu, logo, header } = storeToRefs(settingStore);
const { isMobile } = useCommon();
const { asideStyle, rightContentStyle } = useMenuAreaMouse();
const { topStyle, staticClass } = useHeaderAreaMouse();

watch(isMobile, newVal => {
  if (newVal) settingStore.collapseSideMenu();
  else settingStore.expandSideMenu();
});

/**
 * 点击外部区域关闭菜单
 */
const handleClickOutSide = () => {
  settingStore.collapseSideMenu();
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
    <el-aside v-if="menu.enabled" :class="ns.join('layout-aside')" class="flx-column" :style="asideStyle">
      <div :class="ns.join('layout-logo')" class="flx-center" @click="router.push(HOME_URL)">
        <img v-if="logo.enable" :src="serviceConfig.logo.source" alt="logo" />
        <span v-show="!menu.collapsed">{{ serviceConfig.layout.name }}</span>
      </div>

      <Menu
        :class="[ns.join('layout-menu'), ns.is(`style-${menu.style}`)]"
        :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')} ${ns.is(`theme-${menu.theme}`)} ${ns.is(`style-${menu.style}`)}`"
      />
    </el-aside>

    <div v-if="isMobile && !menu.collapsed" :class="ns.e('drawer-model')" @click="handleClickOutSide" />

    <el-container direction="vertical" :class="staticClass" :style="rightContentStyle">
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
