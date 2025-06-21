<script setup lang="ts">
import type { DialogProps } from "element-plus";
import type { ProDialogEmits, ProDialogProps } from "./types";
import { nextTick, ref, watch } from "vue";
import { ElDialog, ElScrollbar, ElButton } from "element-plus";
import { addUnit } from "@/utils";
import { useNamespace } from "@/composables";
import { Icon } from "@/components/core/icon";

defineOptions({ name: "ProDialog" });

const ns = useNamespace("pro-dialog");

const props = withDefaults(defineProps<ProDialogProps>(), {
  title: "弹框",
  fullscreen: false,
  fullscreenIcon: true,
  height: 400,
  showFooter: true,
  footerAlign: "right",
  confirmLoading: false,
  confirmText: "确认",
  cancelText: "关闭",
});

const emits = defineEmits<ProDialogEmits>();

const dialogVisible = defineModel<boolean>({ default: false });

const dialogHeight = ref(addUnit(props.height));
const isFullscreen = ref(false);
const elDialogInstance = useTemplateRef<DialogProps>("elDialogInstance");

const style = computed(() => ({
  justifyContent: props.footerAlign === "left" ? "flex-start" : props.footerAlign === "center" ? "center" : "flex-end",
}));

const toggleFullscreen = () => (isFullscreen.value = !isFullscreen.value);

watch(
  isFullscreen,
  async (val: boolean) => {
    await nextTick();
    if (val) {
      const windowHeight = document.documentElement.offsetHeight;
      // 弹框整体 padding 上下各 16，头部高度 47，内容区整体 padding 上下各 25，底部存在时高度 58
      dialogHeight.value = `${windowHeight - 32 - 47 - 50 - (props.showFooter ? 58 : 0)}px`;
    } else {
      dialogHeight.value = addUnit(props.height);
    }
  },
  { immediate: true }
);

const handleConfirm = () => emits("confirm");
const handleCancel = () => {
  emits("cancel");
  close();
};

const open = () => (dialogVisible.value = true);
const close = () => (dialogVisible.value = false);

defineExpose({ elDialogInstance, handleConfirm, handleCancel, open, close });
</script>

<template>
  <el-dialog
    ref="elDialogInstance"
    v-model="dialogVisible"
    :title="title"
    :fullscreen="isFullscreen"
    top="2vh"
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
            <Icon
              v-if="fullscreenIcon"
              :icon="isFullscreen ? 'core-fullscreen-exit' : 'core-fullscreen'"
              @click="toggleFullscreen"
              width="15px"
              height="15px"
              :color="`var(--${ns.elNamespace}-color-info)`"
              hover
              :hover-color="`var(--${ns.elNamespace}-color-primary)`"
              :style="{ cursor: 'pointer', userSelect: 'none' }"
            />
          </slot>
        </div>
      </slot>
    </template>

    <el-scrollbar :height="dialogHeight" :max-height>
      <slot />
    </el-scrollbar>

    <template v-if="showFooter" #footer>
      <div :class="ns.e('footer')" :style="style">
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
