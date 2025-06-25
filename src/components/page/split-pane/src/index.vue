<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import SplitLine from "./split-line.vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "SplitPane" });

const ns = useNamespace("split-pane");

type NumOrStr = number | string;

interface SplitPaneProps {
  mode?: "horizontal" | "vertical";
  min?: NumOrStr;
  max?: NumOrStr;
}

const props = withDefaults(defineProps<SplitPaneProps>(), {
  mode: "horizontal",
  min: "40px",
  max: "40px",
});

type SplitPaneEmits = {
  moving: [event: MouseEvent];
  moveEnd: [];
  moveStart: [];
};

const emits = defineEmits<SplitPaneEmits>();

const modelValue = defineModel<NumOrStr>({ default: 0.5 });

const splitPaneRef = useTemplateRef("splitPaneRef");
const offset = ref(0);
const initOffset = ref(0);
const oldOffset = ref<unknown>(0);
const isMoving = ref(false);

const isHorizontal = computed(() => props.mode === "horizontal");
const anotherOffset = computed(() => 100 - offset.value);
const valueIsString = computed(() => typeof modelValue.value === "string");
const offsetSize = computed(() => (isHorizontal.value ? "offsetHeight" : "offsetWidth"));
const computedMin = computed(() => getComputedThresholdValue("min"));
const computedMax = computed(() => getComputedThresholdValue("max"));

watch(modelValue, () => init());

onMounted(() => {
  nextTick(() => {
    init();
  });
});

const init = () => {
  const value = valueIsString.value
    ? px2percent(modelValue.value as string, splitPaneRef.value?.[offsetSize.value] + "")
    : modelValue.value;
  offset.value = ((value as number) * 10000) / 100;
};

const px2percent = (numerator: string, denominator: string) => {
  return parseFloat(numerator) / parseFloat(denominator);
};

const getComputedThresholdValue = (type: string) => {
  let value: NumOrStr = "";
  if (type === "min") value = props.min;
  else if (type === "max") value = props.max;
  const size = splitPaneRef.value?.[offsetSize.value] || 0;
  if (valueIsString.value) return typeof value === "string" ? value : size * value;
  else return typeof value === "string" ? px2percent(value, size + "") : value;
};

// eslint-disable-next-line no-unused-vars
const getMin = (value1: NumOrStr, value2: NumOrStr) => {
  if (valueIsString.value) return `${Math.min(parseFloat(value1 as string), parseFloat(value2 as string))}px`;
  else return Math.min(value1 as number, value2 as number);
};

const getMax = (value1: NumOrStr, value2: NumOrStr) => {
  if (valueIsString.value) return `${Math.max(parseFloat(value1 as string), parseFloat(value2 as string))}px`;
  else return Math.max(value1 as number, value2 as number);
};

const getAnotherOffset = (value: NumOrStr) => {
  let res: NumOrStr = "0";
  if (valueIsString.value) res = `${(splitPaneRef.value?.[offsetSize.value] || 0) - parseFloat(value as string)}px`;
  else res = 1 - (value as number);
  return res;
};

const handleMove = (e: MouseEvent) => {
  const pageOffset = isHorizontal.value ? e.pageY : e.pageX;
  const offset = pageOffset - initOffset.value;
  const outerWidth = splitPaneRef.value?.[offsetSize.value] || 0;
  let value = valueIsString.value
    ? `${parseFloat(oldOffset.value + "") + offset}px`
    : px2percent(outerWidth * (oldOffset.value as number) + offset + "", outerWidth + "");
  console.log(px2percent(outerWidth * (oldOffset.value as number) + offset + "", outerWidth + ""));
  const anotherValue = getAnotherOffset(value);
  if (parseFloat(value + "") <= parseFloat(computedMin.value + "")) value = getMax(value, computedMin.value);
  if (parseFloat(anotherValue + "") <= parseFloat(computedMax.value + "")) {
    value = getAnotherOffset(getMax(anotherValue, computedMax.value));
  }
  (e as any).atMin = modelValue.value === computedMin.value;
  (e as any).atMax = valueIsString.value
    ? getAnotherOffset(modelValue.value) === computedMax.value
    : (getAnotherOffset(modelValue.value) as number).toFixed(5) === (computedMax.value as number).toFixed(5);
  modelValue.value = value;
  emits("moving", e);
};

const handleUp = () => {
  isMoving.value = false;
  document.removeEventListener("mousemove", handleMove);
  document.removeEventListener("mouseup", handleUp);
  emits("moveEnd");
};

const handleMousedown = (e: MouseEvent) => {
  initOffset.value = isHorizontal.value ? e.pageY : e.pageX;
  oldOffset.value = modelValue.value;
  isMoving.value = true;
  document.addEventListener("mousemove", handleMove);
  document.addEventListener("mouseup", handleUp);
  emits("moveStart");
};
</script>

<template>
  <div ref="splitPaneRef" :class="[ns.b(), { 'no-select': isMoving }]">
    <div v-if="isHorizontal" :class="ns.e('horizontal')">
      <div :style="{ bottom: `${anotherOffset}%` }" :class="`${ns.e('item')} top-pane`">
        <slot name="top" />
      </div>
      <div
        :class="[ns.e('container'), ns.em('horizontal', 'container')]"
        :style="{ top: `${offset}%` }"
        @mousedown="handleMousedown"
      >
        <slot name="line">
          <split-line mode="horizontal" />
        </slot>
      </div>
      <div :style="{ top: `${offset}%` }" :class="`${ns.e('item')} bottom-pane`"><slot name="bottom" /></div>
    </div>
    <div v-else :class="ns.e('vertical')">
      <div :style="{ right: `${anotherOffset}%` }" :class="`${ns.e('item')} left-pane`"><slot name="left" /></div>
      <div
        :class="[ns.e('container'), ns.em('vertical', 'container')]"
        :style="{ left: `${offset}%` }"
        @mousedown="handleMousedown"
      >
        <slot name="line">
          <split-line mode="vertical" />
        </slot>
      </div>
      <div :style="{ left: `${offset}%` }" :class="`${ns.e('item')} right-pane`"><slot name="right" /></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(split-pane) {
  position: relative;
  width: 100%;
  height: 100%;

  @include e(item) {
    position: absolute;

    &.left-pane,
    &.right-pane {
      top: 0;
      bottom: 0;
    }

    &.left-pane {
      left: 0;
    }

    &.right-pane {
      right: 0;
    }

    &.top-pane,
    &.bottom-pane {
      right: 0;
      left: 0;
    }

    &.top-pane {
      top: 0;
    }

    &.bottom-pane {
      bottom: 0;
    }
  }

  @include e(vertical) {
    height: 100%;

    @include m(container) {
      top: 50%;
      left: 50%;
      width: 0;
      height: 100%;
    }
  }

  @include e(container) {
    position: absolute;
    z-index: 10;
    transform: translate(-50%, -50%);
  }

  @include e(horizontal) {
    width: 100%;

    @include m(container) {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 10;
      width: 100%;
      height: 0;
      transform: translate(-50%, -50%);
    }
  }

  &.no-select {
    -webkit-touch-callout: none;
    user-select: none;
  }
}
</style>
