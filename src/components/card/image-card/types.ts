export interface ImageCardProps {
  /** 图片地址 */
  imageUrl: string;
  /** 标题 */
  title: string;
  /** 分类 */
  category?: string;
  /** 阅读时间 */
  readTime?: string;
  /** 浏览量 */
  views?: number;
  /** 评论数 */
  comments?: number;
  /** 日期 */
  date?: string;
}

export interface ImageCardEmits {
  click: [card: ImageCardProps];
}
