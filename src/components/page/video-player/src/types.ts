export interface PlayerProps {
  url: string;
  poster?: string;
}

export interface VideoPlayerViewerProps {
  /** 是否打开视频播放器预览 */
  modelValue?: boolean;
  /** 视频链接 */
  url?: string;
  /** 视频预览图片 */
  poster?: string;
  /** 预览容器 id */
  id?: string;
}
