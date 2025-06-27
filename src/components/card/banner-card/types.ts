// 组件属性接口定义
export interface BannerCardProps {
  /** 横幅高度，默认 11rem */
  height?: string;
  /** 标题文本 */
  title?: string;
  /** 副标题文本 */
  subtitle?: string;
  /** 标题颜色，默认 #ffffff */
  titleColor?: string;
  /** 副标题颜色，默认 #ffffff */
  subtitleColor?: string;
  /** 背景颜色，默认 var(--${useNamespace().elNamespace}-color-primary-light-3) */
  backgroundColor?: string;
  /** 是否显示装饰效果，默认 true */
  decoration?: boolean;
  /** 按钮配置 */
  buttonConfig?: ButtonConfig;
  /** 流星配置 */
  meteorConfig?: MeteorConfig;
  /** 图片配置 */
  imageConfig?: ImageConfig;
}

export interface BannerCardEmits {
  click: []; // 整体点击事件
  buttonClick: []; // 按钮点击事件
}

// 流星对象接口定义
export interface Meteor {
  /** 流星的水平位置(百分比) */
  x: number;
  /** 流星划过的速度 */
  speed: number;
  /** 流星出现的延迟时间 */
  delay: number;
}

// 按钮配置接口定义
interface ButtonConfig {
  /** 是否启用按钮 */
  show: boolean;
  /** 按钮文本 */
  text: string;
  /** 按钮背景色 */
  color?: string;
  /** 按钮文字颜色 */
  textColor?: string;
  /** 按钮圆角大小 */
  radius?: string;
}

// 流星效果配置接口定义
interface MeteorConfig {
  /** 是否启用流星效果 */
  enabled: boolean;
  /** 流星数量 */
  count?: number;
}

// 背景图片配置接口定义
interface ImageConfig {
  /** 图片源地址 */
  src: string;
  /** 图片宽度 */
  width?: string;
  /** 距底部距离 */
  bottom?: string;
  /** 距右侧距离 */
  right?: string; // 距右侧距离
}
