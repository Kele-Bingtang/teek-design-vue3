export interface PointTagProps {
  /** 颜色 */
  color?: string;
  /** 主题，当传入 color 时，会覆盖主题 */
  type?: "primary" | "success" | "warning" | "danger" | "info" | "error" | "";
  /** 大小 */
  size?: number | string;
  /** 位置 */
  position?: "left" | "right";
  /** 偏移量 */
  offset?: number | string;
  /** 内容，可根据 position 配置调整位置 */
  text?: number | string;
}
