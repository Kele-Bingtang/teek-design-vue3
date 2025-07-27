<!-- 利用 el-tooltip 实现文字超出时显示省略号并气泡提示，否则不气泡提示，支持 el-tooltip 的所有属性 -->
<!-- 使用: Tooltip 组件内必须包裹仅且一个 html 标签，外层 div 标签需要具有宽度
    <div>
      <Tooltip><span>...</span></Tooltip>
    </div>
 -->
<script setup lang="ts">
import type { CSSProperties } from "vue";
import { ref, computed, onMounted, onBeforeUnmount, watch, useTemplateRef, useAttrs } from "vue";
import { storeToRefs } from "pinia";
import { ElTooltip } from "element-plus";
import { useResizeObserver } from "@vueuse/core";
import { useSettingStore } from "@/pinia";
import { serviceConfig } from "@/common/config";
import { isFunction } from "@/common/utils";
import type { TooltipProps } from "./types";

defineOptions({ name: "Tooltip" });

const props = withDefaults(defineProps<TooltipProps>(), {
  line: 1,
  realTime: false,
  maxTry: 3,
});

const containerInstance = useTemplateRef<HTMLElement>("containerInstance"); // 容器引用
const showTip = ref(false); // 是否显示tooltip
const contentText = ref(""); // 文本内容
const tryCount = ref(0); // 当前尝试次数

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
    const computedStyle = getComputedStyle(container);
    const lineHeightStr = computedStyle.lineHeight;
    let lineHeight: number;

    // 处理 line-height 为 normal 的情况（使用默认 1.2 倍）
    if (lineHeightStr === "normal") {
      const fontSize = parseFloat(computedStyle.fontSize);
      lineHeight = fontSize * 1.2;
    } else lineHeight = parseFloat(lineHeightStr);

    // 计算最大允许高度（考虑整数像素边界问题）
    const maxHeight = Math.ceil(lineHeight * props.line);
    const scrollHeight = Math.ceil(container.scrollHeight);

    // 精确判断：内容高度必须严格超过最大允许高度（临界点处理）
    showTip.value = scrollHeight > maxHeight + 1;
  }

  // 更新尝试次数
  if (!props.realTime && props.maxTry > 0 && !showTip.value) tryCount.value++;
};

/**
 * 处理鼠标悬停事件
 */
const handleMouseOver = () => {
  if (!props.realTime && props.maxTry > 0 && tryCount.value < props.maxTry) checkOverflow();
};

/**
 * 当realTime或maxTry变化时重置尝试次数
 */
watch(
  () => [props.realTime, props.maxTry],
  () => {
    tryCount.value = 0;
  }
);

/**
 * 使用 ResizeObserver 监听尺寸变化
 */
useResizeObserver(containerInstance, () => {
  if (props.realTime) checkOverflow();
});

onMounted(() => {
  // 初始检测
  checkOverflow();

  // 非实时模式下添加鼠标事件
  if (!props.realTime && props.maxTry > 0) {
    containerInstance.value?.addEventListener("mouseover", handleMouseOver);
  }
});

onBeforeUnmount(() => {
  // 清除事件监听
  if (!props.realTime && props.maxTry > 0) {
    containerInstance.value?.removeEventListener("mouseover", handleMouseOver);
  }
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
