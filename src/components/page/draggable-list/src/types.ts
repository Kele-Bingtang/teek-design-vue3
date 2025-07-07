export interface DraggableListProps {
  /** 左侧数据 */
  leftList?: DragList[];
  /** 右侧数据 */
  rightList?: DragList[];
  /** 左侧标题 */
  leftTitle?: string;
  /** 右侧标题 */
  rightTitle?: string;
  /** 左侧宽度 */
  leftWidth?: string;
  /** 右侧宽度 */
  rightWidth?: string;
  /** 拖拽元素 class */
  dragClass?: DragClass;
  /** 动画 */
  animation?: number;
}

export interface DragClass {
  left: string[];
  right: string[];
}

export interface DragList {
  id: string;
  name: string;
}

export interface DraggableListEmits {
  onChange: [value: { src: string; target: string; oldIndex: number; newIndex: number }];
  itemClick: [id: string, type: string];
}
