import { isNumber, isString, isStringNumber } from "./is";

/**
 * 添加单位，如 value 为 16，则返回 16px
 */
export const addUnit = (value?: string | number, defaultUnit = "px") => {
  if (value === undefined) return "";
  if (isNumber(value) || isStringNumber(value)) return `${value}${defaultUnit}`;
  else if (isString(value)) return value;
  return "";
};

/**
 * 移除单位，如 value 为 16px，则返回 16
 */
export const removeUnit = (value?: string | number, defaultUnit = "px") => {
  if (value === undefined) return;
  if (isNumber(value)) return value;
  if (isString(value)) return Number(value.replace(defaultUnit, ""));
  else return;
};

/**
 * 驼峰根据分隔符进行转换，如 userName 转 user-name
 */
export const camelCaseToHump = (str: string, separator: string = "-") => {
  return str.replace(/([A-Z])/g, `${separator}$1`).toLowerCase();
};

/**
 * 根据分隔符转驼峰，如 user-name 转 userName
 */
export const humpToCamelCase = (str: string, separator: string = "-") => {
  if (!str) return "";
  if (!str.includes(separator)) return str.charAt(0).toUpperCase() + str.slice(1);
  return str
    .split(separator)
    .map((word, index) =>
      //  第一个单词首字母小写，其余首字母大写
      index === 0 ? word.toLowerCase() : word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
    )
    .join("");
};
