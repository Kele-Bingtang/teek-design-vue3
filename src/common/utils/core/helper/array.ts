import { isArray } from "./is";

/**
 * 源数组是否包含目标数组的所有内容
 */
export function containsAll(source: string[], target: string[]) {
  if (!isArray(source) || !isArray(target)) return false;
  return target.every(v => source.includes(v));
}

/**
 * 源数组是否包含目标数组的某个内容
 */
export function containsAny(source: string[], target: string[]) {
  if (!isArray(source) || !isArray(target)) return false;
  const sourceSet = new Set(source);
  return target.some(v => sourceSet.has(v));
}
