<script setup lang="ts">
import { nextTick, ref, onMounted, computed, useTemplateRef } from "vue";
import { useRoute } from "vue-router";
import { useEventListener } from "@vueuse/core";
import { RefreshIFrameKey } from "@/common/config";
import { mittBus } from "@/common/utils";
import { useNamespace } from "@/composables";

defineOptions({ name: "IFrameView" });

interface IFrameViewProps {
  /**  iframe 地址 */
  iframeSrc?: string;
  /** iframe 名称 */
  iframeName?: string;
}

const props = withDefaults(defineProps<IFrameViewProps>(), {
  iframeSrc: "",
  iframeName: "",
});

const ns = useNamespace("iframe-view");
const route = useRoute();
const iframeInstance = useTemplateRef("iframeInstance");

const loading = ref(true);
const isRefresh = ref(true);

const iframeSrc = computed(() => props.iframeSrc || route.meta?.iframeSrc);

/**
 * 隐藏加载
 */
const hideLoading = () => (loading.value = false);

/**
 * 刷新 iframe
 */
mittBus.on(RefreshIFrameKey, async () => {
  if (route.name !== props.iframeName) return;

  isRefresh.value = false;
  await nextTick();
  isRefresh.value = true;
});

onMounted(() => {
  // 监听 iframe 加载完成
  if (route.meta?.iframeLoading !== false) useEventListener(iframeInstance, "load", hideLoading);
  else hideLoading();
});
</script>

<template>
  <div :class="ns.b()" v-loading="loading" element-loading-text="Loading ...">
    <iframe
      v-if="isRefresh"
      ref="iframeInstance"
      :src="iframeSrc"
      width="100%"
      height="100%"
      frameborder="0"
      :class="ns.e('iframe')"
    />
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(iframe-view) {
  width: 100%;
  height: 100%;
}
</style>
