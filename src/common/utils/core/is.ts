/**
 * 是否是有效的 URL
 */
export const isValidURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 判断数据类型
 * @param {Any} val 需要判断类型的数据
 * @return string
 */
export const isType = (val: any) => {
  if (val === null) return "null";
  if (typeof val !== "object") return typeof val;
  else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
};

/**
 * 判断值是否未某个类型
 */
export const is = (val: unknown, type: string) => {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
};

/**
 * 是否为纯粹的函数
 */
export const isPlainFunction = <T = Function>(val: unknown): val is T => {
  return is(val, "Function");
};

/**
 * 是否为函数
 */
export const isFunction = <T = Function>(val: unknown): val is T => {
  return is(val, "Function") || isAsyncFunction(val);
};

/**
 * 是否已定义
 */
export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== "undefined";
};

/**
 * 是否为未定义
 */
export const isUnDef = <T = unknown>(val?: T): val is T => {
  return !isDef(val);
};

/**
 * 是否为对象
 */
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, "Object");
};

/**
 * 是否为时间
 */
export const isDate = (val: unknown): val is Date => {
  return is(val, "Date");
};

/**
 * 是否是有效的数字（包含正负整数，0 以及正负浮点数）
 */
export const isNumber = (val: unknown): val is number => {
  const regPos = /^\d+(\.\d+)?$/; // 非负浮点数
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
  if (regPos.test(val as string) || regNeg.test(val as string)) {
    return true;
  } else {
    return false;
  }
};

/**
 * 是否为字符串数字
 */
export const isStringNumber = (val: string): boolean => {
  if (!isString(val)) return false;
  return !Number.isNaN(Number(val));
};

/**
 *  是否为 AsyncFunction
 */
export const isAsyncFunction = <T = any>(val: unknown): val is Promise<T> => {
  return is(val, "AsyncFunction");
};

/**
 *  是否为 promise
 */
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return is(val, "Promise") && isObject(val) && isFunction(val.then) && isFunction(val.catch);
};

/**
 *  是否为字符串
 */
export const isString = (val: unknown): val is string => {
  return is(val, "String");
};

/**
 *  是否为boolean类型
 */
export const isBoolean = (val: unknown): val is boolean => {
  return is(val, "Boolean");
};

/**
 * 是否为数组
 */
export const isArray = (val: unknown): val is any[] => {
  if (typeof Array.isArray === "undefined") {
    return Object.prototype.toString.call(val) === "[object Array]";
  }
  return Array.isArray(val);
};

/**
 * 是否客户端
 */
export const isClient = typeof window !== "undefined" && typeof document !== "undefined";

/**
 * 是否为服务器
 */
export const isServer = !isClient;
/**
 * 是否在浏览器中
 */
export const inBrowser = isClient;

/**
 * 是否为元素节点
 */
export const isElement = (val: unknown): val is Element => {
  if (typeof Element === "undefined") return false;
  return val instanceof Element;
};

// 是否为图片节点
export const isImageDom = (o: Element) => {
  return o && ["IMAGE", "IMG"].includes(o.tagName);
};

/**
 * 是否为 null
 */
export const isNull = (val: unknown): val is null => {
  return val === null;
};

/**
 * 是否为 null 且未定义
 */
export const isNullAndUnDef = (val: unknown): val is null | undefined => {
  return isUnDef(val) && isNull(val);
};

/**
 * 是否为 null 或未定义
 */
export const isNullOrUnDef = (val: unknown): val is null | undefined => {
  return isUnDef(val) || isNull(val);
};

/**
 * 是否为手机号
 */
export const isPhone = (val: string) => {
  return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val);
};

/**
 * 是否是图片链接
 */
export const isImgPath = (path: string): boolean => {
  return /(https?:\/\/|data:image\/).*?\.(png|jpg|jpeg|gif|svg|webp|ico)/gi.test(path);
};

export const isIOS = () => {
  return (
    isClient &&
    window?.navigator?.userAgent &&
    (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) ||
      (window?.navigator?.maxTouchPoints > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent)))
  );
};

/**
 * 是否为空值项（包含数组、对象判断）
 *
 * @param checkComplexType 是否检查数组、对象是否为空
 */
export const isEmpty = (val: unknown, checkComplexType = true): boolean => {
  // NaN 的检查
  if (isNumber(val) && isNaN(val)) return true;

  // 检查空字符串、null 和 undefined
  if (val === "" || val === null || val === undefined) return true;

  if (!checkComplexType) return false;

  // 检查是不是数组并且长度为 0
  if (isArray(val) && !val.length) return true;

  // 检查是不是对象并且自身 key 和 value 都为空
  if (isObject(val)) {
    if (!Object.keys(val).length) return true;
    if (Object.values(val).every(item => isEmpty(item, checkComplexType))) return true;
  }

  // 如果以上都不是，则不为空
  return false;
};

/**
 * 确定目标元素是否可聚焦
 *
 * @param element HTML 元素
 */
export const isFocusable = (element: HTMLElement): boolean => {
  if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute("tabIndex") !== null)) {
    return true;
  }
  if (element.tabIndex < 0 || element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true") {
    return false;
  }

  switch (element.nodeName) {
    case "A": {
      // casting current element to Specific HTMLElement in order to be more type precise
      return !!(element as HTMLAnchorElement).href && (element as HTMLAnchorElement).rel !== "ignore";
    }
    case "INPUT": {
      return !((element as HTMLInputElement).type === "hidden" || (element as HTMLInputElement).type === "file");
    }
    case "BUTTON":
    case "SELECT":
    case "TEXTAREA": {
      return true;
    }
    default: {
      return false;
    }
  }
};
