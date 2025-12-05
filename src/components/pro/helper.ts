import type { Reactive, Ref, ComputedRef } from "vue";
import type { FormItemColumnProps } from "./form-item";
import type { TableColumn } from "./table";
import { isRef, isProxy, unref } from "vue";
import { isArray, isEmpty, isFunction, isObject, isPromise } from "@/common/utils";

// ============================== 超级组件公共工具类 ==============================

/**
 * 处理 prop，当 prop 为多级嵌套时，返回最后一级 prop
 *
 * @param prop 当前 prop
 */
export const lastProp = (prop: string) => {
  if (!prop) return prop;

  const propArr = prop.split(".");
  if (propArr.length === 1) return prop;
  return propArr[propArr.length - 1];
};

/**
 * 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 */
export const getProp = (
  model: Recordable,
  prop: NonNullable<FormItemColumnProps["prop"]>,
  valueFormat?: FormItemColumnProps["valueFormat"]
) => {
  if (!isObject(model)) return model;

  let value: any;
  if (!prop.includes(".")) value = model[prop];
  else {
    const newModel = prop.split(".").reduce((acc: any, key: string) => {
      if (acc === undefined || acc === null) return undefined;
      return acc[key];
    }, model);

    // 如果是 ElInputNumber，则需要返回数字类型，因此这里 form 如果为 ""，则返回 undefined，这样字符串和数字类型的组件都支持
    value = newModel || undefined;
  }

  // 格式化 value 值
  if (!valueFormat) return value;
  if (isFunction(valueFormat)) return valueFormat(value);
  if (valueFormat === "string" && !isEmpty(value)) return value + "";
  if (valueFormat === "number" && !isEmpty(value)) return Number(value);
  if (valueFormat === "boolean" && !isEmpty(value)) {
    if ((value as string) === "0" || (value as number) === 0) return false;
    else return false;
  }
  return value;
};

/**
 * 对 model 对象的 pro 赋值
 */
export const setProp = (model: Recordable, prop: NonNullable<FormItemColumnProps["prop"]>, value: unknown) => {
  if (!model) return;

  const props = prop.split(".");
  let current = model as any;

  for (let i = 0; i < props.length - 1; i++) {
    const prop = props[i];
    // 如果路径中的某个属性不是对象且不是最后一个属性，则无法继续深入
    if (current[prop] !== undefined && !isObject(current[prop])) {
      // 如果不是最后一个属性，不能继续
      if (i < props.length - 1) return false;
      // 如果是最后一个属性，允许覆盖它
      break;
    }

    if (!current[prop]) current[prop] = {};
    current = current[prop];
  }
  current[props[props.length - 1]] = value;
  return true;
};

/**
 * 删除对象中的属性，包括嵌套属性
 *
 * @param obj 对象
 * @param prop 对象的key
 */
export const deleteProp = (obj: Recordable, propPath: string): boolean => {
  if (!propPath || !isObject(obj)) return false;

  const keys = propPath.split(".");
  const lastKey = keys.pop();

  if (!lastKey) return false; // 路径为空或无效

  let current: any = obj;

  for (const key of keys) {
    if (current[key] === undefined) return false;
    current = current[key];
  }

  if (current[lastKey] !== undefined) {
    delete current[lastKey];
    return true;
  }

  return false;
};

/**
 * 将连字符转换为大驼峰格式
 */
