<script setup lang="ts">
import { watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ElContainer, ElAside, ElHeader } from "element-plus";
import { serviceConfig, HOME_URL } from "@/common/config";
import { useCommon, useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";
import PageContent from "../components/page-content/index.vue";
import Header from "../components/header/index.vue";
import Menu from "../components/menu/index.vue";

import "./index.scss";

defineOptions({ name: "LayoutVertical" });

const ns = useNamespace("vertical-layout");
const router = useRouter();
const settingStore = useSettingStore();

const { menu, layout, logo, header } = storeToRefs(settingStore);
const { isMobile } = useCommon();

watch(isMobile, newVal => {
  if (newVal) settingStore.closeSideMenu();
  else settingStore.openSideMenu();
});

/**
 * 点击外部区域关闭菜单
 */
const handleClickOutSide = () => {
  settingStore.closeSideMenu();
};
</script>

<template>
  <el-container
    :class="[ns.join('layout'), ns.b(), ns.is('collapse', menu.isCollapse), ns.is('expand', !menu.isCollapse)]"
  >
    <el-aside :class="[ns.join('layout-aside'), ns.is(layout.menuTheme)]" class="flx-column">
      <div :class="ns.join('layout-logo')" class="flx-center" @click="router.push(HOME_URL)">
        <img v-if="logo.enable" :src="serviceConfig.logo.source" alt="logo" />
        <span v-show="!menu.isCollapse">{{ serviceConfig.layout.name }}</span>
      </div>

      <Menu
        :class="[ns.join('layout-menu'), ns.b('menu')]"
        :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')}`"
      />
    </el-aside>

    <div v-if="isMobile && !menu.isCollapse" :class="ns.e('drawer-model')" @click="handleClickOutSide" />

    <el-container>
      <el-header v-if="header.enabled" :class="ns.join('layout-header')" class="flx-align-center-between">
        <Header />
      </el-header>
      <PageContent />
    </el-container>
  </el-container>
</template>
