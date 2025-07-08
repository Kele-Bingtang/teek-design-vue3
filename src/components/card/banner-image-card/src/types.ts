// 定义卡片横幅组件的属性接口
export interface CardBannerProps {
  /** 高度 */
  height?: string;
  /** 图片路径 */
  image?: string;
  /** 标题文本 */
  title?: string;
  /** 描述文本 */
  description?: string;
  /** 主按钮配置 */
  button?: {
    /** 是否显示 */
    show?: boolean;
    /** 按钮文本 */
    text?: string;
    /** 背景颜色 */
    color?: string;
    /** 文字颜色 */
    textColor?: string;
  };
  /** 取消按钮配置 */
  cancelButton?: {
    /** 是否显示 */
    show?: boolean;
    /** 按钮文本 */
    text?: string;
    /** 背景颜色 */
    color?: string;
    /** 文字颜色 */
    textColor?: string;
  };
}
