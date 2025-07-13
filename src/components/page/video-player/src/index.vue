<script setup lang="ts">
import type { PlayerProps } from "./types";
import { ref, onMounted, watch, onBeforeUnmount, nextTick, useTemplateRef } from "vue";
import Player from "xgplayer";

import "xgplayer/dist/index.min.css";

defineOptions({ name: "VideoPlayer" });

const props = withDefaults(defineProps<PlayerProps>(), {
  poster: "",
});

const playerRef = ref<Player>();

const videoInstance = useTemplateRef("videoInstance");

/**
 * 初始化播放器
 */
const intiPlayer = () => {
  if (!videoInstance.value) return;
  new Player({
    autoplay: false,
    ...props,
    el: videoInstance.value,
  });
};

onMounted(() => {
  intiPlayer();
});

watch(
  () => props,
  async newProps => {
    await nextTick();
    if (newProps) {
      playerRef.value?.setConfig(newProps);
    }
  },
  {
    deep: true,
  }
);

onBeforeUnmount(() => {
  playerRef.value?.destroy();
});

defineExpose({
  playerExpose: () => playerRef.value,
});
</script>

<template>
  <div ref="videoInstance"></div>
</template>
