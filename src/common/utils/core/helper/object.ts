import { isArray, isObject } from "./is";

/**
 * 数据解耦后，再返回（深拷贝函数，JSON 方案）
 */
export function copyObj<T>(obj: T): T {
  return obj ? JSON.parse(JSON.stringify(obj)) : obj;
}

/**
 * 深拷贝函数，支持循环引用
 * @param obj 任意对象
 * @param hash WeakMap 用于处理循环引用
 */
export function deepClone<T>(obj: T, hash = new WeakMap()): T {
  // 处理 null、undefined 或基本数据类型
  if (obj === null || typeof obj !== "object") return obj;

  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 处理内置对象类型
  if (obj instanceof Date) return new Date(obj) as any;
  if (obj instanceof RegExp) return new RegExp(obj) as any;
  if (obj instanceof Map) {
    const result = new Map();
    hash.set(obj, result);
    obj.forEach((value, key) => {
      result.set(deepClone(key, hash), deepClone(value, hash));
    });
    return result as any;
  }
  if (obj instanceof Set) {
    const result = new Set();
    hash.set(obj, result);
    obj.forEach(value => {
      result.add(deepClone(value, hash));
    });
    return result as any;
  }

  // 处理 Buffer（Node.js 环境）
  if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(obj)) {
    return Buffer.from(obj) as any;
  }

  // 处理数组
  if (isArray(obj)) {
    const result: any[] = [];
    hash.set(obj, result);
    obj.forEach((item, index) => {
      result[index] = deepClone(item, hash);
    });
    return result as any;
  }

  // 处理普通对象
  if (isObject(obj)) {
    // 保持原型链
    const Constructor = obj.constructor;
    let clonedObj: any;

    // 尝试创建相同类型的对象
    if (Constructor === Object) clonedObj = {};
    else if (typeof Constructor === "function") {
      try {
        clonedObj = Object.create(Constructor.prototype);
      } catch {
        clonedObj = Object.create(Object.getPrototypeOf(obj));
      }
    } else clonedObj = Object.create(Object.getPrototypeOf(obj));

    hash.set(obj, clonedObj);

    // 复制所有可枚举属性（包括 Symbol 键）
    [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)].forEach(key => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone((obj as any)[key], hash);
      }
    });

    return clonedObj;
  }

  return obj;
}
/**
 * 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 */
export function get(model: Recordable, prop: string): any {
  if (!model || !isObject(model)) return undefined;
  if (!prop.includes(".")) return model[prop];

  return prop.split(".").reduce((acc: any, key: string) => {
    if (acc === undefined || acc === null) return undefined;
    return acc[key];
  }, model);
}

/**
 * 处理 prop 为多级嵌套的情况，给指定 key 赋值 (列如: prop: user.name)
 */
export function set(model: Recordable, prop: string, value: any): boolean {
  if (!model || !isObject(model)) return false;

  const props = prop.split(".");
  let current = model;

  for (let i = 0; i < props.length - 1; i++) {
    const key = props[i];

    // 如果路径中的某个属性不是对象且不是最后一个属性，则无法继续深入
    if (current[key] !== undefined && !isObject(current[key])) {
      // 如果不是最后一个属性，不能继续
      if (i < props.length - 1) return false;
      // 如果是最后一个属性，允许覆盖它
      break;
    }

    // 创建缺失的中间对象
    if (!current[key]) current[key] = {};

    current = current[key];
  }

  current[props[props.length - 1]] = value;
  return true;
}

/**
 * 数组对象去重
 * @param arr 对象数组
 * @param removeKeys 参与去重的 key
 * @param keyIsAndOr and: 所有 key 都重复才去重；or: 任意 key 重复就去重
 */
export function removeDuplicateObj<T extends Recordable>(
  arr: T[],
  removeKeys: string[],
  keyIsAndOr: "and" | "or" = "and"
): T[] {
  if (!isArray(arr)) {
    console.error("Input is not an array");
    return [];
  }

  if (!arr.length || !removeKeys.length) return arr;

  try {
    return arr.reduce((itemArr: T[], next: T) => {
      const isSame = itemArr.find((item: T) => {
        if (keyIsAndOr === "and") {
          return removeKeys.every(key => item[key] === next[key]);
        } else {
          return removeKeys.some(key => item[key] === next[key]);
        }
      });

      if (!isSame) itemArr.push(next);
      return itemArr;
    }, []);
  } catch (error) {
    console.error("Error during removing duplicate objects:", error);
    return [...arr]; // 返回原数组的副本
  }
}

/**
 * 判断两个对象是否相同（浅/深比较）
 */
export function isObjectValueEqual(a: Recordable, b: Recordable) {
  if (!a || !b) return false;
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  if (aProps.length !== bProps.length) return false;

  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];
    const propA = a[propName];
    const propB = b[propName];

    if (!(propName in b)) return false;
    if (propA instanceof Object) {
      if (!isObjectValueEqual(propA, propB)) return false;
    } else if (propA !== propB) return false;
  }
  return true;
}
