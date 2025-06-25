import { ElNotification } from "element-plus";
import SystemConfig, { LOGIN_NAME } from "@/common/config";
import { useUserStore } from "@/pinia";
import { useNamespace } from "./use-namespace";
import { useStorage } from "./use-storage";

// 当前前端版本
const { version: frontendVersion } = __APP_INFO__.pkg;

// 模拟后台获取升级信息
const getUpgradeInfo = () => {
  return Promise.resolve({
    version: frontendVersion,
    content: "<p>1. 新增超级组件</p> <p>2. 重构布局样式</p>",
    reLogin: false,
  });
};

export const useUpgrade = async () => {
  const userStore = useUserStore();
  const ns = useNamespace();
  const storage = useStorage();
  const router = useRouter();

  const { cacheKeyPrefix, versionCacheKey } = SystemConfig.keyConfig;

  /**
   * 移除前缀 'v'
   */
  const normalizeVersion = (version: string): string => version.replace(/^v/, "");

  // 旧版本
  const oldVersion = localStorage.getItem(`${cacheKeyPrefix}:${versionCacheKey}`);

  // 如果不存在旧版本，则不需要显示升级通知
  if (!oldVersion) return localStorage.setItem(`${cacheKeyPrefix}:${versionCacheKey}`, `v${frontendVersion}`);

  const upgradeInfo = await getUpgradeInfo();
  if (!upgradeInfo) return;

  const { version: backendVersion, content, reLogin } = upgradeInfo;
  const currentVersion = backendVersion || frontendVersion;

  if (normalizeVersion(currentVersion) <= normalizeVersion(oldVersion)) {
    return;
  }

  // 系统升级公告
  const message = [
    `<p style="color: ${ns.cssVar("gray-text-800")} !important; padding-bottom: 5px;">`,
    `系统已升级到 ${currentVersion} 版本，此次更新带来了以下改进：`,
    `</p>`,
    content,
    reLogin
      ? `<p style="color: ${ns.cssVar("main-color")}; padding-top: 5px;">升级完成，请重新登录后继续使用。</p>`
      : "",
  ].join("");

  // 显示升级通知
  ElNotification({
    title: "系统升级公告",
    message,
    duration: 0,
    type: "success",
    dangerouslyUseHTMLString: true,
  });

  // 清除旧版本的缓存
  storage.clear(reLogin ? [] : ["userStore"]);

  // 更新版本信息
  localStorage.setItem(`${cacheKeyPrefix}:${versionCacheKey}`, `v${currentVersion}`);

  // 如果需要重新登录，则登出
  if (reLogin) {
    userStore.logout();
    router.push(LOGIN_NAME);
  }
};
