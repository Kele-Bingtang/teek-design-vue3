<script setup lang="ts">
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ElContainer, ElAside, ElHeader } from "element-plus";
import { serviceConfig, HOME_URL } from "@/common/config";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";
import HeaderLeft from "../components/header/header-left.vue";
import PageContent from "../components/page-content/index.vue";
import Header from "../components/header/index.vue";
import Menu from "../components/menu/index.vue";

import "./index.scss";

defineOptions({ name: "LayoutClassic" });

const ns = useNamespace("classic-layout");
const router = useRouter();
const settingStore = useSettingStore();

const { menu, layout, logo, header } = storeToRefs(settingStore);
</script>

<template>
  <!-- 布局：SideMenu 占屏幕左侧，Header 和 Main Content 占右侧 -->
  <el-container
    :class="[ns.join('layout'), ns.b(), ns.is('collapse', menu.collapsed), ns.is('expand', !menu.collapsed)]"
  >
    <el-header v-if="header.enabled" :class="ns.join('layout-header')" class="flx-align-center-between">
      <Header>
        <template #left>
          <div :class="ns.e('header-left')" class="flx-align-center">
            <div :class="ns.join('layout-logo')" class="flx-center" @click="router.push(HOME_URL)">
              <img :src="serviceConfig.logo.source" alt="logo" v-if="logo.enable" />
              <span v-show="!menu.collapsed">{{ serviceConfig.layout.name }}</span>
            </div>
            <HeaderLeft />
          </div>
        </template>
      </Header>
    </el-header>

    <el-container :class="ns.e('content')">
      <el-aside v-if="menu.enabled" :class="[ns.join('layout-aside'), ns.is(layout.menuTheme)]">
        <Menu
          :class="[ns.join('layout-menu'), ns.b('menu')]"
          :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')}`"
        />
      </el-aside>

      <PageContent />
    </el-container>
  </el-container>
</template>
