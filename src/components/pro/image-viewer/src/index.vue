<script setup lang="ts">
import type { ImageViewerProps } from "element-plus";
import { ElImageViewer, ElConfigProvider } from "element-plus";
import { computed } from "vue";
import { useNamespace } from "@/composables";
import { useLayoutStore } from "@/stores";

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

const close = () => (visible.value = false);

defineExpose({ close });
</script>

<template>
  <ElConfigProvider :namespace="ns.elNamespace" :size="layoutSize">
    <ElImageViewer v-if="visible" v-bind="props" @close="close" />
  </ElConfigProvider>
</template>
