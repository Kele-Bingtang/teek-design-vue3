import type { TabProps } from "@/pinia";
import { serviceConfig } from "@/common/config";
import { localStorageProxy } from "./storage-manager";

class CacheOperator {
  // 标签栏的 tabNav 缓存
  readonly tabNavKey = serviceConfig.cache.tabNavCacheKey;
  // 路由缓存
  readonly dynamicRoutesKey = serviceConfig.cache.cacheDynamicRoutesKey;
  // 版本号缓存
  readonly versionKey = serviceConfig.cache.versionCacheKey;

  /**
   * 获取标签栏的 tabNav 缓存
   */
  getCacheTabNavList = () => localStorageProxy.getItem<TabProps[]>(this.tabNavKey) ?? [];
  /**
   * 设置标签栏的 tabNav 缓存
   *
   * @param tabNavList 标签栏的 tabNav 缓存
   */
  setCacheTabNavList = (tabNavList: TabProps[]) => localStorageProxy.setItem(this.tabNavKey, tabNavList);
  /**
   * 移除标签栏的 tabNav 缓存
   */
  removeCacheTabNavList = () => localStorageProxy.removeItem(this.tabNavKey);

  /**
   * 获取路由缓存
   */
  getDynamicRoutes = () => localStorageProxy.getItem<RouterConfigRaw[]>(this.dynamicRoutesKey) ?? [];
  /**
   * 设置路由缓存
   *
   * @param dynamicRoutes 路由缓存
   */
  setDynamicRoutes = (dynamicRoutes: RouterConfigRaw[]) =>
    localStorageProxy.setItem(this.dynamicRoutesKey, dynamicRoutes);
  /**
   * 移除路由缓存
   */
  removeDynamicRoutes = () => localStorageProxy.removeItem(this.dynamicRoutesKey);

  /**
   * 获取版本号缓存
   */
  getCacheVersion = () => localStorageProxy.getItem<string>(this.versionKey);
  /**
   * 设置版本号缓存
   *
   * @param version 版本号缓存
   */
  setCacheVersion = (version: string) => localStorageProxy.setItem(this.versionKey, version);
  /**
   * 移除版本号缓存
   */
  removeCacheVersion = () => localStorageProxy.removeItem(this.versionKey);

  /**
   * 移除项目缓存
   */
  removeProjectsCache = () => {
    const { tabNavCacheKey, cacheDynamicRoutesKey, versionCacheKey } = serviceConfig.cache;
    localStorageProxy.removeItems([tabNavCacheKey, cacheDynamicRoutesKey, versionCacheKey]);
  };
}

export const cacheOperator = new CacheOperator();
