import type { ImageViewerProps } from "element-plus";
import type { VNode } from "vue";
import ImageViewer from "./src/index.vue";
import { createVNode, render } from "vue";
import { isClient } from "@/common/utils";

export type * from "./src/types";
export { ImageViewer };

let instance: VNode | null = null;

export const createImageViewer = (options: Partial<ImageViewerProps> & { show?: boolean; modelValue?: boolean }) => {
  if (!isClient) return;

  const container = document.createElement("div");

  document.body.appendChild(container);
  instance = createVNode(ImageViewer, options);
  render(instance, container);
};
