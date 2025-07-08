<!-- 进度条卡片 -->
<script setup lang="ts">
import type { ProgressCardProps } from "./types";
import { useNamespace } from "@/composables";
import { CountTo } from "@/components";
import { addUnit } from "@/common/utils";

defineOptions({ name: "ProgressCard" });

const props = withDefaults(defineProps<ProgressCardProps>(), {
  title: "",
  color: "",
  icon: "",
  iconColor: "",
  iconBgColor: "",
  iconBgRadius: 8,
  iconSize: "",
  strokeWidth: 5,
});

const ns = useNamespace("progress-card");

const animationDuration = 500;
const currentPercentage = ref(0);

const animateProgress = () => {
  const startTime = Date.now();
  const startValue = currentPercentage.value;
  const endValue = props.percentage;

  const animate = () => {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / animationDuration, 1);

    currentPercentage.value = startValue + (endValue - startValue) * progress;

    if (progress < 1) requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};

onMounted(() => {
  animateProgress();
});

// 当 percentage 属性变化时重新执行动画
watch(
  () => props.percentage,
  () => animateProgress()
);
</script>

<template>
  <div :class="[ns.b(), ns.join('card-minimal'), 'flx-column-justify-center']">
    <div :class="ns.e('info')" :style="{ justifyContent: icon ? 'space-between' : 'flex-start' }">
      <div :class="ns.em('info', 'left')">
        <Icon
          v-if="icon"
          :icon="icon"
          :color="iconColor"
          :size="iconSize"
          :style="{
            backgroundColor: iconBgColor,
            borderRadius: addUnit(iconBgRadius),
          }"
        />
      </div>

      <div :class="ns.em('info', 'right')">
        <CountTo
          :key="percentage"
          class="percentage"
          :is="{ textAlign: icon ? 'right' : 'left' }"
          :end-val="percentage"
          :duration="2"
          suffix="%"
        />
        <p class="title">
          <slot name="title">{{ title }}</slot>
        </p>
      </div>
    </div>
    <el-progress :percentage="currentPercentage" :stroke-width="strokeWidth" :show-text="false" :color="color" />
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
