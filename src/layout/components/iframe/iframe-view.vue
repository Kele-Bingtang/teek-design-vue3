<script setup lang="ts">
import { nextTick, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { mittBus } from "@/common/utils";
import { useNamespace } from "@/composables";
import { useEventListener } from "@vueuse/core";
import { RefreshIFrameKey } from "@/common/config";

defineOptions({ name: "IFrameView" });

interface IFrameViewProps {
  iframeSrc?: string;
  iframeName?: string;
}

const props = withDefaults(defineProps<IFrameViewProps>(), {
  iframeSrc: "",
  iframeName: "",
});

const ns = useNamespace("iframe-view");
const route = useRoute();
const iframeRef = useTemplateRef("iframeRef");

const loading = ref(true);

const iframeSrc = computed(() => props.iframeSrc || route.meta?.iframeSrc);

const hideLoading = () => {
  loading.value = false;
};

const isRefresh = ref(true);

mittBus.on(RefreshIFrameKey, async () => {
  if (route.name !== props.iframeName) return;

  isRefresh.value = false;
  await nextTick();
  isRefresh.value = true;
});

onMounted(() => {
  if (route.meta?.iframeLoading !== false) useEventListener(iframeRef, "load", hideLoading);
  else hideLoading();
});
</script>

<template>
  <div :class="ns.b()" v-loading="loading" element-loading-text="Loading ...">
    <iframe
      v-if="isRefresh"
      ref="iframeRef"
      :src="iframeSrc"
      width="100%"
      height="100%"
      frameborder="0"
      :class="ns.e('iframe')"
    />
  </div>
</template>
