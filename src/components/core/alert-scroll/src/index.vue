<!-- 提醒滚动 -->
<template>
  <div
    v-if="text"
    ref="containerInstance"
    :class="[ns.b(), ns.is('vertical', !isHorizontal), ns.is(type)]"
    :style="{ width, height, backgroundColor: bgColor }"
  >
    <div :class="ns.e('icon')" :style="{ backgroundColor: bgColor }">
      <slot name="notice-icon">
        <Icon icon="core-horn" class="icon-notice" />
      </slot>
    </div>

    <div
      :class="[ns.e('content'), { 'opacity-0': !isReady, 'opacity-100': isReady }]"
      :style="contentStyle"
      @click="handleContentClick"
    >
      <!-- 原始内容 -->
      <span ref="textInstance" class="text-span">
        <slot>
          <slot name="text-icon">
            <Icon v-if="showIcon" :icon="textIconMap[type]" :size="16" class="icon-text" />
          </slot>
          <span v-html="text"></span>
        </slot>
      </span>

      <!-- 克隆内容用于无缝循环 -->
      <span v-if="shouldClone" class="text-span" :style="cloneSpacing">
        <slot>
          <slot name="text-icon">
            <Icon v-if="showIcon" :icon="textIconMap[type]" :size="16" class="icon-text" />
          </slot>
          <span v-html="text"></span>
        </slot>
      </span>
    </div>

    <div v-if="closable" :class="ns.e('close')" :style="{ backgroundColor: bgColor }" @click="handleClose">
      <slot name="close-icon">
        <Icon :icon="Close" class="icon-close" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlertScrollProps } from "./types";
import { useElementSize, useRafFn, useElementHover, useDebounceFn, useTimeoutFn } from "@vueuse/core";
import { Close, SuccessFilled, InfoFilled, CircleCloseFilled, WarningFilled } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";

defineOptions({ name: "AlertScroll" });

const props = withDefaults(defineProps<AlertScrollProps>(), {
  text: "",
  direction: "left",
  speed: 80,
  width: "100%",
  height: "36px",
  pauseOnHover: true,
  type: "primary",
  closable: false,
  showIcon: false,
  alwaysScroll: true,
});

const emit = defineEmits<{ close: [] }>();

const ns = useNamespace("alert-scroll");

const settingStore = useSettingStore();
const { isDark } = storeToRefs(settingStore);

const containerInstance = useTemplateRef("containerInstance");
const textInstance = useTemplateRef("textInstance");
const isReady = ref(false);

const currentPosition = ref(0);
const textSize = ref(0);
const containerSize = ref(0);
const shouldClone = ref(false);

const textIconMap = {
  primary: InfoFilled,
  success: SuccessFilled,
  info: InfoFilled,
  warning: WarningFilled,
  danger: CircleCloseFilled,
  error: CircleCloseFilled,
  secondary: InfoFilled,
};

const isHorizontal = computed(() => props.direction === "left" || props.direction === "right");
const isReverse = computed(() => props.direction === "right" || props.direction === "down");

// 使用 VueUse 的 useElementSize 监听容器尺寸变化
const { width: containerWidth, height: containerHeight } = useElementSize(containerInstance);

// 使用 VueUse 的 useElementHover 检测鼠标悬停
const isHovered = useElementHover(containerInstance);

// 计算是否应该暂停动画
const isPaused = computed(() => {
  // 如果未启用 alwaysScroll，且文字未超出容器，则暂停滚动
  if (!props.alwaysScroll && textSize.value <= containerSize.value) {
    return true;
  }
  return props.pauseOnHover && isHovered.value;
});

// 背景色
const bgColor = computed(
  () => `color-mix(in oklch, ${ns.cssVar(`color-${props.type}`)} ${isDark.value ? "25" : "10"}%, ${ns.cssVar("color")})`
);

const contentStyle = computed(() => {
  const transform = isHorizontal.value
    ? `translateX(${currentPosition.value}px)`
    : `translateY(${currentPosition.value}px)`;

  return {
    transform,
    willChange: "transform",
  };
});

// 克隆元素的间距
const cloneSpacing = computed(() => {
  const spacing = "2em";
  return isHorizontal.value ? { marginLeft: spacing } : { marginTop: spacing };
});

const handleClose = () => {
  emit("close");
};

// 测量容器尺寸和文字尺寸
const measureSizes = () => {
  if (!containerInstance.value || !textInstance.value) return;

  const text = textInstance.value;

  if (isHorizontal.value) {
    containerSize.value = containerWidth.value;
    textSize.value = text.offsetWidth;
  } else {
    containerSize.value = containerHeight.value;
    textSize.value = text.offsetHeight;
  }

  const isOverflow = textSize.value > containerSize.value;
  shouldClone.value = isOverflow;

  // 居中显示
  currentPosition.value = (containerSize.value - textSize.value) / 2;

  // 测量完成后才显示内容
  if (!isReady.value) {
    isReady.value = true;
  }
};

// 使用 VueUse 的 useDebounceFn 防抖测量
const debouncedMeasure = useDebounceFn(measureSizes, 150);

let lastTimestamp = 0;

// 使用 VueUse 的 useRafFn 替代手动 requestAnimationFrame
const { pause, resume } = useRafFn(
  ({ timestamp }) => {
    if (!lastTimestamp) lastTimestamp = timestamp;

    if (!isPaused.value) {
      const delta = (timestamp - lastTimestamp) / 1000;
      const distance = props.speed * delta;
      const spacing = textSize.value * 0.1;

      currentPosition.value += isReverse.value ? distance : -distance;

      // 循环边界检测
      if (isReverse.value) {
        if (currentPosition.value > containerSize.value) {
          currentPosition.value = -(textSize.value + spacing);
        }
      } else {
        if (currentPosition.value < -(textSize.value + spacing)) {
          currentPosition.value = containerSize.value;
        }
      }
    }

    lastTimestamp = timestamp;
  },
  { immediate: false }
);

const handleContentClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.tagName === "A") {
    e.stopPropagation();
  }
};

// 监听容器尺寸变化
watch([containerWidth, containerHeight], () => {
  debouncedMeasure();
});

// 监听属性变化
watch(
  () => [props.direction, props.speed, props.text],
  () => {
    measureSizes();
    lastTimestamp = 0;
  }
);

// 使用 VueUse 的 useTimeoutFn 替代 setTimeout
const { start: startMeasure } = useTimeoutFn(() => {
  measureSizes();
  // 测量完成后立即开始动画
  resume();
}, 100);

onMounted(startMeasure);

onBeforeUnmount(pause);
</script>

<style lang="scss" scoped>
@use "./index";
</style>
