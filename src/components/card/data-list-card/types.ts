export interface DataListCardProps {
  /** 数据列表 */
  list: Activity[];
  /** 标题 */
  title: string;
  /** 副标题 */
  subtitle?: string;
  /** 最大显示数量 */
  maxCount?: number;
  /** 是否显示更多按钮 */
  showMoreButton?: boolean;
}

export interface DataListCardEmits {
  more: [];
}

interface Activity {
  /** 标题 */
  title: string;
  /** 状态 */
  status: string;
  /** 时间 */
  time: string;
  /** 样式类名 */
  class: string;
  /** 图标 */
  icon: string;
}
