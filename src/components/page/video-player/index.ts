import { createVNode, render, type VNode } from "vue";
import index from "./src/index.vue";
import VideoPlayerViewer, { type VideoPlayerViewerProps } from "./src/video-player-viewer.vue";
import { useSimpleUuid } from "@/common/utils";
import { useInstall } from "@/common/utils";

export const VideoPlayer = useInstall(index);

export default index;

export { VideoPlayerViewer };

let instance: VNode | null = null;

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
  instance = createVNode(VideoPlayerViewer, propsData);
  render(instance, container);
};
