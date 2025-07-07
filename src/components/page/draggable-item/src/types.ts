// 更多配置项请看 https://www.itxst.com/vue-draggable-next/tutorial.html
export interface DraggableItemProps {
  /** 标题 */
  title?: string;
  /** 数据列表 */
  list?: DragItemList[];
  /** 标题背景色 */
  titleBgColor?: string;
  /** 标题元素 class */
  titleClass?: string;
  /** 拖拽元素 class */
  dragClass?: string;
  /** 是否禁用拖拽 */
  disabled?: boolean;
  /** 动画 */
  animation?: number;
}

export interface DragItemList {
  id: string;
  name: string;
}
