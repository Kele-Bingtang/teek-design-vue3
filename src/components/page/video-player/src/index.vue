<script setup lang="ts">
import Player from "xgplayer";
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from "vue";
import "xgplayer/dist/index.min.css";

defineOptions({ name: "VideoPlayer" });

export interface PlayerProps {
  url: string;
  poster?: string;
}

const props = withDefaults(defineProps<PlayerProps>(), {
  poster: "",
});

const playerRef = ref<Player>();

const videoRef = useTemplateRef("videoRef");

const intiPlayer = () => {
  if (!videoRef.value) return;
  new Player({
    autoplay: false,
    ...props,
    el: videoRef.value,
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
  <div ref="videoRef"></div>
</template>
