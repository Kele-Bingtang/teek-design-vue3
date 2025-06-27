<template>
  <el-configProvider :namespace="ns.elNamespace" :size="layoutSize">
    <el-overlay v-show="visible" @click="close">
      <div class="video-player-viewer" @click="close">
        <div class="video-player-viewer-close" @click="close">
          <Icon :icon="Close" :size="24" />
        </div>
        <VideoPlayer :url="url" :poster="poster" />
      </div>
    </el-overlay>
  </el-configProvider>
</template>

<script setup lang="ts">
import VideoPlayer from "./index.vue";
import { ElOverlay, ElConfigProvider } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import { computed, nextTick } from "vue";
import { Icon } from "@/components";
import { useNamespace } from "@/composables";
import { useLayoutStore } from "@/pinia";

defineOptions({ name: "VideoPlayerViewer" });

const ns = useNamespace();

export interface VideoPlayerViewerProps {
  modelValue?: boolean; // 是否打开视频播放器预览
  url?: string; // 视频链接
  poster?: string; // 视频预览图片
  id?: string; // 预览容器 id
}

const props = withDefaults(defineProps<VideoPlayerViewerProps>(), {
  modelValue: false,
  url: "",
  poster: "",
  id: "",
});

const layoutSize = computed(() => useLayoutStore().layoutSize);

const visible = defineModel({ default: false });

const close = async () => {
  visible.value = false;
  await nextTick();
  const wrap = document.getElementById(props.id);
  if (!wrap) return;
  document.body.removeChild(wrap);
};
</script>

<style lang="scss" scoped>
.video-player-viewer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .video-player-viewer-close {
    position: absolute;
    top: 40px;
    right: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    color: #ffffff;
    cursor: pointer;
    background: var(--#{$el-namespace}-text-color-regular);
    border: #ffffff;
    border-radius: 9999px;
  }
}
</style>
