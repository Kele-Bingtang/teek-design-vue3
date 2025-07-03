import SystemConfig from "@/common/config";

export class StorageManager {
  static readonly cacheKeyPrefix = SystemConfig.keyConfig.cacheKeyPrefix;
  static readonly version = __APP_INFO__.pkg.version;

  private defaultExcludes = [""];

  private type: "sessionStorage" | "localStorage" = "localStorage";

  constructor(type: "sessionStorage" | "localStorage" = "localStorage") {
    this.type = type;
  }

  /**
   * 获取规范化的 key 值
   */
  static normalizeKey(key: string) {
    return `${this.cacheKeyPrefix}:v${this.version}:${key}`;
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
    const storageValue = window[this.type].getItem(normalizeKey ? StorageManager.normalizeKey(key) : key);
    if (!storageValue) return null;

    const { value } = JSON.parse(storageValue);
    return value;
  }

  /**
   * 设置存储的值
   */
  setItem(key: string, value: any, normalizeKey = true) {
    const valueType = this.getValueType(value);
    window[this.type].setItem(
      normalizeKey ? StorageManager.normalizeKey(key) : key,
      JSON.stringify({ _type: valueType, value })
    );
  }

  /**
   * 删除存储的值
   */
  removeItem(key: string, normalizeKey = true) {
    window[this.type].removeItem(normalizeKey ? StorageManager.normalizeKey(key) : key);
  }

  /**
   * 删除多个存储的值
   */
  removeItems(keys: string[], normalizeKey = true) {
    keys.forEach(key => window[this.type].removeItem(normalizeKey ? StorageManager.normalizeKey(key) : key));
  }

  /**
   * 清除存储的值
   */
  clear(excludes?: string[], normalizeKey = true) {
    // 获取排除项
    const excludesArr = (excludes ? [...excludes, ...this.defaultExcludes] : this.defaultExcludes).map(key =>
      normalizeKey ? StorageManager.normalizeKey(key) : key
    );
    const keys = Object.keys(window[this.type]);
    const includesKeys = excludesArr.length
      ? keys.filter(key => !excludesArr.includes(key) && key.startsWith(StorageManager.cacheKeyPrefix))
      : keys;

    // 排除项不清除
    includesKeys.forEach(key => window[this.type].removeItem(key));
  }
}

const localStorageProxy = new StorageManager("localStorage");
const sessionStorageProxy = new StorageManager("sessionStorage");

export { localStorageProxy, sessionStorageProxy };
