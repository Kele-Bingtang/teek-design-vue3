import type { InternalAxiosRequestConfig } from "axios";
import qs from "qs";

/**
 * 缓存管理器
 * 用于管理 HTTP 请求的缓存机制
 */
export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
}

export class CacheManager {
  // 缓存存储
  private cacheStorage = new Map<string, CacheEntry>();

  /**
   * 生成缓存键
   */
  public generateCacheKey(config: InternalAxiosRequestConfig, customKey?: string): string {
    const { method = "get", url = "", params } = config;
    // 如果用户提供了自定义缓存键，使用它
    if (customKey) return customKey;

    // 否则根据 URL 和参数生成
    const paramsStr = params ? qs.stringify(params, { arrayFormat: "repeat", sort: (a, b) => a.localeCompare(b) }) : "";
    return `${method.toUpperCase()}:${url}?${paramsStr}`;
  }

  /**
   * 从缓存获取数据
   */
  public get(key: string, ttl?: number): any | null {
    const cachedItem = this.cacheStorage.get(key);
    if (!cachedItem) return null;

    // 如果没有设置 TTL 或者缓存在有效期内，返回缓存数据
    if (!ttl || Date.now() - cachedItem.timestamp < ttl) {
      return cachedItem.data;
    }

    // 缓存过期，删除并返回 null
    this.cacheStorage.delete(key);
    return null;
  }

  /**
   * 保存数据到缓存
   */
  public set(key: string, data: any, ttl?: number): void {
    this.cacheStorage.set(key, {
      data,
      timestamp: Date.now(),
    });

    // 如果设置了 TTL，定时清理过期缓存
    if (ttl) {
      setTimeout(() => {
        this.cacheStorage.delete(key);
      }, ttl);
    }
  }

  /**
   * 清除所有缓存
   */
  public clear(): void {
    this.cacheStorage.clear();
  }

  /**
   * 根据键清除特定缓存
   */
  public delete(key: string): void {
    this.cacheStorage.delete(key);
  }

  /**
   * 获取缓存大小
   */
  public size(): number {
    return this.cacheStorage.size;
  }
}
