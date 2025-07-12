<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ElImage, ElMessage, ElMessageBox } from "element-plus";
import { User, Bell, Setting, Back, View, Lock } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import defaultAvatar from "@/common/assets/images/default.png";
import { useUserStore } from "@/pinia";
import { mittBus } from "@/common/utils";
import { LOGIN_URL, OpenThemePanelKey, OpenLockPanelKey } from "@/common/config";

import "./index.scss";

defineOptions({ name: "UserAvatar" });

withDefaults(defineProps<{ name?: boolean }>(), {
  name: true,
});

const ns = useNamespace("user-avatar");
const userStore = useUserStore();
const { t } = useI18n();
const router = useRouter();

const { userInfo } = storeToRefs(userStore);

// 下拉菜单列表
const menuList = computed(() => [
  { label: t("_headerBar.profile"), icon: User, click: () => toPage("/profile") },
  { label: t("_headerBar.messageCenter"), icon: Bell, click: () => toPage("/message") },
  { label: t("_headerBar.setting"), icon: Setting, click: openThemePanel },
  { label: t("_headerBar.lock"), icon: Lock, click: OpenLockPanel },
  {
    label: "Github",
    click: () => window.open("https://github.com/Kele-Bingtang/teek-design-vue3"),
  },
]);

/**
 * 跳转页面
 */
const toPage = (path: string) => {
  router.push(path);
};

/**
 * 打开主题面板
 */
const openThemePanel = () => {
  mittBus.emit(OpenThemePanelKey);
};

/**
 * 锁屏
 */
const OpenLockPanel = () => {
  mittBus.emit(OpenLockPanelKey);
};

/**
 * 退出登录
 */
const logout = async () => {
  ElMessageBox.confirm(t("_headerBar.logout.confirm"), t("_headerBar.logout.confirmTitle"), {
    type: "warning",
  }).then(async () => {
    // 调用退出登录接口
    await userStore.logout();
    // 重定向到登陆页
    router.push(`${LOGIN_URL}?redirect=${router.currentRoute.value.path}`);

    ElMessage.success(t("_headerBar.logout.success"));
  });
};
</script>

<template>
  <div :class="ns.b()" class="customize">
    <el-popover
      placement="bottom-end"
      trigger="hover"
      :width="240"
      :hide-after="0"
      :offset="10"
      :popper-class="ns.b()"
      v-bind="$attrs"
    >
      <template #reference>
        <div class="flx-align-center gap-15" :class="ns.e('avatar-wrapper')">
          <el-image :src="userInfo.avatar" :class="ns.e('avatar')">
            <template #error>
              <el-image :src="defaultAvatar" />
            </template>
          </el-image>
          <span v-if="name">{{ userInfo.username }}</span>
        </div>
      </template>

      <div :class="ns.e('wrapper')">
        <div :class="ns.e('head')" class="flx-align-center">
          <el-image :src="userInfo.avatar" :class="ns.e('avatar')">
            <template #error>
              <el-image :src="defaultAvatar" />
            </template>
          </el-image>

          <div :class="ns.e('info')">
            <span class="name sle">{{ userInfo.username }}</span>
            <span class="email sle">{{ userInfo.email }}</span>
          </div>
        </div>

        <el-divider />

        <ul :class="ns.e('menu')" class="flx-column">
          <li class="flx-align-center" v-for="item in menuList" :key="item.label" @click="item.click">
            <Icon :icon="item.icon || View" class="icon" />
            <span class="label">{{ item.label }}</span>
          </li>

          <el-divider />
          <el-button plain :icon="Back" @click="logout">{{ t("_headerBar.logout.label") }}</el-button>
        </ul>
      </div>
    </el-popover>
  </div>
</template>
