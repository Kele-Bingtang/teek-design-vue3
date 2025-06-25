/**
 * hex 颜色转 rgb 颜色
 *
 * @param str 颜色值字符串
 */
export const hexToRgb = (str: any) => {
  let hex: any = "";
  const reg = /^\#?[0-9A-Fa-f]{6}$/;

  if (!reg.test(str)) return console.error("输入错误的 hex");

  str = str.replace("#", "");
  hex = str.match(/../g);
  for (let i = 0; i < 3; i++) hex[i] = parseInt(hex[i], 16);

  return hex;
};

/**
 * rgb 颜色转 Hex 颜色
 *
 * @param r 代表红色
 * @param g 代表绿色
 * @param b 代表蓝色
 */
export const rgbToHex = (r: any, g: any, b: any) => {
  const reg = /^\d{1,3}$/;

  if (!reg.test(r) || !reg.test(g) || !reg.test(b)) return console.error("输入错误的 rgb 颜色值");

  const hex = [r.toString(16), g.toString(16), b.toString(16)];
  for (let i = 0; i < 3; i++) if (hex[i].length === 1) hex[i] = `0${hex[i]}`;

  return `#${hex.join("")}`;
};

/**
 * 加深颜色值
 *
 * @param color 颜色值字符串
 * @param level 加深的程度，限 0-1 之间
 */
export const getDarkColor = (color: string, level: number) => {
  const reg = /^\#?[0-9A-Fa-f]{6}$/;

  if (!reg.test(color)) return console.error("输入错误的 hex 颜色值");

  const rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++) rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level));

  return rgbToHex(rgb[0], rgb[1], rgb[2]);
};

/**
 * 变浅颜色值
 *
 * @param color 颜色值字符串
 * @param level 加深的程度，限 0-1 之间
 */
export const getLightColor = (color: string, level: number) => {
  const reg = /^\#?[0-9A-Fa-f]{6}$/;

  if (!reg.test(color)) return console.error("输入错误的 hex 颜色值");

  const rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++) rgb[i] = Math.round(255 * level + rgb[i] * (1 - level));

  return rgbToHex(rgb[0], rgb[1], rgb[2]);
};

export const colorBlend = (c1: string, c2: string, ratio: any) => {
  ratio = Math.max(Math.min(Number(ratio), 1), 0);
  const r1 = parseInt(c1.substring(1, 3), 16);
  const g1 = parseInt(c1.substring(3, 5), 16);
  const b1 = parseInt(c1.substring(5, 7), 16);
  const r2 = parseInt(c2.substring(1, 3), 16);
  const g2 = parseInt(c2.substring(3, 5), 16);
  const b2 = parseInt(c2.substring(5, 7), 16);

  let r: any = Math.round(r1 * (1 - ratio) + r2 * ratio);
  let g: any = Math.round(g1 * (1 - ratio) + g2 * ratio);
  let b: any = Math.round(b1 * (1 - ratio) + b2 * ratio);

  r = ("0" + (r || 0).toString(16)).slice(-2);
  g = ("0" + (g || 0).toString(16)).slice(-2);
  b = ("0" + (b || 0).toString(16)).slice(-2);

  return "#" + r + g + b;
};

export function hexToRgba(hex: string, opacity: number) {
  const reg = /^\#?[0-9A-Fa-f]{6}$/;

  if (!reg.test(hex)) throw new Error("输入错误的 hex");

  // 移除可能存在的 # 前缀并转换为大写
  let cleanHex = hex.trim().replace(/^#/, "").toUpperCase();

  // 如果是缩写形式（如 FFF），转换为完整形式
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map(char => char.repeat(2))
      .join("");
  }

  // 解析 RGB 值
  const [red, green, blue] = cleanHex.match(/\w\w/g)!.map(x => parseInt(x, 16));

  // 确保 opacity 在有效范围内
  const validOpacity = Math.max(0, Math.min(1, opacity));

  // 构建 RGBA 字符串
  const rgba = `rgba(${red}, ${green}, ${blue}, ${validOpacity.toFixed(2)})`;

  return { red, green, blue, rgba };
}
