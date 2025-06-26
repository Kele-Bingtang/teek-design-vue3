<!-- 进度条卡片 -->
<script setup lang="ts">
import { useNamespace } from "@/composables";
import type { ProgressCardProps } from "./types";
import { CountTo } from "@/components";

defineOptions({ name: "ProgressCard" });

const props = withDefaults(defineProps<ProgressCardProps>(), {
  strokeWidth: 5,
  iconBgRadius: 8,
  color: "#67C23A",
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
  <div :class="[ns.b(), ns.join('card-secondary')]">
    <div :class="ns.e('info')" :style="{ justifyContent: icon ? 'space-between' : 'flex-start' }">
      <div :class="ns.em('info', 'left')">
        <Icon
          v-if="icon"
          :icon="icon"
          :style="{
            color: iconColor,
            backgroundColor: iconBgColor,
            fontSize: iconSize + 'px',
            borderRadius: iconBgRadius + 'px',
          }"
        />
      </div>

      <div :class="ns.em('info', 'right')">
        <CountTo
          :key="percentage"
          class="percentage"
          :style="{ textAlign: icon ? 'right' : 'left' }"
          :endVal="percentage"
          :duration="2"
          suffix="%"
        />
        <p class="title">{{ title }}</p>
      </div>
    </div>
    <el-progress :percentage="currentPercentage" :stroke-width="strokeWidth" :show-text="false" :color="color" />
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
