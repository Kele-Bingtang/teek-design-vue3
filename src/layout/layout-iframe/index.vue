<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { ElContainer, ElAside } from "element-plus";
import { useSettingStore } from "@/pinia";
import { useNamespace } from "@/composables";
import SystemConfig, { HOME_URL } from "@/common/config";
import PageContent from "../components/page-content/index.vue";
import Menu from "../components/menu/index.vue";

import "./index.scss";

defineOptions({ name: "LayoutIFrame" });

const ns = useNamespace("iframe-layout");
const router = useRouter();
const settingStore = useSettingStore();

const { isCollapse } = storeToRefs(settingStore);
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

    <el-container>
      <PageContent />
    </el-container>
  </el-container>
</template>
