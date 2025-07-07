import type { QRCodeRenderersOptions } from "qrcode";

export interface QrCodeProps {
  /** 二维码类型，默认 canvas */
  tag?: string;
  /** 二维码内容 */
  text?: string | Recordable[];
  /** 二维码配置 */
  options?: QRCodeRenderersOptions;
  /** 二维码宽度，默认 200 */
  width?: number;
  /** 二维码logo */
  logo?: QrCodeLogo | string;
  /** 二维码是否禁用，默认 false */
  disabled?: boolean;
  /** 二维码禁用文本 */
  disabledText?: string;
}

export interface QrCodeLogo {
  /** 二维码 logo 图片 */
  src?: string;
  /** 二维码 logo 大小，默认 0.15 */
  logoSize?: number;
  /** 二维码 logo 背景颜色，默认 #ffffff */
  bgColor?: string;
  /** 二维码 logo 边框圆角，默认 8 */
  borderRadius?: number;
  /** 二维码 logo 边框大小，默认 0.05 */
  borderSize?: number;
  /** 二维码 logo 边框圆角，默认 0 */
  logoRadius?: number;
  /** 二维码 logo 跨域 */
  crossOrigin?: string;
}

export interface QrCodeEmits {
  /** 二维码生成完成事件，返回二维码图片地址 */
  done: [url: string];
  /** 二维码点击事件，无参数 */
  click: [];
  /** 二维码禁用点击事件 */
  disabledClick: [];
}
