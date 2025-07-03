/**
 * 颜色工具函数
 * 支持 hex/rgb/rgba 互转、加深/变浅、混合、hex转rgba
 * 类型安全，支持 3 位 hex，支持 rgb/rgba 字符串解析
 */

/**
 * hex 颜色转 rgb 数组
 *
 * @param hex 颜色值字符串（支持 #fff/#ffffff）
 */
export function hexToRgb(hex: string): [number, number, number] | null {
  let cleanHex = hex.trim().replace(/^#/, "");

  if (!/^([\da-fA-F]{3}|[\da-fA-F]{6})$/.test(cleanHex)) {
    console.error("输入错误的 hex");
    return null;
  }

  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map(x => x + x)
      .join("");
  }

  const rgb = cleanHex.match(/.{2}/g)!.map(x => parseInt(x, 16));
  return [rgb[0], rgb[1], rgb[2]];
}

/**
 * rgb 数组转 hex 颜色
 *
 * @param r 红色 0-255
 * @param g 绿色 0-255
 * @param b 蓝色 0-255
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const h = n.toString(16);
    return h.length === 1 ? "0" + h : h;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * 解析 rgb/rgba 字符串为 rgb 数组
 *
 * @param color rgb/rgba 字符串
 */
export function parseRgbString(color: string): [number, number, number, number?] | null {
  const rgbReg = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
  const rgbaReg = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/i;
  let match = color.match(rgbReg);

  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  }

  match = color.match(rgbaReg);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseFloat(match[4])];
  }

  return null;
}

/**
 * 加深颜色值
 *
 * @param color 颜色值字符串（hex/rgb/rgba）
 * @param level 加深的程度，限 0-1 之间
 */
export function getDarkColor(color: string, level: number): string | null {
  let rgb: [number, number, number] | null = null;

  if (color.startsWith("#")) {
    rgb = hexToRgb(color);
  } else if (color.startsWith("rgb")) {
    const arr = parseRgbString(color);
    if (arr) rgb = [arr[0], arr[1], arr[2]];
  }

  if (!rgb) {
    console.error("输入错误的颜色值");
    return null;
  }

  const res = rgb.map(v => Math.round(20.5 * level + v * (1 - level)));
  return rgbToHex(res[0], res[1], res[2]);
}

/**
 * 变浅颜色值
 *
 * @param color 颜色值字符串（hex/rgb/rgba）
 * @param level 变浅的程度，限 0-1 之间
 */
export function getLightColor(color: string, level: number): string | null {
  let rgb: [number, number, number] | null = null;

  if (color.startsWith("#")) {
    rgb = hexToRgb(color);
  } else if (color.startsWith("rgb")) {
    const arr = parseRgbString(color);
    if (arr) rgb = [arr[0], arr[1], arr[2]];
  }

  if (!rgb) {
    console.error("输入错误的颜色值");
    return null;
  }

  const res = rgb.map(v => Math.round(255 * level + v * (1 - level)));
  return rgbToHex(res[0], res[1], res[2]);
}

/**
 * 混合两种颜色
 *
 * @param c1 颜色 1（hex）
 * @param c2 颜色 2（hex）
 * @param ratio 混合比例 0-1
 */
export function colorBlend(c1: string, c2: string, ratio: number): string | null {
  const rgb1 = hexToRgb(c1);
  const rgb2 = hexToRgb(c2);

  if (!rgb1 || !rgb2) return null;

  const r = Math.round(rgb1[0] * (1 - ratio) + rgb2[0] * ratio);
  const g = Math.round(rgb1[1] * (1 - ratio) + rgb2[1] * ratio);
  const b = Math.round(rgb1[2] * (1 - ratio) + rgb2[2] * ratio);

  return rgbToHex(r, g, b);
}

/**
 * hex 颜色转 rgba 字符串
 *
 * @param hex 颜色值字符串（支持 #fff/#ffffff）
 * @param opacity 透明度 0-1
 * @returns { red, green, blue, rgba }
 */
export function hexToRgba(
  hex: string,
  opacity: number
): { red: number; green: number; blue: number; rgba: string } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const validOpacity = Math.max(0, Math.min(1, opacity));
  const rgba = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${validOpacity.toFixed(2)})`;
  return { red: rgb[0], green: rgb[1], blue: rgb[2], rgba };
}
