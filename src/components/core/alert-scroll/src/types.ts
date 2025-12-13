export interface AlertScrollProps {
  /**
   * 滚动文本内容
   */
  text?: string;
  /**
   * 类型
   *
   * @default 'primary'
   */
  type?: "primary" | "success" | "warning" | "danger" | "error" | "info" | "secondary";
  /**
   * 滚动方向
   *
   * @default 'left'
   */
  direction?: "left" | "right" | "up" | "down";
  /**
   * 滚动速度，单位：像素/秒
   *
   * @default 80
   */
  speed?: number;
  /**
   * 容器宽度
   *
   * @default '100%'
   */
  width?: string;
  /**
   * 容器高度
   *
   * @default '36px'
   */
  height?: string;
  /**
   * 鼠标悬停时是否暂停滚动
   *
   * @default true
   */
  pauseOnHover?: boolean;
  /**
   * 是否可以关闭
   *
   * @default false
   */
  closable?: boolean;
  /**
   * 是否显示类型图标
   *
   * @default false
   */
  showIcon?: boolean;
  /**
   * 始终滚动（即使文字未溢出）
   *
   * @default true
   */
  alwaysScroll?: boolean;
}
