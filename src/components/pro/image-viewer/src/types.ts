export interface ImageViewerProps {
  /**
   * 用于预览的图片链接列表
   */
  urlList?: string[];
  /**
   * 预览时遮罩层的 z-index
   */
  zIndex?: number;
  /**
   * 初始预览图像索引，小于 url-list 的长度
   *
   * @default 0
   */
  initialIndex?: number;
  /**
   * 是否可以无限循环预览
   *
   * @default true
   */
  infinite?: boolean;
  /**
   * 是否可以通过点击遮罩层关闭预览
   *
   * @default false
   */
  hideOnClickModal?: boolean;
  /**
   * image 自身是否插入至 body 元素上
   *
   * @default false
   */
  teleported?: boolean;
  modelValue?: boolean;
}
