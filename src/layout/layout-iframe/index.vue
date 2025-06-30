<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { ElContainer, ElAside } from "element-plus";
import { useSettingStore } from "@/pinia";
import { useNamespace } from "@/composables";
import SystemConfig, { HOME_URL } from "@/common/config";
import PageContent from "../components/page-content/index.vue";
import Menu from "../components/menu/index.vue";
import UserAvatar from "../components/header/components/user-avatar/index.vue";
import CollapseTrigger from "../components/header/components/collapse-trigger/index.vue";

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

      <!-- 菜单底部 -->
      <div :class="[ns.e('menu-footer'), ns.is('collapse', isCollapse), 'flx-column', 'gap-20']">
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
