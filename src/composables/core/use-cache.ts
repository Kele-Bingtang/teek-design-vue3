import type { TabProp } from "@/pinia";
import SystemConfig from "@/common/config";
import { useStorage } from "@/composables";

export const useCache = () => {
  const { getStorage, setStorage, removeStorage, removeStorages } = useStorage();

  // 标签页的 tabNav 缓存
  const tabNavKey = SystemConfig.keyConfig.tabNavCacheKey;
  const getCacheTabNavList = () => getStorage(tabNavKey);
  const setCacheTabNavList = (tabNavList: TabProp[]) => setStorage(tabNavKey, tabNavList);
  const removeCacheTabNavList = () => removeStorage(tabNavKey);

  // 标签页的 tabNav 缓存
  const dynamicRoutesKey = SystemConfig.keyConfig.cacheDynamicRoutesKey;
  const getDynamicRoutes = (): RouterConfigRaw[] => getStorage(dynamicRoutesKey);
  const setDynamicRoutes = (dynamicRoutes: RouterConfigRaw[]) => setStorage(dynamicRoutesKey, dynamicRoutes);
  const removeDynamicRoutes = () => removeStorage(dynamicRoutesKey);

  // 版本号缓存
  const versionKey = SystemConfig.keyConfig.versionCacheKey;
  const getCacheVersion = () => getStorage(versionKey);
  const setCacheVersion = (version: string) => setStorage(versionKey, version);
  const removeCacheVersion = () => removeStorage(versionKey);

  const removeProjectsCache = () => {
    const { tabNavCacheKey, cacheDynamicRoutesKey, versionCacheKey } = SystemConfig.keyConfig;
    removeStorages([tabNavCacheKey, cacheDynamicRoutesKey, versionCacheKey]);
  };

  return {
    getCacheTabNavList,
    setCacheTabNavList,
    removeCacheTabNavList,
    getDynamicRoutes,
    setDynamicRoutes,
    removeDynamicRoutes,
    getCacheVersion,
    setCacheVersion,
    removeCacheVersion,
    removeProjectsCache,
  };
};
