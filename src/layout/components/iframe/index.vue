<script setup lang="ts">
import type { IFrame } from "./use-iframe";
import { watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useNamespace } from "@/composables";
import { useLayoutStore } from "@/pinia";
import IFrameView from "./iframe-view.vue";

defineOptions({ name: "IFrameLayout" });

const ns = useNamespace("iframe-container");
const route = useRoute();
const layoutStore = useLayoutStore();

const { iframeList } = storeToRefs(layoutStore);

/**
 * 判断是否是当前 iframe
 */
const isCurrentIFrame = (item: IFrame) => item.name === route.name;

/**
 * frame 是否已经缓存
 */
const isFrameCache = (name: string) => iframeList.value.some(item => item.name === name);
watch(
  () => route.fullPath,
  () => {
    const { name, meta: { iframeSrc, iframeKeepAlive } = {} } = route;

    if (!iframeSrc) return;

    const iframe: IFrame = {
      src: iframeSrc,
      name: name as string,
      show: true,
    };
    // 如果 iframe 没有缓存，则添加到 iframe 列表
    if (!isFrameCache(iframe.name) && iframeKeepAlive) layoutStore.addIFrame(iframe);
  },
  { immediate: true }
);
</script>

<template>
  <div :class="ns.b()" v-if="iframeList.length > 0">
    <template v-for="iframe in iframeList" :key="iframe.src">
      <IFrameView
        v-if="iframe.src"
        v-show="isCurrentIFrame(iframe)"
        :iframe-src="iframe.src"
        :iframe-name="iframe.name"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(iframe-container) {
  width: 100%;
  height: 100%;
}
</style>
