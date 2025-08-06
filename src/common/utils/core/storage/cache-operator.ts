import type { TabProps } from "@/pinia";
import { serviceConfig } from "@/common/config";
import { localStorageProxy } from "./storage-manager";

class CacheOperator {
  // 标签栏的 tabNav 缓存
  readonly tabNavKey = serviceConfig.cache.tabNavCacheKey;
  // 路由缓存
  readonly dynamicRoutesKey = serviceConfig.cache.cacheDynamicRoutesKey;
  // 缓存 key 前缀
  readonly cacheKeyPrefix = serviceConfig.cache.cacheKeyPrefix;
  // 版本号缓存配置
  readonly versionKey = serviceConfig.cache.versionCacheKey;

  // 缓存版本号的 key
  readonly versionStorageKey = `${this.cacheKeyPrefix}:${this.versionKey}`;

  /**
   * 获取存储的版本号
   */
  getStoredVersion = () => localStorage.getItem(this.versionStorageKey);

  /**
   * 设置存储的版本号
   */
  setStoredVersion = (version: string) => localStorage.setItem(this.versionStorageKey, version);

  /**
   * 先获取当前存储版本的缓存，如果不存在，则尝试获取最新版本的缓存
   */
  getItem(key: string) {
    const storedVersion = this.getStoredVersion();
    const currentVersionKey = localStorageProxy.normalizeKey(key);

    if (storedVersion) {
      return (
        localStorageProxy.getItem<TabProps[]>(
          currentVersionKey.replace(`v${localStorageProxy.getVersion()}`, storedVersion),
          false
        ) ??
        localStorageProxy.getItem(this.tabNavKey) ??
        []
      );
    } else {
      return localStorageProxy.getItem(this.tabNavKey) ?? [];
    }
  }

  /**
   * 获取标签栏的 tabNav 缓存
   */
  getCacheTabNavList = () => this.getItem(this.tabNavKey);
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
   * 移除项目缓存
   */
  removeProjectsCache = () => {
    const { tabNavCacheKey, cacheDynamicRoutesKey, versionCacheKey } = serviceConfig.cache;
    localStorageProxy.removeItems([tabNavCacheKey, cacheDynamicRoutesKey, versionCacheKey]);
  };
}

export const cacheOperator = new CacheOperator();
