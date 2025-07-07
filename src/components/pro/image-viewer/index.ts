import type { ImageViewerProps } from "element-plus";
import ImageViewer from "./src/index.vue";
import { createVNode, render } from "vue";
import { isClient } from "@/common/utils";

export type * from "./src/types";
export { ImageViewer };

export const createImageViewer = (options: Partial<ImageViewerProps>) => {
  if (!isClient) return;

  const container = document.createElement("div");

  document.body.appendChild(container);
  const instance = createVNode(ImageViewer, { ...options, modelValue: true });
  render(instance, container);
};
