<!-- From https://github.com/Kele-Bingtang/teek-design-vue3/pull/5 -->
<script setup lang="ts">
import type { FormInstance, FormRules, InputInstance } from "element-plus";
import { ref, reactive, computed, watch, onMounted, onUnmounted, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { ElDialog, ElForm, ElFormItem, ElButton, ElInput, ElIcon, ElMessage } from "element-plus";
import { Unlock, Lock } from "@element-plus/icons-vue";
import { mittBus } from "@/common/utils";
import { serviceConfig, LOGIN_URL, OpenLockPanelKey } from "@/common/config";
import { useKeyDown, useNamespace } from "@/composables";
import { useSettingStore, useUserStore } from "@/pinia";
import { useDisableDevTools } from "./use-disabled-dev-tools";

defineOptions({ name: "LockPanel" });

const ns = useNamespace("lock-panel");

/**
 * 组件实例
 */
const formInstance = useTemplateRef<FormInstance>("formInstance");
const unlockFormInstance = useTemplateRef<FormInstance>("unlockFormInstance");
const unlockInputInstance = useTemplateRef<InputInstance>("unlockInputInstance");
const lockInputInstance = useTemplateRef<InputInstance>("lockInputInstance");

const dialogVisible = ref(false);

const formData = reactive({
  password: "",
});
const unlockForm = reactive({
  password: "",
});

const { t } = useI18n();
const userStore = useUserStore();
const settingStore = useSettingStore();
const { showDevToolsWarning, cleanup } = useDisableDevTools();

const { userInfo, lockPassword, isLock } = storeToRefs(userStore);
const { shortcutKey } = storeToRefs(settingStore);

const { start } = useKeyDown({
  watcher: computed(() => shortcutKey.value.lockScreen),
  // 快捷键 ALT + L 锁屏
  callback: event => {
    if (event.altKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      dialogVisible.value = true;
    }
  },
});
start();

// 监听锁屏状态变化
watch(isLock, newValue => {
  if (newValue) {
    setTimeout(() => {
      unlockInputInstance.value?.input?.focus();
    }, 100);
  } else {
    showDevToolsWarning.value = false;
  }
});

// 表单验证规则
const rules = computed<FormRules>(() => ({
  password: [{ required: true, message: t("_lockScreen.inputPlaceholder"), trigger: "blur" }],
}));

/**
 * 处理对话框打开事件
 */
const handleDialogOpen = () => {
  setTimeout(() => {
    lockInputInstance.value?.input?.focus();
  }, 100);
};

/**
 * 处理锁定事件
 */
const handleLock = async (formEl: FormInstance | null) => {
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      const encryptedPassword = encrypt(formData.password);
      userStore.setLockStatus(true);
      userStore.setLockPassword(encryptedPassword);
      dialogVisible.value = false;
      formData.password = "";
    } else {
      console.error("表单验证失败:", fields);
    }
  });
};

/**
 * 处理解锁事件
 */
const handleUnlock = async (formEl: FormInstance | null) => {
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      const pwd = decrypt(lockPassword.value);

      const isValid = pwd === unlockForm.password;

      if (isValid) {
        try {
          userStore.setLockStatus(false);
          userStore.setLockPassword("");

          unlockForm.password = "";
          dialogVisible.value = false;
          showDevToolsWarning.value = false;
        } catch (error) {
          console.error("解锁失败:", error);
        }
      } else ElMessage.error(t("_lockScreen.passwordError"));
    } else console.error("表单验证失败:", fields);
  });
};

/**
 * 加密函数（XOR 加密 + base64 编码）
 * @param text 明文
 * @param key 密钥
 */
const encrypt = (text: string, key = serviceConfig.layout.lockSecretKey) => {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    // 字符与密钥按位异或
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  // Base64 编码处理
  return btoa(result);
};

/**
 * 解密函数（Base64 解码 + XOR 解密）
 * @param encoded 加密后的字符串
 * @param key 密钥
 */
const decrypt = (encoded: string, key = serviceConfig.layout.lockSecretKey) => {
  const decoded = atob(encoded);
  let result = "";
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
};

const router = useRouter();
const toLogin = async () => {
  // 调用退出登录接口
  await userStore.logout();
  // 重定向到登陆页
  router.push(LOGIN_URL);
};

onMounted(() => {
  mittBus.on(OpenLockPanelKey, () => (dialogVisible.value = true));

  if (isLock.value) {
    dialogVisible.value = true;
    setTimeout(() => {
      unlockInputInstance.value?.input?.focus();
    }, 100);
  }
});

onUnmounted(() => {
  // 清理禁用开发者工具的事件监听器
  if (cleanup) cleanup();
});
</script>

<template>
  <div :class="ns.b()">
    <!-- 开发者工具警告覆盖层 -->
    <div v-if="showDevToolsWarning" :class="ns.e('dev-tools-warning')">
      <div :class="ns.e('warning-content')">
        <div class="warning-icon">🔒</div>
        <h1 class="warning-title">系统已锁定</h1>
        <p class="warning-text">
          检测到开发者工具已打开
          <br />
          为了系统安全，请关闭开发者工具后继续使用
        </p>
        <div class="warning-subtitle">Security Lock Activated</div>
      </div>
    </div>

    <!-- 锁屏弹窗 -->
    <div v-if="!isLock">
      <el-dialog v-model="dialogVisible" :width="370" :show-close="false" align-center @open="handleDialogOpen">
        <div :class="ns.e('lock-content')">
          <img class="cover" :src="userInfo.avatar" alt="用户头像" />
          <div class="username">{{ userInfo.username }}</div>

          <el-form ref="formInstance" :model="formData" :rules="rules" @submit.prevent="handleLock">
            <el-form-item prop="password">
              <el-input
                v-model="formData.password"
                ref="lockInputInstance"
                type="password"
                :placeholder="$t('_lockScreen.inputPlaceholder')"
                :show-password="true"
                autocomplete="new-password"
                @keyup.enter="handleLock(formInstance)"
              >
                <template #suffix>
                  <el-icon class="cursor-pointer" @click="handleLock(formInstance)">
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-button type="primary" class="lock-btn" @click="handleLock(formInstance)">
              {{ $t("_lockScreen.lockButtonText") }}
            </el-button>
          </el-form>
        </div>
      </el-dialog>
    </div>

    <!-- 解锁界面 -->
    <div v-else :class="ns.e('unlock-content')">
      <div :class="ns.e('box')">
        <img class="cover" :src="userInfo.avatar" alt="用户头像" />
        <div class="username">{{ userInfo.username }}</div>

        <el-form
          ref="unlockFormInstance"
          :model="unlockForm"
          :rules="rules"
          @submit.prevent="handleUnlock(unlockFormInstance)"
        >
          <el-form-item prop="password">
            <el-input
              v-model="unlockForm.password"
              ref="unlockInputInstance"
              type="password"
              :placeholder="$t('_lockScreen.unInputPlaceholder')"
              :show-password="true"
              autocomplete="new-password"
            >
              <template #suffix>
                <el-icon class="cursor-pointer" @click="handleUnlock(unlockFormInstance)">
                  <Unlock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-button type="primary" class="unlock-btn" @click="handleUnlock(unlockFormInstance)">
            {{ $t("_lockScreen.unlockButtonText") }}
          </el-button>
          <el-button text class="login-btn" @click="toLogin">
            {{ $t("_lockScreen.backLogin") }}
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "./index";
</style>
