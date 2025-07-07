export interface DragDrawerProps {
  /** 抽屉打开位置 */
  placement?: string;
  /** 是否开启拖拽功能 */
  draggable?: boolean;
  /** 抽屉最小宽度 */
  minWidth?: number;
  /** 抽屉最大宽度 */
  maxWidth?: number | "auto";
  /** 是否在容器内使用抽屉 */
  inner?: boolean;
}

export type DragDrawerEmits = {
  /** 拖拽启动事件 */
  onResizeStart: [];
  /** 拖拽过程事件 */
  onResize: [event: MouseEvent];
  /** 拖拽结束事件 */
  onResizeEnd: [];
};
