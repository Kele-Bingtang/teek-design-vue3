<template>
  <div class="layout-lock-screen">
    <!-- 开发者工具警告覆盖层 -->
    <div v-if="showDevToolsWarning" class="dev-tools-warning">
      <div class="warning-content">
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
      <ElDialog v-model="dialogVisible" :width="370" :show-close="false" align-center @open="handleDialogOpen">
        <div class="lock-content">
          <img class="cover" :src="userInfo.avatar" alt="用户头像" />
          <div class="username">{{ userInfo.username }}</div>
          <ElForm ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleLock">
            <ElFormItem prop="password">
              <ElInput
                v-model="formData.password"
                type="password"
                :placeholder="$t('_lockScreen.inputPlaceholder')"
                :show-password="true"
                ref="lockInputRef"
                @keyup.enter="handleLock(formRef)"
              >
                <template #suffix>
                  <ElIcon class="cursor-pointer" @click="handleLock(formRef)">
                    <Lock />
                  </ElIcon>
                </template>
              </ElInput>
            </ElFormItem>
            <ElButton type="primary" class="lock-btn" @click="handleLock(formRef)" v-ripple>
              {{ $t("_lockScreen.lockBtnText") }}
            </ElButton>
          </ElForm>
        </div>
      </ElDialog>
    </div>

    <!-- 解锁界面 -->
    <div v-else class="unlock-content">
      <div class="box">
        <img class="cover" :src="userInfo.avatar" alt="用户头像" />
        <div class="username">{{ userInfo.username }}</div>
        <ElForm ref="unlockFormRef" :model="unlockForm" :rules="rules" @submit.prevent="handleUnlock(unlockFormRef)">
          <ElFormItem prop="password">
            <ElInput
              v-model="unlockForm.password"
              type="password"
              :placeholder="$t('_lockScreen.unInputPlaceholder')"
              :show-password="true"
              ref="unlockInputRef"
            >
              <template #suffix>
                <ElIcon class="cursor-pointer" @click="handleUnlock(unlockFormRef)">
                  <Unlock />
                </ElIcon>
              </template>
            </ElInput>
          </ElFormItem>

          <ElButton type="primary" class="unlock-btn" @click="handleUnlock(unlockFormRef)" v-ripple>
            {{ $t("_lockScreen.unlockBtnText") }}
          </ElButton>
          <ElButton text class="login-btn" @click="toLogin">
            {{ $t("_lockScreen.backLogin") }}
          </ElButton>
        </ElForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import { mittBus } from "@/common/utils";
import { OpenLockPanelKey } from "@/common/config";
import { ElDialog, ElForm, ElFormItem, ElButton, ElInput, ElIcon, ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { Unlock, Lock } from "@element-plus/icons-vue";
import { useUserStore } from "@/pinia";
import { useI18n } from "vue-i18n";

defineOptions({
  name: "LockPanel",
});

const formRef = ref<any>(null);
const unlockFormRef = ref<any>(null);
const unlockInputRef = ref<any>(null);
const lockInputRef = ref<any>(null);
const dialogVisible = ref(false);
const showDevToolsWarning = ref<boolean>(false);

// 设置密钥（双方必须共享）
const SECRET_KEY = "my-secret-key";

const formData = reactive({
  password: "",
});

const unlockForm = reactive({
  password: "",
});

const { t } = useI18n();

const userStore = useUserStore();

const { userInfo, lockPassword, isLock } = storeToRefs(userStore);

// 表单验证规则
const rules = computed<FormRules>(() => ({
  password: [
    {
      required: true,
      message: t("_lockScreen.inputPlaceholder"),
      trigger: "blur",
    },
  ],
}));

// 检测是否为移动设备
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 添加禁用控制台的函数
const disableDevTools = () => {
  // 禁用右键菜单
  const handleContextMenu = (e: Event) => {
    if (isLock.value) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };
  document.addEventListener("contextmenu", handleContextMenu, true);

  // 禁用开发者工具相关快捷键
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isLock.value) return;

    // 禁用 F12
    if (e.key === "F12") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // 禁用 Ctrl+Shift+I/J/C/K (开发者工具)
    if (e.ctrlKey && e.shiftKey) {
      const key = e.key.toLowerCase();
      if (["i", "j", "c", "k"].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // 禁用 Ctrl+U (查看源代码)
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // 禁用 Ctrl+S (保存页面)
    if (e.ctrlKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // 禁用 Ctrl+A (全选)
    if (e.ctrlKey && e.key.toLowerCase() === "a") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // 禁用 Ctrl+P (打印)
    if (e.ctrlKey && e.key.toLowerCase() === "p") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // 禁用 Ctrl+F (查找)
    if (e.ctrlKey && e.key.toLowerCase() === "f") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // 禁用 Alt+Tab (切换窗口)
    if (e.altKey && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // 禁用 Ctrl+Tab (切换标签页)
    if (e.ctrlKey && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // 禁用 Ctrl+W (关闭标签页)
    if (e.ctrlKey && e.key.toLowerCase() === "w") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // 禁用 Ctrl+R 和 F5 (刷新页面)
    if ((e.ctrlKey && e.key.toLowerCase() === "r") || e.key === "F5") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // 禁用 Ctrl+Shift+R (强制刷新)
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "r") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };
  document.addEventListener("keydown", handleKeyDown, true);

  // 禁用选择文本
  const handleSelectStart = (e: Event) => {
    if (isLock.value) {
      e.preventDefault();
      return false;
    }
  };
  document.addEventListener("selectstart", handleSelectStart, true);

  // 禁用拖拽
  const handleDragStart = (e: Event) => {
    if (isLock.value) {
      e.preventDefault();
      return false;
    }
  };
  document.addEventListener("dragstart", handleDragStart, true);

  // 监听开发者工具打开状态（仅在桌面端启用）
  const devtools = { open: false };
  const threshold = 160;
  let devToolsInterval: ReturnType<typeof setInterval> | null = null;

  const checkDevTools = () => {
    if (!isLock.value || isMobile()) return;

    const isDevToolsOpen =
      window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold;

    if (isDevToolsOpen && !devtools.open) {
      devtools.open = true;
      showDevToolsWarning.value = true;
    } else if (!isDevToolsOpen && devtools.open) {
      devtools.open = false;
      showDevToolsWarning.value = false;
    }
  };

  // 仅在桌面端启用开发者工具检测
  if (!isMobile()) {
    devToolsInterval = setInterval(checkDevTools, 500);
  }

  // 返回清理函数
  return () => {
    document.removeEventListener("contextmenu", handleContextMenu, true);
    document.removeEventListener("keydown", handleKeyDown, true);
    document.removeEventListener("selectstart", handleSelectStart, true);
    document.removeEventListener("dragstart", handleDragStart, true);
    if (devToolsInterval) {
      clearInterval(devToolsInterval);
    }
  };
};

// 事件处理函数
const handleKeydown = (event: KeyboardEvent) => {
  if (event.altKey && event.key.toLowerCase() === "¬") {
    event.preventDefault();
    dialogVisible.value = true;
  }
};

const handleDialogOpen = () => {
  setTimeout(() => {
    lockInputRef.value?.input?.focus();
  }, 100);
};

const handleLock = async (formEl: FormInstance | undefined) => {
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

const handleUnlock = async (formEl: FormInstance | undefined) => {
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
          console.error("更新store失败:", error);
        }
      } else {
        ElMessage.error(t("_lockScreen.pwdError"));
      }
    } else {
      console.error("表单验证失败:", fields);
    }
  });
};

