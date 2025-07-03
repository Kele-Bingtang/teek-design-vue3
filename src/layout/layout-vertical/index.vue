<script setup lang="ts">
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { ElContainer, ElAside, ElHeader } from "element-plus";
import { useSettingStore } from "@/pinia";
import { useCommon, useNamespace } from "@/composables";
import SystemConfig, { HOME_URL } from "@/common/config";
import PageContent from "../components/page-content/index.vue";
import Header from "../components/header/index.vue";
import Menu from "../components/menu/index.vue";

import "./index.scss";

defineOptions({ name: "LayoutVertical" });

const ns = useNamespace("vertical-layout");
const router = useRouter();
const settingStore = useSettingStore();

const { isCollapse } = storeToRefs(settingStore);
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
  <el-container :class="[ns.join('layout'), ns.b(), ns.is('collapse', isCollapse), ns.is('expand', !isCollapse)]">
    <el-aside :class="[ns.join('layout-aside'), ns.is(settingStore.menuTheme), 'flx-column']">
      <div :class="[ns.join('layout-logo'), 'flx-center']" @click="router.push(HOME_URL)">
        <img src="@/common/assets/images/logo.png" alt="logo" v-if="settingStore.showLayoutLogo" />
        <span v-show="!isCollapse">{{ SystemConfig.systemInfo.name }}</span>
      </div>

      <Menu
        :class="[ns.join('layout-menu'), ns.b('menu')]"
        :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')}`"
      />
    </el-aside>

    <div v-if="isMobile && !isCollapse" :class="ns.e('drawer-model')" @click="handleClickOutSide" />

    <el-container>
      <el-header :class="[ns.join('layout-header'), 'flx-align-center-between']">
        <Header />
      </el-header>
      <PageContent />
    </el-container>
  </el-container>
</template>
