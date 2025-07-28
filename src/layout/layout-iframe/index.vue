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

import "./index.scss";

defineOptions({ name: "LayoutIFrame" });

const ns = useNamespace("iframe-layout");
const router = useRouter();
const settingStore = useSettingStore();

const { menu, layout, logo } = storeToRefs(settingStore);

const isCollapse = computed(() => menu.value.collapsed);
</script>

<template>
  <el-container :class="[ns.join('layout'), ns.b(), ns.is('collapse', isCollapse), ns.is('expand', !isCollapse)]">
    <el-aside v-if="menu.enabled" :class="[ns.join('layout-aside'), ns.is(layout.menuTheme)]" class="flx-column">
      <div :class="ns.join('layout-logo')" class="flx-center" @click="router.push(HOME_URL)">
        <img :src="serviceConfig.logo.source" alt="logo" v-if="logo.enable" />
        <span v-show="!isCollapse">{{ serviceConfig.layout.name }}</span>
      </div>
      <Menu
        :class="[ns.join('layout-menu'), ns.b('menu')]"
        :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')}`"
      />

      <!-- 菜单底部 -->
      <div :class="[ns.e('menu-footer'), ns.is('collapse', isCollapse)]" class="flx-column gap-10">
        <UserAvatar placement="right" :offset="isCollapse ? 6 : 30" />

        <el-tooltip placement="right" :content="isCollapse ? '菜单展开' : '菜单折叠'" :disabled="!isCollapse">
          <CollapseTrigger>
            <span class="name">{{ isCollapse ? "菜单展开" : "菜单折叠" }}</span>
          </CollapseTrigger>
        </el-tooltip>
      </div>
    </el-aside>

    <el-container>
      <PageContent />
    </el-container>
  </el-container>
</template>
