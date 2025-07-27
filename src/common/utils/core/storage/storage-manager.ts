import { serviceConfig } from "@/common/config";

type StorageType = "localStorage" | "sessionStorage";

interface StorageManagerOptions {
  type?: StorageType;
  prefix?: string;
  version?: string;
}

export class StorageManager {
  private defaultExcludes = [""];

  private type: StorageType;
  private prefix: string;
  private version: string;

  constructor({ type = "localStorage", prefix = "", version = "" }: StorageManagerOptions) {
    this.type = type;
    this.prefix = prefix;
    this.version = version;
  }

  public getStorage() {
    return window[this.type];
  }

  public getPrefix() {
    return this.prefix;
  }

  public getVersion() {
    return this.version;
  }

  /**
   * 获取规范化的 key 值
   */
  public normalizeKey(key: string) {
    let keyStr = "";

    if (this.prefix) keyStr += `${this.prefix}:`;
    if (this.version) keyStr += `v${this.version}:`;
    keyStr += key;
    return keyStr;
  }

  /**
   * 获取值的类型
   */
  private getValueType(value: any) {
    return Object.prototype.toString.call(value).slice(8, -1);
  }

  /**
   * 获取存储的值
   */
  getItem<T = any>(key: string, normalizeKey = true): T | null {
    const storageValue = window[this.type].getItem(normalizeKey ? this.normalizeKey(key) : key);
    if (!storageValue) return null;

    const { value } = JSON.parse(storageValue);
    return value;
  }

  /**
   * 设置存储的值
   */
  setItem(key: string, value: any, normalizeKey = true) {
    const valueType = this.getValueType(value);
    window[this.type].setItem(normalizeKey ? this.normalizeKey(key) : key, JSON.stringify({ _type: valueType, value }));
  }

  /**
   * 删除存储的值
   */
  removeItem(key: string, normalizeKey = true) {
    window[this.type].removeItem(normalizeKey ? this.normalizeKey(key) : key);
  }

  /**
   * 删除多个存储的值
   */
  removeItems(keys: string[], normalizeKey = true) {
    keys.forEach(key => window[this.type].removeItem(normalizeKey ? this.normalizeKey(key) : key));
  }

  /**
   * 清除存储的值
   */
  clear(excludes?: string[], normalizeKey = true) {
    // 获取排除项
    const excludesArr = (excludes ? [...excludes, ...this.defaultExcludes] : this.defaultExcludes).map(key =>
      normalizeKey ? this.normalizeKey(key) : key
    );
    const keys = Object.keys(window[this.type]);
    const includesKeys = excludesArr.length
      ? keys.filter(key => !excludesArr.includes(key) && key.startsWith(this.prefix))
      : keys;

    // 排除项不清除
    includesKeys.forEach(key => window[this.type].removeItem(key));
  }
}

// 创建项目使用的存储管理器
const localStorageProxy = new StorageManager({
  type: "localStorage",
  prefix: serviceConfig.cache.cacheKeyPrefix,
  version: __APP_INFO__.pkg.version,
});

const sessionStorageProxy = new StorageManager({
  type: "sessionStorage",
  prefix: serviceConfig.cache.cacheKeyPrefix,
  version: __APP_INFO__.pkg.version,
});

export { localStorageProxy, sessionStorageProxy };
