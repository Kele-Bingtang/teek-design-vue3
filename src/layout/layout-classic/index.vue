<script setup lang="ts">
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ElContainer, ElAside, ElHeader } from "element-plus";
import { serviceConfig, HOME_URL } from "@/common/config";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";
import { useHeaderAreaMouse, useMenuAreaMouse } from "../use-area-mouse";
import HeaderLeft from "../components/header/header-left.vue";
import PageContent from "../components/page-content/index.vue";
import Header from "../components/header/index.vue";
import Menu from "../components/menu/index.vue";
import TabNav from "../components/tab-nav/index.vue";

import "./index.scss";

defineOptions({ name: "LayoutClassic" });

const ns = useNamespace("classic-layout");
const router = useRouter();
const settingStore = useSettingStore();
const { asideStyle, rightContentStyle } = useMenuAreaMouse();
const { heightStyle } = useHeaderAreaMouse();

const { menu, logo, header } = storeToRefs(settingStore);
</script>

<template>
  <!-- 布局：SideMenu 占屏幕左侧，Header 和 Main Content 占右侧 -->
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
      <Header>
        <template #left>
          <div :class="ns.e('header-left')" class="flx-align-center">
            <div :class="[ns.join('layout-logo'), ns.no('collapse')]" class="flx-center" @click="router.push(HOME_URL)">
              <img v-if="logo.enable" :src="serviceConfig.logo.source" alt="logo" />
              <span>{{ serviceConfig.layout.name }}</span>
            </div>
            <HeaderLeft />
          </div>
        </template>
      </Header>
    </el-header>

    <el-container :class="ns.e('content')">
      <el-aside v-if="menu.enabled" :class="ns.join('layout-aside')" :style="asideStyle">
        <Menu
          :class="[ns.join('layout-menu'), ns.b('menu'), ns.is(`style-${menu.style}`)]"
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
