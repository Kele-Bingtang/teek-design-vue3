<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElImage, ElMessage, ElMessageBox } from "element-plus";
import { ArrowDownBold, User, Bell, Setting, Back, View } from "@element-plus/icons-vue";
import { LOGIN_URL, OpenThemePanelKey, OpenLockPanelKey } from "@/common/config";
import { mittBus } from "@/common/utils";
import defaultAvatar from "@/common/assets/images/default.png";
import { useNamespace } from "@/composables";
import { useUserStore } from "@/pinia";

defineOptions({ name: "UserAvatarDropdown" });

const ns = useNamespace("user-avatar-dropdown");

withDefaults(defineProps<{ showAvatar?: boolean }>(), {
  showAvatar: true,
});

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const { userInfo } = storeToRefs(userStore);

const menuList = computed(() => [
  { label: t("_headerBar.profile"), icon: User, click: () => toPage("/profile") },
  { label: t("_headerBar.messageCenter"), icon: Bell, click: () => toPage("/message-center") },
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
  ElMessageBox.confirm("您是否确认退出登录?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    // 调用退出登录接口
    await userStore.logout();
    // 重定向到登陆页
    router.push(`${LOGIN_URL}?redirect=${route.path}`);

    ElMessage.success("退出登录成功！");
  });
};
</script>

<template>
  <el-dropdown :class="ns.b()" class="customize" trigger="hover">
    <div class="flx-align-center">
      <template v-if="showAvatar">
        <el-image :src="userInfo.avatar" :class="ns.e('avatar')" alt="头像">
          <template #error>
            <el-image :src="defaultAvatar" alt="头像" />
          </template>
        </el-image>

        <span :class="ns.em('avatar', 'username')">{{ userInfo.username }}</span>
      </template>

      <Icon size="1em"><ArrowDownBold /></Icon>
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in menuList" :key="item.label" :icon="item.icon || View" @click="item.click">
          {{ item.label }}
        </el-dropdown-item>

        <el-dropdown-item divided :icon="Back" @click="logout">
          {{ t("_headerBar.logOut") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(user-avatar-dropdown) {
  @include e(avatar) {
    width: 35px;
    height: 35px;
    cursor: pointer;
    border-radius: 50%;

    @include m(username) {
      display: inline-block;
      margin: 0 7px 0 9px;
      font-size: 14px;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
