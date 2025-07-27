import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { serviceConfig, LOGIN_NAME } from "@/common/config";
import { useUserStore } from "@/pinia";
import { upgradeLogList } from "@/mock/changeLog";
import { useCommon } from "./use-common";
import { useNamespace } from "./use-namespace";

/**
 * 模拟后台获取升级信息
 */
const getUpgradeInfo = () => Promise.resolve(upgradeLogList);

/**
 * 版本升级管理
 */
export const useUpgrade = async () => {
  const userStore = useUserStore();
  const router = useRouter();
  const ns = useNamespace();

  // 当前前端版本号
  const { version: currentVersion } = useCommon();

  const { cacheKeyPrefix, versionCacheKey } = serviceConfig.cache;

  const versionStorageKey = `${cacheKeyPrefix}:${versionCacheKey}`;

  /**
   * 移除前缀 'v'
   */
  const normalizeVersion = (version: string): string => version.replace(/^v/, "");

  /**
   * 获取存储的版本号
   */
  const getStoredVersion = () => localStorage.getItem(versionStorageKey);

  /**
   * 设置存储的版本号
   */
  const setStoredVersion = (version: string) => localStorage.setItem(versionStorageKey, version);

  /**
   * 查找旧版本号的数据 key，以 cacheKeyPrefix:v 开头，且不能是当前版本号数据
   */
  const findOldVersionDataKeys = () => {
    const storageKeys = Object.keys(localStorage);
    return storageKeys.filter(
      key => key.startsWith(`${cacheKeyPrefix}:v`) && !key.startsWith(`${cacheKeyPrefix}:v${currentVersion}`)
    );
  };

  // 获取旧版本
  const oldVersion = getStoredVersion();

  // 如果不存在旧版本，则不需要显示升级通知
  if (!oldVersion) {
    setStoredVersion(`v${currentVersion}`);
    console.info("[Upgrade] 首次访问，已设置当前版本");
    return;
  }

  const normalizeFrontendVersion = normalizeVersion(currentVersion);
  const normalizeOldVersion = normalizeVersion(oldVersion);

  // 如果当前版本小于等于旧版本，则不需要显示升级通知（也可改成版本相同不需要通知）
  if (normalizeFrontendVersion <= normalizeOldVersion) {
    console.debug("[Upgrade] 版本低于或等于旧版本，无需升级");
    return;
  }

  const oldVersionDataKeys = findOldVersionDataKeys();
  if (oldVersionDataKeys.length === 0) {
    setStoredVersion(`v${currentVersion}`);
    console.info("[Upgrade] 无旧数据，已更新版本号");
    return;
  }

  // 获取升级信息
  const upgradeInfo = await getUpgradeInfo();
  if (!upgradeInfo.value.length) {
    console.warn("[Upgrade] 升级日志列表为空");
    return;
  }

  // 检查是否需要重新登录
  const requireReLogin = upgradeInfo.value.some(item => {
    const itemVersion = normalizeVersion(item.version);

    return item.requireReLogin && itemVersion > normalizeOldVersion && itemVersion <= normalizeFrontendVersion;
  });

  // 系统升级公告
  const message = [
    `<p style="color: ${ns.cssVar("gray-text-800")}; padding-bottom: 5px;">`,
    `系统已升级到 ${currentVersion} 版本，此次更新带来了以下改进：`,
    `</p>`,
    upgradeInfo.value[0].title,
    requireReLogin
      ? `<p style="color: ${ns.cssVar("color-primary")}; padding-top: 5px;">升级完成，请重新登录后继续使用。</p>`
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
  oldVersionDataKeys.forEach(key => {
    localStorage.removeItem(key);
    console.info(`[Upgrade] 已清理旧存储: ${key}`);
  });

  // 更新版本信息
  setStoredVersion(`v${currentVersion}`);

  // 如果需要重新登录，则登出
  if (requireReLogin) {
    userStore.logout();
    router.push(LOGIN_NAME).catch(error => {
      console.error("[Upgrade] 升级后登出失败:", error);
    });

    console.info("[Upgrade] 已执行升级后登出");
  }

  console.info(`[Upgrade] 升级完成: ${oldVersion} → ${currentVersion}`);
};
