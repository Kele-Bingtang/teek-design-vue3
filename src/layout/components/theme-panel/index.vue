<script setup lang="tsx">
import { ref, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { ElButton, ElDivider, ElDrawer, ElMessage } from "element-plus";
import { Notification, Menu, ColdDrink, Setting, Box, Refresh, Loading } from "@element-plus/icons-vue";
import { useSettingStore } from "@/pinia";
import { mittBus } from "@/common/utils";
import { useCommon, useNamespace } from "@/composables";
import { OpenThemePanelKey } from "@/common/config";
import {
  LayoutModeSwitch,
  MenuThemeSwitch,
  GlobalThemeSwitch,
  BaseConfigSwitch,
  BrowserTitleSwitch,
  SystemThemeSwitch,
} from "./components";

import "./index.scss";

defineOptions({ name: "ThemePanel" });

const ns = useNamespace("theme-panel");

const { t } = useI18n();
const settingStore = useSettingStore();

const { isMobile } = useCommon();

/**
 * 重置缓存
 */
const resetSetting = () => {
  let message = t("_setting.resetSetting");
  message = message === "_setting.resetSetting" ? "正在清除设置缓存并刷新，请稍候..." : message;
  ElMessage({
    message: message,
    duration: 1000,
    icon: Loading,
  });

  settingStore.resetSetting();
  setTimeout(() => window.location.reload(), 1000);
};

/**
 * 打开主题设置
 */
const drawerVisible = ref(false);
mittBus.on(OpenThemePanelKey, () => (drawerVisible.value = true));

/**
 * 分割线组件
 */
const Divider = defineComponent({
  setup(_, { slots }) {
    return () => (
      <>
        <ElDivider class={ns.e("divider")} content-position="center">
          {slots.title?.()}
        </ElDivider>
        {slots.default?.()}
      </>
    );
  },
});
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    :size="300"
    :lock-scroll="false"
    :with-header="false"
    close-on-click-modal
    :class="ns.b()"
    :modal-class="ns.b('modal')"
  >
    <template v-if="!isMobile">
      <!-- 布局切换 -->
      <Divider>
        <template #title>
          <Icon class="icon"><Notification /></Icon>
          {{ $t("_setting.layoutMode") }}
        </template>

        <LayoutModeSwitch />
      </Divider>
    </template>

    <!-- 菜单主题切换 -->
    <Divider>
      <template #title>
        <Icon class="icon"><Menu /></Icon>
        {{ $t("_setting.menuTheme") }}
      </template>

      <MenuThemeSwitch />
    </Divider>

    <!-- 全局主题 -->
    <Divider>
      <template #title>
        <Icon class="icon"><ColdDrink /></Icon>
        {{ $t("_setting.globalTheme") }}
      </template>

      <SystemThemeSwitch />
      <GlobalThemeSwitch />
    </Divider>

    <!-- 界面设置 -->
    <Divider>
      <template #title>
        <Icon class="icon"><Setting /></Icon>
        {{ $t("_setting.baseConfig") }}
      </template>

      <BaseConfigSwitch />
    </Divider>

    <!-- 标题设置 -->
    <Divider>
      <template #title>
        <Icon class="icon"><Box /></Icon>
        {{ $t("_setting.titleMode") }}
      </template>

      <BrowserTitleSwitch />
    </Divider>

    <Divider />

    <el-button plain :icon="Refresh" @click="resetSetting">
      {{ $t("_setting.resetSettingTitle") }}
    </el-button>
  </el-drawer>
</template>
