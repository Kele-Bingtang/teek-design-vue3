import SystemConfig from "@/common/config";
import { useCommon } from "./use-common";

/**
 * 获取传入的值的类型
 */
const getValueType = (value: any) => {
  const type = Object.prototype.toString.call(value);
  return type.slice(8, -1);
};

/**
 * storage 相关 API 封装
 */
export const useStorage = <T = any>(type: "sessionStorage" | "localStorage" = "localStorage") => {
  const { version } = useCommon();
  const { cacheKeyPrefix } = SystemConfig.keyConfig;

  /**
   * 获取规范化的 key 值
   */
  const normalizeKey = (key: string) => `${version}:v${version}:${key}`;

  // 默认排除项
  const defaultExcludes = [""];

  /**
   * 获取存储的值
   */
  const getStorage = (key: string): T | null => {
    const storageValue = window[type].getItem(normalizeKey(key));
    if (!storageValue) return null;

    const { value } = JSON.parse(storageValue);
    return value;
  };

  /**
   * 设置存储的值
   */
  const setStorage = (key: string, value: T) => {
    const valueType = getValueType(value);
    window[type].setItem(normalizeKey(key), JSON.stringify({ _type: valueType, value }));
  };

  /**
   * 删除存储的值
   */
  const removeStorage = (key: string) => {
    window[type].removeItem(normalizeKey(key));
  };

  /**
   * 删除多个存储的值
   */
  const removeStorages = (key: string[]) => {
    key.forEach(key => window[type].removeItem(normalizeKey(key)));
  };

  /**
   * 清除存储的值
   */
  const clear = (excludes?: string[]) => {
    // 获取排除项
    const keys = Object.keys(window[type]);
    const excludesArr = (excludes ? [...excludes, ...defaultExcludes] : defaultExcludes).map(key => normalizeKey(key));
    const includesKeys = excludesArr.length
      ? keys.filter(key => !excludesArr.includes(key) && key.startsWith(cacheKeyPrefix))
      : keys;

    // 排除项不清除
    includesKeys.forEach(key => window[type].removeItem(key));
  };

  return {
    setStorage,
    getStorage,
    removeStorage,
    removeStorages,
    clear,
  };
};
