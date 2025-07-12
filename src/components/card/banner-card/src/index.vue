<!-- 基础横幅组件 -->
<script setup lang="ts">
import type { BannerCardEmits, BannerCardProps, Meteor } from "./types";
import { onMounted, ref, computed } from "vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "BannerCard" });

const props = withDefaults(defineProps<BannerCardProps>(), {
  height: "11rem",
  title: "",
  subtitle: "",
  titleColor: "#ffffff",
  subtitleColor: "#ffffff",
  backgroundColor: useNamespace().cssVarEl("color-primary-light-3"),
  decoration: true,
  buttonConfig: () => ({
    show: true,
    text: "查看",
    color: "#ffffff",
    textColor: "#333",
    radius: "6px",
  }),
  meteorConfig: () => ({ enabled: false, count: 10 }),
  imageConfig: () => ({ src: "", width: "12rem", bottom: "-3rem", right: "0" }),
});

const ns = useNamespace("banner-card");

// 定义组件事件
const emit = defineEmits<BannerCardEmits>();

// 计算按钮样式属性
const buttonColor = computed(() => props.buttonConfig.color ?? "#fff");
const buttonTextColor = computed(() => props.buttonConfig.textColor ?? "#333");
const buttonRadius = computed(() => props.buttonConfig.radius ?? "6px");

// 流星数据初始化
const meteors = ref<Meteor[]>([]);
onMounted(() => {
  if (props.meteorConfig.enabled) meteors.value = generateMeteors(props.meteorConfig?.count ?? 10);
});

/**
 * 生成流星数据数组
 *
 * @param count 流星数量
 */
function generateMeteors(count: number): Meteor[] {
  // 计算每个流星的区域宽度
  const segmentWidth = 100 / count;
  return Array.from({ length: count }, (_, index) => {
    // 计算流星起始位置
    const segmentStart = index * segmentWidth;
    // 在区域内随机生成x坐标
    const x = segmentStart + Math.random() * segmentWidth;
    // 随机决定流星速度快慢
    const isSlow = Math.random() > 0.5;
    return {
      x,
      speed: isSlow ? 5 + Math.random() * 3 : 2 + Math.random() * 2,
      delay: Math.random() * 5,
    };
  });
}
</script>

<template>
  <div
    :class="[ns.b(), ns.join('card-minimal'), ns.has('decoration')]"
    :style="{ backgroundColor: backgroundColor, height: height }"
    @click="emit('click')"
    class="flx-column-justify-center"
  >
    <!-- 流星效果 -->
    <div v-if="meteorConfig?.enabled" :class="ns.e('meteors')">
      <span
        v-for="(meteor, index) in meteors"
        :key="index"
        class="meteor"
        :style="{
          top: '-60px',
          left: `${meteor.x}%`,
          animationDuration: `${meteor.speed}s`,
          animationDelay: `${meteor.delay}s`,
        }"
      ></span>
    </div>

    <div :class="ns.e('content')">
      <!-- title 插槽 -->
      <slot name="title">
        <p v-if="title" :class="ns.e('title')" :style="{ color: titleColor }">{{ title }}</p>
      </slot>

      <!-- subtitle 插槽 -->
      <slot name="subtitle">
        <p v-if="subtitle" :class="ns.e('subtitle')" :style="{ color: subtitleColor }">{{ subtitle }}</p>
      </slot>

      <!-- button 插槽 -->
      <slot name="button">
        <div
          v-if="buttonConfig?.show"
          :class="ns.e('button')"
          :style="{
            backgroundColor: buttonColor,
            color: buttonTextColor,
            borderRadius: buttonRadius,
          }"
          @click.stop="emit('buttonClick')"
        >
          {{ buttonConfig?.text }}
        </div>
      </slot>

      <!-- default 插槽 -->
      <slot></slot>

      <!-- 背景图片 -->
      <img
        v-if="imageConfig.src"
        :class="ns.e('background-image')"
        :src="imageConfig.src"
        :style="{ width: imageConfig.width, bottom: imageConfig.bottom, right: imageConfig.right }"
        loading="lazy"
        alt="背景图片"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