// 加密函数（XOR 加密 + base64 编码）
const encrypt = (text: string, key = SECRET_KEY) => {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    // 字符与密钥按位异或
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  // Base64 编码处理
  return btoa(result);
};

// 解密函数（Base64 解码 + XOR 解密）
const decrypt = (encoded: string, key = SECRET_KEY) => {
  const decoded = atob(encoded);
  let result = "";
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
};

const toLogin = () => {
  userStore.logout();
};

// 监听锁屏状态变化
watch(isLock, newValue => {
  if (newValue) {
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      unlockInputRef.value?.input?.focus();
    }, 100);
  } else {
    document.body.style.overflow = "auto";
    showDevToolsWarning.value = false;
  }
});

let cleanupDevTools: (() => void) | null = null;

onMounted(() => {
  mittBus.on(OpenLockPanelKey, () => (dialogVisible.value = true));
  document.addEventListener("keydown", handleKeydown);

  if (isLock.value) {
    dialogVisible.value = true;
    setTimeout(() => {
      unlockInputRef.value?.input?.focus();
    }, 100);
  }

  // 初始化禁用开发者工具功能
  cleanupDevTools = disableDevTools();
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "auto";
  // 清理禁用开发者工具的事件监听器
  if (cleanupDevTools) {
    cleanupDevTools();
    cleanupDevTools = null;
  }
});
</script>

<style scoped lang="scss">
.layout-lock-screen {
  :deep(.el-dialog) {
    border-radius: 10px;
  }

  // 开发者工具警告样式
  .dev-tools-warning {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #ffffff;
    background: linear-gradient(135deg, #1e1e1e 0%, #000000 100%);
    animation: fadeIn 0.3s ease-in-out;

    .warning-content {
      padding: 20px;
      text-align: center;
      user-select: none;

      .warning-icon {
        margin-bottom: 30px;
        font-size: 48px;
      }

      .warning-title {
        margin: 0 0 20px;
        font-size: 28px;
        font-weight: 600;
        color: #ff6b6b;
      }

      .warning-text {
        max-width: 500px;
        margin: 0;
        font-size: 18px;
        line-height: 1.6;
        color: #cccccc;
      }

      .warning-subtitle {
        margin-top: 30px;
        font-size: 14px;
        color: #888888;
      }
    }
  }

  .lock-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .cover {
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }

    .username {
      margin: 15px 0;
      margin-top: 30px;
      font-size: 16px;
      font-weight: 500;
    }

    .el-form {
      width: 90%;
    }

    .el-input {
      width: 100%;
      margin-top: 35px;
    }

    .lock-btn {
      width: 100%;
    }
  }

  .unlock-content {
    position: fixed;
    inset: 0;
    z-index: 2500;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: #ffffff;

    // background-image: url("");
    background-size: cover;
    transition: transform 0.3s ease-in-out;

    .box {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 320px;
      padding: 30px;
      background: rgb(255 255 255 / 90%);
      border-radius: 10px;

      .cover {
        width: 64px;
        height: 64px;
        margin-top: 20px;
        border-radius: 50%;
      }

      .username {
        margin: 15px 0;
        margin-top: 30px;
        font-size: 16px;
        font-weight: 500;
        color: #333333 !important;
      }

      .el-form {
        width: 100%;
        padding: 0 10px !important;
      }

      .el-input {
        margin-top: 20px;
        color: #333333;
      }

      .unlock-btn {
        width: 100%;
      }

      .login-btn {
        display: block;
        margin: 10px auto;
        color: #333333 !important;

        &:hover {
          color: var(--main-color) !important;
          background-color: transparent !important;
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
