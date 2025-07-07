<script setup lang="ts">
import type { VideoPlayerViewerProps } from "./types";
import { computed, nextTick } from "vue";
import { ElOverlay, ElConfigProvider } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import { useLayoutStore } from "@/pinia";
import { useNamespace } from "@/composables";
import { Icon } from "@/components";
import VideoPlayer from "./index.vue";
import { useEventListener } from "@vueuse/core";

defineOptions({ name: "VideoPlayerViewer" });

const ns = useNamespace("video-player-viewer");

const props = withDefaults(defineProps<VideoPlayerViewerProps>(), {
  modelValue: false,
  url: "",
  poster: "",
  id: "",
});

const layoutStore = useLayoutStore();

const layoutSize = computed(() => layoutStore.layoutSize);
const id = computed(() => props.id || useId());

const visible = defineModel({ default: false });

/**
 * 关闭视频播放器预览
 */
const close = async () => {
  visible.value = false;
  await nextTick();
  const wrap = document.getElementById(id.value);

  if (!wrap) return;
  document.body.removeChild(wrap);
};

/**
 * esc 按键关闭
 */
const handleEscClose = (event: KeyboardEvent) => {
  if (event.key === "Escape" && visible.value) close();
};

useEventListener("keydown", handleEscClose, { capture: true });
</script>

<template>
  <el-configProvider :namespace="ns.elNamespace" :size="layoutSize">
    <!-- viewer-fade 在 Element Plus 已经定义 -->
    <transition name="viewer-fade" appear>
      <el-overlay v-if="visible" :id="id">
        <div :class="[ns.b()]" @click.stop="close">
          <div :class="[ns.e('close')]" @click.stop="close">
            <Icon :icon="Close" :size="24" />
          </div>
          <VideoPlayer :url="url" :poster="poster" />
        </div>
      </el-overlay>
    </transition>
  </el-configProvider>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(video-player-viewer) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  @include e(close) {
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
    background: cssVarEl(text-color-regular);
    border: #ffffff;
    border-radius: 9999px;
  }

  :deep(video) {
    // 修复顶部出现白色线条问题
    top: 1px;
  }
}
</style>
