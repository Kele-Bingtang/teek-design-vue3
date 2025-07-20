<script setup lang="ts">
import type { ImageViewerProps } from "element-plus";
import { computed } from "vue";
import { ElImageViewer, ElConfigProvider } from "element-plus";
import { useNamespace } from "@/composables";
import { useLayoutStore } from "@/pinia";

defineOptions({ name: "ImageViewer" });

const props = withDefaults(defineProps<Partial<ImageViewerProps>>(), {
  urlList: (): string[] => [],
  zIndex: 2000,
  initialIndex: 0,
  infinite: true,
  hideOnClickModal: false,
  teleported: false,
  zoomRate: 1.2,
  minScale: 0.2,
  maxScale: 0.2,
  closeOnPressEscape: true,
  showProgress: false,
});

const ns = useNamespace();

const layoutSize = computed(() => useLayoutStore().layoutSize);

const visible = defineModel({ default: false });

const imageViewProps = computed(() => {
  const newProps: any = { ...props };

  // 需要手动删除这两个属性，否则控制台有警告
  delete newProps.modelValue;
  delete newProps.modelModifiers;

  return newProps;
});

const close = () => {
  const imageViewerDom = document.querySelector(`.${ns.joinEl("image-viewer__wrapper")}`);
  if (imageViewerDom) {
    // 添加 Element Plus 内置的 ImageViewer 离开动画
    imageViewerDom.classList.add("viewer-fade-leave-active");
    imageViewerDom.classList.add("viewer-fade-leave-to");

    setTimeout(() => {
      visible.value = false;
    }, 300);
  } else visible.value = false;
};

defineExpose({ close });
</script>

<template>
  <ElConfigProvider :namespace="ns.elNamespace" :size="layoutSize">
    <ElImageViewer v-if="visible" v-bind="imageViewProps" @close="close" />
  </ElConfigProvider>
</template>
