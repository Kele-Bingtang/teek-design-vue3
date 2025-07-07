import type { VideoPlayerViewerProps } from "./src/types";
import { createVNode, render } from "vue";
import { useSimpleUuid } from "@/common/utils";
import { useInstall } from "@/common/utils";
import index from "./src/index.vue";
import VideoPlayerViewer from "./src/video-player-viewer.vue";

export const VideoPlayer = useInstall(index);

export default index;

export type * from "./src/types";
export { VideoPlayerViewer };

/**
 * 创建视频播放器预览
 */
export const createVideoViewer = (options: { url: string; poster?: string; show?: boolean }) => {
  if (typeof window === "undefined") return;
  const { url, poster } = options;

  const propsData: Partial<VideoPlayerViewerProps> = {};
  const container = document.createElement("div");
  const id = useSimpleUuid();

  container.id = id;
  propsData.url = url;
  propsData.poster = poster;
  propsData.modelValue = true;
  propsData.id = id;

  document.body.appendChild(container);
  const instance = createVNode(VideoPlayerViewer, propsData);
  render(instance, container);
};
