<!-- 利用 el-tooltip 实现文字超出时显示省略号并气泡提示，否则不气泡提示，支持 el-tooltip 的所有属性 -->
<!-- 使用: Tooltip 组件内必须包裹仅且一个 html 标签，外层 div 标签需要具有宽度
    <div>
      <Tooltip><span>...</span></Tooltip>
    </div>
 -->
<script setup lang="ts">
import type { CSSProperties } from "vue";
import type { TooltipProps } from "./types";
import { ref, computed, onMounted, onBeforeUnmount, useTemplateRef, useAttrs } from "vue";
import { storeToRefs } from "pinia";
import { ElTooltip } from "element-plus";
import { useResizeObserver } from "@vueuse/core";
import { useSettingStore } from "@/pinia";
import { serviceConfig } from "@/common/config";
import { isFunction } from "@/common/utils";

defineOptions({ name: "Tooltip" });

const props = withDefaults(defineProps<TooltipProps>(), {
  line: 1,
  realTime: false,
});

const containerInstance = useTemplateRef<HTMLElement>("containerInstance"); // 容器引用
const showTip = ref(false); // 是否显示tooltip
const contentText = ref(""); // 文本内容

const attrs = useAttrs();

const { isDark } = storeToRefs(useSettingStore());

const effect = computed(() => {
  const effect = serviceConfig.layout.tooltipEffect;
  if (isFunction(effect)) return effect(isDark.value);
  return effect;
});

// 容器 class
const containerClass = computed(() => {
  return props.line === 1 ? "single-line" : "multi-line";
});

const style = computed(() => {
  const style = attrs.style as CSSProperties;
  return props.line > 1 ? { "-webkit-line-clamp": props.line, ...style } : style;
});

/**
 * 获取元素的文本内容
 */
const getTextContent = (element: HTMLElement | null): string => {
  if (!element) return "";
  return element.textContent || element.innerText || "";
};

/**
 * 检测是否溢出
 */
const checkOverflow = () => {
  if (!containerInstance.value) return;

  const container = containerInstance.value;
  contentText.value = getTextContent(container);

  if (props.line === 1) {
    // 单行检测：比较内容宽度与容器宽度
    showTip.value = container.scrollWidth > container.offsetWidth;
  } else {
    /// 多行检测：精确比较内容高度与容器高度
    // 使用 +1 容忍度防止亚像素渲染导致的误判
    showTip.value = container.scrollHeight > container.clientHeight + 1;
  }
};

/**
 * 处理鼠标悬停事件
 */
const handleMouseOver = () => {
  if (!props.realTime) {
    // 确保在浏览器完成重绘（元素可见）后再计算
    requestAnimationFrame(checkOverflow);
  }
};

/**
 * 使用 ResizeObserver 监听尺寸变化，当容器尺寸变化时重新检查是否溢出
 */
useResizeObserver(containerInstance, () => {
  if (props.realTime) checkOverflow();
});

onMounted(() => {
  // 初始检测
  checkOverflow();

  // 非实时模式下添加鼠标事件
  if (!props.realTime) {
    containerInstance.value?.addEventListener("mouseover", handleMouseOver);
  }
});

onBeforeUnmount(() => {
  // 清除事件监听
  if (!props.realTime) {
    containerInstance.value?.removeEventListener("mouseover", handleMouseOver);
  }
});

defineExpose({
  /**
   * 手动强制刷新检测，适用于父级元素刚变为可见，或内容刚异步更新完毕的场景
   */
  refresh: () => {
    requestAnimationFrame(checkOverflow);
  },
});
</script>

<template>
  <el-tooltip
    v-if="showTip"
    :effect
    v-bind="{ ...attrs, class: '', style: '' }"
    :disabled="!showTip"
    :content="contentText"
  >
    <div ref="containerInstance" :class="[containerClass, attrs.class]" :style="style">
      <slot></slot>
    </div>
  </el-tooltip>

  <div v-else ref="containerInstance" :class="containerClass" :style="style">
    <slot></slot>
  </div>
</template>

<style scoped>
/* 单行省略样式 */
.single-line {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 多行省略样式 */
.multi-line {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
}
</style>
