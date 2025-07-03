import type { TabProps } from "@/pinia";
import SystemConfig from "@/common/config";
import { localStorageProxy } from "./storage-manager";

class CacheOperator {
  // 标签页的 tabNav 缓存
  readonly tabNavKey = SystemConfig.keyConfig.tabNavCacheKey;
  // 路由缓存
  readonly dynamicRoutesKey = SystemConfig.keyConfig.cacheDynamicRoutesKey;
  // 版本号缓存
  readonly versionKey = SystemConfig.keyConfig.versionCacheKey;

  getCacheTabNavList = () => localStorageProxy.getItem<TabProps[]>(this.tabNavKey) ?? [];
  setCacheTabNavList = (tabNavList: TabProps[]) => localStorageProxy.setItem(this.tabNavKey, tabNavList);
  removeCacheTabNavList = () => localStorageProxy.removeItem(this.tabNavKey);

  getDynamicRoutes = () => localStorageProxy.getItem<RouterConfigRaw[]>(this.dynamicRoutesKey) ?? [];
  setDynamicRoutes = (dynamicRoutes: RouterConfigRaw[]) =>
    localStorageProxy.setItem(this.dynamicRoutesKey, dynamicRoutes);
  removeDynamicRoutes = () => localStorageProxy.removeItem(this.dynamicRoutesKey);

  getCacheVersion = () => localStorageProxy.getItem<string>(this.versionKey);
  setCacheVersion = (version: string) => localStorageProxy.setItem(this.versionKey, version);
  removeCacheVersion = () => localStorageProxy.removeItem(this.versionKey);

  removeProjectsCache = () => {
    const { tabNavCacheKey, cacheDynamicRoutesKey, versionCacheKey } = SystemConfig.keyConfig;
    localStorageProxy.removeItems([tabNavCacheKey, cacheDynamicRoutesKey, versionCacheKey]);
  };
}

export const cacheOperator = new CacheOperator();
