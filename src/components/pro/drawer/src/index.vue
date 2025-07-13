<script setup lang="ts">
import type { ProDrawerEmits, ProDrawerProps } from "./types";
import type { DrawerProps } from "element-plus";
import { ref, computed, useTemplateRef } from "vue";
import { ElDrawer, ElButton } from "element-plus";
import { useNamespace } from "@/composables";
import { Icon } from "@/components/core/icon";

defineOptions({ name: "ProDrawer" });

const ns = useNamespace("pro-drawer");

const props = withDefaults(defineProps<ProDrawerProps>(), {
  title: "抽屉",
  fullscreen: false,
  fullscreenIcon: true,
  showFooter: true,
  footerAlign: "right",
  confirmLoading: false,
  confirmText: "确认",
  cancelText: "关闭",
});

const emits = defineEmits<ProDrawerEmits>();

const drawerVisible = defineModel<boolean>({ required: true });

const isFullscreen = ref(props.fullscreen);
const elDrawerInstance = useTemplateRef<DrawerProps>("elDrawerInstance");

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
 * 打开抽屉
 */
const open = () => (drawerVisible.value = true);
/**
 * 关闭抽屉
 */
const close = () => (drawerVisible.value = false);

defineExpose({ elDrawerInstance, handleConfirm, handleCancel, open, close });
</script>

<template>
  <el-drawer
    ref="elDrawerInstance"
    v-model="drawerVisible"
    :title="title"
    size="30%"
    :close-on-click-modal="false"
    v-bind="$attrs"
    :class="[ns.b(), ns.is('fullscreen', isFullscreen)]"
  >
    <template #header="scope">
      <slot name="header" v-bind="scope">
        <div style="display: flex">
          <slot name="header-title">
            <span :class="`${ns.elNamespace}-drawer__title`" style="flex: 1">{{ title }}</span>
          </slot>

          <slot name="fullscreen-icon" v-bind="{ isFullscreen, toggleFullscreen }">
            <Icon
              v-if="fullscreenIcon"
              :icon="isFullscreen ? 'core-fullscreen-exit' : 'core-fullscreen'"
              @click="toggleFullscreen"
              width="18px"
              height="18px"
              :color="ns.cssVarEl('color-info')"
              hover
              :hover-color="ns.cssVarEl('color-primary')"
              :style="{ cursor: 'pointer', userSelect: 'none', marginRight: '5px' }"
            />
          </slot>
        </div>
      </slot>
    </template>

    <slot></slot>

    <template v-if="showFooter" #footer>
      <div :class="ns.e('footer')" :style="footerStyle">
        <slot name="footer" v-bind="{ handleConfirm, handleCancel }">
          <el-button @click="handleConfirm()">{{ cancelText }}</el-button>
          <el-button type="primary" :loading="confirmLoading" @click="handleConfirm()">{{ confirmText }}</el-button>
        </slot>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
