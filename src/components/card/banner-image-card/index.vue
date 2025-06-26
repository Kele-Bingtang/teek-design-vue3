<!-- 卡片横幅组件 -->
<script setup lang="ts">
import type { CardBannerProps } from "./types";
import { useNamespace } from "@/composables";
import defaultIcon from "@/common/assets/images/3d/icon1.webp"; // 导入默认图标

defineOptions({ name: "BannerImageCard" });

// 定义组件属性默认值
const props = withDefaults(defineProps<CardBannerProps>(), {
  height: "24rem",
  image: defaultIcon,
  title: "",
  description: "",
  // 主按钮默认配置
  button: () => ({
    show: true,
    text: "查看详情",
    color: "var(--main-color)",
    textColor: "#fff",
  }),
  // 取消按钮默认配置
  cancelButton: () => ({
    show: false,
    text: "取消",
    color: "#f5f5f5",
    textColor: "#666",
  }),
});

// 定义组件事件
const emit = defineEmits<{
  click: []; // 主按钮点击事件
  cancel: []; // 取消按钮点击事件
}>();

const ns = useNamespace("banner-image-card");

// 主按钮点击处理函数
const handleClick = () => {
  emit("click");
};

// 取消按钮点击处理函数
const handleCancel = () => {
  emit("cancel");
};
</script>

<template>
  <div :class="[ns.b(), ns.join('card-secondary')]" :style="{ height: props.height }">
    <div :class="ns.e('content')">
      <div :class="ns.e('icon')">
        <img :src="props.image" :alt="props.title" />
      </div>
      <div :class="ns.e('text')">
        <p :class="ns.em('text', 'title')">{{ props.title }}</p>
        <p :class="ns.em('text', 'description')">{{ props.description }}</p>
      </div>
      <div :class="ns.e('buttons')">
        <div
          v-if="props.cancelButton?.show"
          :class="[ns.em('buttons', 'button'), ns.is('cancel')]"
          :style="{
            backgroundColor: props.cancelButton?.color,
            color: props.cancelButton?.textColor,
          }"
          @click="handleCancel"
        >
          {{ props.cancelButton?.text }}
        </div>
        <div
          v-if="props.button?.show"
          :class="ns.em('buttons', 'button')"
          :style="{ backgroundColor: props.button?.color, color: props.button?.textColor }"
          @click="handleClick"
        >
          {{ props.button?.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
