/**
 * 设置 css var 变量
 */
export const setCssVar = (key: string, value: string | number, el: any = document.documentElement) => {
  el.style.setProperty(key, value);
};

/**
 * 删除 css var 变量
 */
export const removeCssVar = (keys: string[], el: any = document.documentElement) => {
  keys.forEach(key => {
    el.style.removeProperty(key);
  });
};

/**
 * 获取 css var 值
 * @param prop 属性
 */
export const getCssVar = (prop: string, el: any = document.documentElement) => {
  return getComputedStyle(el).getPropertyValue(prop);
};
