<script setup lang="ts">
import { ElContainer, ElHeader } from "element-plus";
import { useRouter } from "vue-router";
import { useSettingStore } from "@/pinia";
import { useNamespace } from "@/composables";
import SystemConfig, { HOME_URL } from "@/common/config";
import PageContent from "../components/page-content/index.vue";
import Menu from "../components/menu/index.vue";
import HeaderRight from "../components/header/header-right.vue";

import "./index.scss";

defineOptions({ name: "LayoutHorizontal" });

const ns = useNamespace("horizontal-layout");
const router = useRouter();
const settingStore = useSettingStore();
</script>

<template>
  <el-container :class="[ns.join('layout'), ns.b()]">
    <el-header :class="[ns.join('layout-header'), 'flx-align-center-between']">
      <div :class="[ns.join('layout-logo'), 'flx-center']" @click="router.push(HOME_URL)">
        <img src="@/common/assets/images/logo.png" alt="logo" v-if="settingStore.showLayoutLogo" />
        <span>{{ SystemConfig.systemInfo.name }}</span>
      </div>

      <Menu
        mode="horizontal"
        :is-collapse="false"
        :class="[ns.join('layout-menu'), ns.b('menu')]"
        :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')}`"
      />
      <HeaderRight />
    </el-header>

    <PageContent />
  </el-container>
</template>
