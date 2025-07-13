<script setup lang="ts">
import type { DialogProps } from "element-plus";
import type { ProDialogEmits, ProDialogProps } from "./types";
import { nextTick, ref, watch, computed, useTemplateRef } from "vue";
import { ElDialog, ElScrollbar, ElButton } from "element-plus";
import { addUnit } from "@/common/utils";
import { useNamespace } from "@/composables";
import { Icon } from "@/components/core/icon";

defineOptions({ name: "ProDialog" });

const ns = useNamespace("pro-dialog");

const props = withDefaults(defineProps<ProDialogProps>(), {
  title: "弹框",
  fullscreen: false,
  fullscreenIcon: true,
  height: 400,
  heightOffsetInFullscreen: 0,
  showFooter: true,
  footerAlign: "right",
  confirmLoading: false,
  confirmText: "确认",
  cancelText: "关闭",
});

const emits = defineEmits<ProDialogEmits>();

const dialogVisible = defineModel<boolean>({ default: false });

const dialogHeight = ref(addUnit(props.height));
const isFullscreen = ref(props.fullscreen);
const elDialogInstance = useTemplateRef<DialogProps>("elDialogInstance");

const footerStyle = computed(() => ({
  justifyContent: props.footerAlign === "left" ? "flex-start" : props.footerAlign === "center" ? "center" : "flex-end",
}));

/**
 * 切换全屏
 */
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  emits("fullscreen", isFullscreen.value);
};

watch(
  isFullscreen,
  async (val: boolean) => {
    await nextTick();
    if (val) {
      const windowHeight = document.documentElement.offsetHeight;
      // 弹框整体 padding 上下各 16，头部高度 47，内容区整体 padding 上下各 25，底部存在时高度 52
      dialogHeight.value = `${windowHeight - 32 - 47 - 50 - (props.showFooter ? 52 : 0) - props.heightOffsetInFullscreen}px`;
    } else dialogHeight.value = addUnit(props.height);
  },
  { immediate: true }
);

/**
 * 确认按钮点击事件
 */
const handleConfirm = () => emits("confirm");

/**
 * 关闭按钮点击事件
 */
const handleCancel = () => {
  emits("cancel");
  close();
};

/**
 * 打开弹窗
 */
const open = () => (dialogVisible.value = true);
/**
 * 关闭弹窗
 */
const close = () => (dialogVisible.value = false);

defineExpose({ elDialogInstance, handleConfirm, handleCancel, open, close });
</script>

<template>
  <el-dialog
    ref="elDialogInstance"
    v-model="dialogVisible"
    :title="title"
    :fullscreen="isFullscreen"
    top="10vh"
    width="50%"
    draggable
    :close-on-click-modal="false"
    v-bind="$attrs"
    :class="ns.b()"
  >
    <template #header="scope">
      <slot name="header" v-bind="scope">
        <div style="display: flex">
          <slot name="header-title">
            <span :class="`${ns.elNamespace}-dialog__title`" style="flex: 1">{{ title }}</span>
          </slot>

          <slot name="fullscreen-icon" v-bind="{ isFullscreen, toggleFullscreen }">
            <!-- 全屏图标 -->
            <Icon
              v-if="fullscreenIcon"
              :icon="isFullscreen ? 'core-fullscreen-exit' : 'core-fullscreen'"
              @click="toggleFullscreen"
              :size="15"
              :color="ns.cssVarEl('color-info')"
              hover
              :hover-color="ns.cssVarEl('color-primary')"
              :style="{ cursor: 'pointer', userSelect: 'none' }"
              class="fullscreen-icon"
            />
          </slot>
        </div>
      </slot>
    </template>

    <el-scrollbar :height="dialogHeight" :max-height>
      <slot />
    </el-scrollbar>

    <slot name="footer-top" />

    <template v-if="showFooter" #footer>
      <div :class="ns.e('footer')" :style="footerStyle">
        <slot name="footer" v-bind="{ handleConfirm, handleCancel }">
          <el-button @click="handleCancel()">{{ cancelText }}</el-button>
          <el-button type="primary" :loading="confirmLoading" @click="handleConfirm()">{{ confirmText }}</el-button>
        </slot>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
