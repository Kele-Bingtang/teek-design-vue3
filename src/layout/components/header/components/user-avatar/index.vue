<script setup lang="ts">
import { computed, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ElImage, ElMessage, ElMessageBox } from "element-plus";
import { User, Bell, Setting, Back, View, Lock } from "@element-plus/icons-vue";
import { serviceConfig, LOGIN_URL } from "@/common/config";
import { useNamespace, useKeyDown, useMittBus } from "@/composables";
import { useSettingStore, useUserStore } from "@/pinia";

import "./index.scss";

defineOptions({ name: "UserAvatar" });

withDefaults(defineProps<{ name?: boolean }>(), {
  name: true,
});

const { t } = useI18n();
const router = useRouter();
const ns = useNamespace("user-avatar");
const userStore = useUserStore();
const settingStore = useSettingStore();
const { openThemePanel, openLockPanel } = useMittBus();

const { userInfo } = storeToRefs(userStore);
const { widget, shortcutKey } = storeToRefs(settingStore);

const { start } = useKeyDown({
  watcher: computed(() => shortcutKey.value.logout),
  // 快捷键 ALT + Q 退出登录
  callback: event => {
    if (event.altKey && event.key.toLowerCase() === "q") {
      event.preventDefault();
      logout();
    }
  },
});
start();

// 下拉菜单列表
const menuList = computed(() => [
  { label: t("_headerBar.profile"), icon: User, click: () => toPage("/profile") },
  { label: t("_headerBar.messageCenter"), icon: Bell, click: () => toPage("/message") },
  { label: t("_headerBar.setting"), icon: Setting, click: openThemePanel },
  { label: t("_headerBar.lock"), icon: Lock, click: openLockPanel, subLabel: "Alt L", show: widget.value.lockScreen },
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
 * 退出登录
 */
const logout = async () => {
  ElMessageBox.confirm(t("_headerBar.logout.confirm"), t("_headerBar.logout.confirmTitle"), {
    type: "warning",
  }).then(async () => {
    // 调用退出登录接口
    await userStore.logout();
    ElMessage.success(t("_headerBar.logout.success"));

    await nextTick();
    // 重定向到登陆页
    router.push(`${LOGIN_URL}?redirect=${router.currentRoute.value.path}`);
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
              <el-image :src="serviceConfig.layout.avatar" />
            </template>
          </el-image>
          <span v-if="name">{{ userInfo.username }}</span>
        </div>
      </template>

      <div :class="ns.e('wrapper')">
        <div :class="ns.e('head')" class="flx-align-center">
          <el-image :src="userInfo.avatar" :class="ns.e('avatar')">
            <template #error>
              <el-image :src="serviceConfig.layout.avatar" />
            </template>
          </el-image>

          <div :class="ns.e('info')">
            <span class="name sle">{{ userInfo.username }}</span>
            <span class="email sle">{{ userInfo.email }}</span>
          </div>
        </div>

        <el-divider />

        <ul :class="ns.e('menu')" class="flx-column">
          <template v-for="item in menuList" :key="item.label">
            <li v-if="item.show !== false" @click="item.click" class="flx-justify-between">
              <div class="flx-align-center">
                <Icon :icon="item.icon || View" class="icon" />
                <span class="label">{{ item.label }}</span>
              </div>
              <span v-if="item.subLabel && shortcutKey.lockScreen">{{ item.subLabel }}</span>
            </li>
          </template>

          <el-divider />
          <el-button plain :icon="Back" @click="logout">
            <span>{{ t("_headerBar.logout.label") }}</span>
            <span v-if="shortcutKey.logout" style="margin-left: 6px">Alt Q</span>
          </el-button>
        </ul>
      </div>
    </el-popover>
  </div>
</template>
