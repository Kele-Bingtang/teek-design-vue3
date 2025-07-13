import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/pinia";

// 检测是否为移动设备
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * 禁用控制台
 */
export const useDisableDevTools = () => {
  const userStore = useUserStore();

  const { isLock } = storeToRefs(userStore);

  const showDevToolsWarning = ref<boolean>(false);

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

  // 仅在锁屏状态且桌面端启用开发者工具检测
  watch(
    isLock,
    newVal => {
      if (newVal && !isMobile()) {
        devToolsInterval = setInterval(checkDevTools, 500);
      } else if (devToolsInterval) clearInterval(devToolsInterval);
    },
    { immediate: true }
  );

  // 返回清理函数
  return {
    showDevToolsWarning,
    cleanup: () => {
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("selectstart", handleSelectStart, true);
      document.removeEventListener("dragstart", handleDragStart, true);
      if (devToolsInterval) clearInterval(devToolsInterval);
    },
  };
};
