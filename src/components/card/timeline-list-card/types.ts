export interface TimelineProps {
  /** 时间轴列表数据 */
  list: TimelineItem[];
  /** 标题 */
  title?: string;
  /** 副标题 */
  subtitle?: string;
  /** 最大显示数量 */
  maxCount?: number;
}

interface TimelineItem {
  /** 时间 */
  time: string;
  /** 状态颜色 */
  status: string;
  /** 内容 */
  content: string;
  /** 代码标识 */
  code?: string;
}
