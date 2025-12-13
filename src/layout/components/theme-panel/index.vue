<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { ElButton, ElDrawer, ElMessage, ElMessageBox } from "element-plus";
import { Refresh } from "@element-plus/icons-vue";
import { LOGIN_URL, OpenThemePanelKey } from "@/common/config";
import { mittBus } from "@/common/utils";
import { useCommon, useNamespace, useTheme } from "@/composables";
import { useSettingStore, useUserStore } from "@/pinia";
import { LayoutMode, MenuTheme, GlobalTheme, BaseConfig, BrowserTitle } from "./components";

import "./index.scss";
import router from "@/router";

defineOptions({ name: "ThemePanel" });

const ns = useNamespace("theme-panel");

const { t } = useI18n();
const userStore = useUserStore();
const settingStore = useSettingStore();
const { changeGlobalTheme } = useTheme();

const { isMobile } = useCommon();

const resetSetting = () => {
  settingStore.$reset();
  changeGlobalTheme();
};

/**
 * 退出登录
 */
const clearSettingCache = async () => {
  ElMessageBox.confirm(t("_headerBar.logout.confirm"), t("_headerBar.logout.confirmTitle"), {
    type: "warning",
  }).then(async () => {
    resetSetting();
    // 调用退出登录接口
    await userStore.logout();
    ElMessage.success(t("_headerBar.logout.success"));

    await nextTick();
    // 重定向到登陆页
    router.push(`${LOGIN_URL}?redirect=${router.currentRoute.value.path}`);
  });
};

/**
 * 打开主题设置
 */
const drawerVisible = ref(false);
mittBus.on(OpenThemePanelKey, () => (drawerVisible.value = true));
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    :size="360"
    :lock-scroll="false"
    :with-header="false"
    close-on-click-modal
    :class="ns.b()"
    :modal-class="ns.b('modal')"
  >
    <template v-if="!isMobile">
      <!-- 布局切换 -->
      <div>
        <h3>{{ $t("_setting.layout.layoutMode") }}</h3>

        <LayoutMode />
      </div>
    </template>

    <!-- 菜单主题切换 -->
    <h3>{{ $t("_setting.menu.theme") }}</h3>

    <MenuTheme />

    <!-- 全局主题 -->
    <h3>{{ $t("_setting.theme.label") }}</h3>

    <GlobalTheme />

    <BaseConfig />

    <!-- 标题设置 -->
    <h3>{{ $t("_setting.layout.titleMode") }}</h3>

    <BrowserTitle />

    <template #footer>
      <el-button plain type="primary" :icon="Refresh" @click="resetSetting">
        {{ $t("_setting.resetSetting") }}
      </el-button>

      <el-button plain @click="clearSettingCache">
        {{ $t("_setting.clearSettingCache") }}
      </el-button>
    </template>
  </el-drawer>
</template>