export const toCamelCase = (val?: string) => {
  const separator = "-";
  // 如果字符串中不包含连字符，直接返回
  if (!val) return "";
  if (!val.includes(separator)) return val.charAt(0).toUpperCase() + val.slice(1);

  return val
    .split(separator)
    .map(word => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
    .join("");
};

/**
 * 格式化值
 */
export const formatValue = async <T = any>(
  value: T | Promise<T> | Ref<T> | Reactive<T> | ComputedRef<T> | ((...arg: any) => Promise<T>),
  params: Recordable = {},
  processRef = true
): Promise<any> => {
  if (value === undefined) return value;

  if (isRef(value)) {
    if (processRef) return unref(value);
    return value;
  }
  if (isProxy(value)) return value;
  if (isObject(value)) return { ...value };
  if (isFunction(value)) return await (value as any)(params);
  if (isPromise(value)) return await value;

  return value;
};

/**
 * 根据枚举列表查询当需要的数据（如果指定了 value 的 key 值，会自动识别格式化）
 */
export const filterOptions = (
  modelValue: unknown,
  options: Recordable[],
  optionField?: FormItemColumnProps["optionField"]
) => {
  const value = optionField?.value ?? "value";
  const children = optionField?.children ?? "children";
  const filterOptions: Recordable[] = [];
  let filterOption: Recordable = {};

  // 判断 options 是否为数组
  if (isArray(modelValue)) {
    modelValue.forEach(item => {
      const data = findItemNested(item, options, value, children);
      data && filterOptions.push(data);
    });
  } else filterOption = findItemNested(modelValue, options, value, children) || {};

  return filterOptions.length ? filterOptions : filterOption || "";
};

/**
 * 递归查找 callValue 对应的 options 值
 */
export const findItemNested = (
  modelValue: unknown,
  options: Recordable[],
  value: string,
  children: string
): Recordable | null => {
  return options.reduce<Recordable | null>((accumulator, current) => {
    if (accumulator) return accumulator;
    // 兼容数字和字符串数字匹配，如值为数字 0，字典是 '0'，依然满足条件
    if (current[value] === modelValue || current[value] === modelValue + "") return current;
    if (current[children]) return findItemNested(modelValue, current[children], value, children);
    return null;
  }, null);
};

/**
 * 根据枚举列表查询当需要的 label 数据
 */
export const filterOptionsValue = (options: Recordable | Recordable[], keyName = "label", defaultValue = "--") => {
  if (!isArray(options)) return options ? (options[keyName] ?? defaultValue) : defaultValue;

  const filterDataArray: string[] = [];
  options.forEach(item => filterDataArray.push(item[keyName]));
  return filterDataArray;
};

/**
 * 获取对象中所有叶子节点的路径（多级路径用 . 拼接）
 *
 * 假设 假设 model 为 { user: { age: {name: ""} }, menu: "" }，如果获取为 ["user.age.name", "menu"]
 *
 * @param model 要遍历的对象
 * @param prefix 当前路径前缀
 */
export const getObjectKeys = (model: Recordable, prefix = ""): string[] => {
  return Object.keys(model).reduce((acc: string[], key: string) => {
    const value = model[key];
    const path = prefix ? `${prefix}.${key}` : key;

    // 如果是对象，继续递归
    if (isObject(value)) acc.push(...getObjectKeys(value, path));
    else acc.push(path); // 如果是基本类型或数组，视为叶子节点

    return acc;
  }, []);
};

/**
 * 过滤对象中为空值的属性
 *
 * @param obj 需要处理的对象
 */
export const filterEmpty = <T extends Recordable>(obj: T) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    // 支持响应式变量
    const valueConst = unref(value);
    if (!isEmpty(valueConst)) {
      if (isObject(valueConst) && Object.keys(valueConst).length) {
        // 如果是嵌套对象，递归处理
        const nestedFiltered = filterEmpty(unref(valueConst));
        if (Object.keys(nestedFiltered).length) acc[key as keyof T] = nestedFiltered as T[keyof T];
      } else acc[key as keyof T] = valueConst;
    }
    return acc;
  }, {} as T);
};

/**
 * 扁平化 columns
 *
 * @param columns 列配置
 * @param flatArr 扁平化后的列配置
 */
export const flatColumnsFn = <T extends Recordable = TableColumn>(
  columns: T[],
  flatArr: T[] = [],
  key = "children"
) => {
  columns.forEach(col => {
    if (col[key]?.length) flatArr.push(...flatColumnsFn(col[key], [], key));
    flatArr.push(col);
  });

  return flatArr.filter(item => !item[key]?.length);
};
