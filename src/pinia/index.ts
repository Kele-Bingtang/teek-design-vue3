import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import { localStorageProxy, StorageManager } from "@/common/utils";
import SystemConfig from "@/common/config";

export * from "./stores/core/layout";
export * from "./stores/core/route";
export * from "./stores/core/setting";
export * from "./stores/core/user";
export * from "./stores/error-log";
export * from "./stores/message";
export * from "./stores/websocket";

/**
 * 自定义存储逻辑
 */
const customStorage = {
  getItem: (key: string) => localStorageProxy.getItem(key, false),
  setItem: (key: string, value: string) => localStorageProxy.setItem(key, value, false),
};

/**
 * 获取存储的 key
 *
 * 1. 如果当前版本有该 key，则返回当前版本 key
 * 2. 如果当前版本没有该 key，则查找其他旧版本的 key
 * 3. 如果其他旧版本有该 key，则合并数据到当前版本
 * 4. 如果其他旧版本没有该 key，则返回当前版本 key
 */
const getStorageKey = (key: string) => {
  const currentStoreKey = StorageManager.normalizeKey(key);

  // 如果当前版本有该 key，则返回当前版本 key
  if (localStorage.getItem(currentStoreKey)) return currentStoreKey;

  // 如果当前版本没有该 key，则查找其他旧版本的 key
  const oldVersionKeys = Object.keys(localStorage).find(
    // 匹配旧版本数据 key，格式如 {cacheKeyPrefix}:vX.Y.Z:{key}
    k => k.startsWith(`${StorageManager.cacheKeyPrefix}:v`) && k.endsWith(`:${key}`) && localStorage.getItem(k)
  );

  // 如果其他旧版本没有该 key，则返回当前版本 key
  if (!oldVersionKeys) return currentStoreKey;

  // 如果需要清理所有缓存，则清理
  if (SystemConfig.keyConfig.cleanCacheWhenUpgrade) {
    localStorage.removeItem(oldVersionKeys);
    return currentStoreKey;
  }

  // 将旧版本数据合并到新版本里
  try {
    const oldVersionData = localStorageProxy.getItem(oldVersionKeys);
    localStorageProxy.setItem(currentStoreKey, oldVersionData);

    console.info(`[Storage] 已合并旧版本数据: ${oldVersionKeys} → ${currentStoreKey}`);
    localStorage.removeItem(oldVersionKeys);
  } catch (error) {
    console.error(`[Storage] 合并旧版本数据失败: ${oldVersionKeys} → ${currentStoreKey}`, error);
    localStorage.removeItem(oldVersionKeys);
  }

  return currentStoreKey;
};

const pinia = createPinia();
pinia.use(
  createPersistedState({
    key: key => getStorageKey(key),
    storage: customStorage,
  })
);

export default pinia;
