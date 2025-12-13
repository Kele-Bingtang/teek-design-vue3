<script setup lang="ts">
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ElContainer, ElAside } from "element-plus";
import { serviceConfig, HOME_URL } from "@/common/config";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";
import PageContent from "../components/page-content/index.vue";
import Menu from "../components/menu/index.vue";
import UserAvatar from "../components/header/components/user-avatar/index.vue";
import CollapseTrigger from "../components/header/components/collapse-trigger/index.vue";
import TabNav from "../components/tab-nav/index.vue";

import "./index.scss";
import { useHeaderAreaMouse, useMenuAreaMouse } from "../use-area-mouse";

defineOptions({ name: "LayoutIFrame" });

const ns = useNamespace("iframe-layout");
const router = useRouter();
const settingStore = useSettingStore();
const { asideStyle, rightContentStyle } = useMenuAreaMouse();
const { heightStyle, staticClass } = useHeaderAreaMouse();

const { menu, logo } = storeToRefs(settingStore);

const isCollapse = computed(() => menu.value.collapsed);
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
        <span v-show="!isCollapse">{{ serviceConfig.layout.name }}</span>
      </div>
      <Menu
        :class="[ns.join('layout-menu'), ns.b('menu'), ns.is(`style-${menu.style}`)]"
        :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')} ${ns.is(`theme-${menu.theme}`)} ${ns.is(`style-${menu.style}`)}`"
      />

      <!-- 菜单底部 -->
      <div :class="ns.e('menu-footer')" class="flx-column gap-10">
        <UserAvatar placement="right" />

        <el-tooltip placement="right" :content="isCollapse ? '菜单展开' : '菜单折叠'" :disabled="!isCollapse">
          <CollapseTrigger>
            <span class="name">{{ isCollapse ? "菜单展开" : "菜单折叠" }}</span>
          </CollapseTrigger>
        </el-tooltip>
      </div>
    </el-aside>

    <el-container direction="vertical" :class="staticClass" :style="rightContentStyle">
      <TabNav :class="ns.join('auto-top')" :style="heightStyle" />
      <PageContent />
    </el-container>
  </el-container>
</template>
