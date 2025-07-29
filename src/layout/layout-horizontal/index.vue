<script setup lang="ts">
import { useRouter } from "vue-router";
import { ElContainer, ElHeader } from "element-plus";
import { serviceConfig, HOME_URL } from "@/common/config";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";
import PageContent from "../components/page-content/index.vue";
import Menu from "../components/menu/index.vue";
import HeaderRight from "../components/header/header-right.vue";

import "./index.scss";

defineOptions({ name: "LayoutHorizontal" });

const ns = useNamespace("horizontal-layout");
const router = useRouter();
const settingStore = useSettingStore();

const { logo, header } = storeToRefs(settingStore);
</script>

<template>
  <el-container :class="[ns.join('layout'), ns.b()]">
    <el-header v-if="header.enabled" :class="ns.join('layout-header')" class="flx-align-center-between">
      <div :class="ns.join('layout-logo')" class="flx-center" @click="router.push(HOME_URL)">
        <img v-if="logo.enable" :src="serviceConfig.logo.source" alt="logo" />
        <span>{{ serviceConfig.layout.name }}</span>
      </div>

      <Menu
        mode="horizontal"
        :is-collapse="false"
        :class="[ns.join('layout-menu'), ns.b('menu'), ns.is(header.menuAlign)]"
        :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')}`"
      />
      <HeaderRight />
    </el-header>

    <PageContent />
  </el-container>
</template>
