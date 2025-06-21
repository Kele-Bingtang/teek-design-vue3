<script setup lang="ts">
import { ElDrawer, ElButton, type DrawerProps } from "element-plus";
import { ref } from "vue";
import { Icon } from "@/components";
import { useNamespace } from "@/composables";

defineOptions({ name: "ProDrawer" });

const ns = useNamespace("pro-drawer");

interface ProDrawerProps {
  title?: string; // 顶部标题
  fullscreen?: boolean; // 是否默认全屏，默认 false
  fullscreenIcon?: boolean; // 是否渲染全屏图标，默认 true
  confirmLabel?: string; // 确认按钮文字，默认 确 认
  closeLabel?: string; // 关闭按钮文字，默认 关 闭
}

const props = withDefaults(defineProps<ProDrawerProps>(), {
  title: "弹框",
  fullscreen: false,
  fullscreenIcon: true,
  confirmLabel: "确认",
  closeLabel: "关闭",
});

const emits = defineEmits<{
  close: [value: DrawerProps | null];
  confirm: [value: DrawerProps | null];
}>();

const drawerVisible = defineModel<boolean>({ required: true });

const isFullscreen = ref(props.fullscreen);
const elDrawerRef = useTemplateRef<DrawerProps>("elDrawerRef");

const toggleFull = () => {
  isFullscreen.value = !isFullscreen.value;
};

const handleClose = () => {
  emits("close", elDrawerRef.value);
  drawerVisible.value = false;
};

const handleConfirm = () => {
  emits("confirm", elDrawerRef.value);
  drawerVisible.value = false;
};

defineExpose({ elDrawerRef });
</script>

<template>
  <ElDrawer
    ref="elDrawerRef"
    v-model="drawerVisible"
    :title="title"
    size="30%"
    v-bind="$attrs"
    :class="[ns.b(), ns.is('fullscreen', isFullscreen)]"
  >
    <template #header="scope">
      <slot name="header" v-bind="scope">
        <div style="display: flex">
          <slot name="title">
            <span :class="`${ns.elNamespace}-drawer__title`" style="flex: 1">{{ title }}</span>
          </slot>
          <Icon
            v-if="fullscreenIcon"
            :icon="isFullscreen ? 'core-fullscreen-exit' : 'core-fullscreen'"
            @click="toggleFull"
            width="18px"
            height="18px"
            :color="`var(--${ns.elNamespace}-color-info)`"
            :hover-color="`var(--${ns.elNamespace}-color-primary)`"
            :icon-style="{ cursor: 'pointer' }"
          />
        </div>
      </slot>
    </template>

    <slot></slot>

    <template #footer>
      <slot name="footer">
        <ElButton @Click="handleClose()">{{ closeLabel }}</ElButton>
        <ElButton type="primary" @click="handleConfirm()">{{ confirmLabel }}</ElButton>
      </slot>
    </template>
  </ElDrawer>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
