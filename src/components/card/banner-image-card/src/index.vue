<!-- 卡片横幅组件 -->
<script setup lang="ts">
import type { CardBannerProps } from "./types";
import { useNamespace } from "@/composables";
import defaultIcon from "@/common/assets/images/3d/icon1.webp"; // 导入默认图标

defineOptions({ name: "BannerImageCard" });

withDefaults(defineProps<CardBannerProps>(), {
  height: "24rem",
  image: defaultIcon,
  title: "",
  description: "",
  // 主按钮默认配置
  button: () => ({
    show: true,
    text: "查看详情",
    color: useNamespace().cssVar("color-primary"),
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
  // 主按钮点击事件
  click: [];
  // 取消按钮点击事件
  cancel: [];
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
  <div :class="[ns.b(), ns.join('card-minimal'), 'flx-column-justify-center']" :style="{ height: height }">
    <div :class="[ns.e('content'), 'flx-column-align-center']">
      <div :class="ns.e('icon')">
        <img :src="image" :alt="title" />
      </div>
      <div :class="ns.e('text')">
        <p :class="ns.em('text', 'title')">{{ title }}</p>
        <p :class="ns.em('text', 'description')">{{ description }}</p>
      </div>
      <div :class="ns.e('buttons')">
        <div
          v-if="cancelButton.show"
          :class="[ns.em('buttons', 'button'), ns.is('cancel')]"
          :style="{
            backgroundColor: cancelButton.color,
            color: cancelButton.textColor,
          }"
          @click="handleCancel"
        >
          {{ cancelButton.text }}
        </div>
        <div
          v-if="button.show"
          :class="ns.em('buttons', 'button')"
          :style="{ backgroundColor: button.color, color: button.textColor }"
          @click="handleClick"
        >
          {{ button.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
