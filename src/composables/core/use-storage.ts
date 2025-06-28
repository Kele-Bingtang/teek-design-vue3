import SystemConfig from "@/common/config";

/**
 *
 * @param value 获取传入的值的类型
 * @returns
 */
const getValueType = (value: any) => {
  const type = Object.prototype.toString.call(value);
  return type.slice(8, -1);
};

/**
 * storage 相关 API 封装
 */
export const useStorage = <T = any>(type: "sessionStorage" | "localStorage" = "localStorage") => {
  const { version } = __APP_INFO__.pkg;
  const cacheKeyPrefix = SystemConfig.keyConfig.cacheKeyPrefix;

  /**
   * 获取规范化的 key 值
   */
  const normalizeKey = (key: string) => {
    if (key.includes("userStore")) return `${cacheKeyPrefix}:userStore`;

    const keySlot = "{key}";
    return `${cacheKeyPrefix}:v${version}:${keySlot}`.replace(keySlot, key);
  };

  const defaultExcludes = [""];

  const getStorage = (key: string): T | undefined => {
    const value = window[type].getItem(normalizeKey(key));
    if (value) {
      const { value: val } = JSON.parse(value);
      return val;
    }
  };

  const setStorage = (key: string, value: T) => {
    const valueType = getValueType(value);
    window[type].setItem(normalizeKey(key), JSON.stringify({ _type: valueType, value }));
  };

  const removeStorage = (key: string) => {
    window[type].removeItem(normalizeKey(key));
  };

  const removeStorages = (key: string[]) => {
    key.forEach(key => window[type].removeItem(normalizeKey(key)));
  };

  const clear = (excludes?: string[]) => {
    // 获取排除项
    const keys = Object.keys(window[type]);
    const excludesArr = (excludes ? [...excludes, ...defaultExcludes] : defaultExcludes).map(key => normalizeKey(key));
    console.log(excludesArr);
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
