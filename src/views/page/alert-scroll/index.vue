<script setup lang="ts">
import { ElMessage } from "element-plus";
import { AlertScroll } from "@/components";

const handleClose = () => {
  ElMessage.info("已关闭");
};
</script>

<template>
  <el-space fill>
    <!-- 不同类型 -->
    <AlertScroll type="primary" text="这是一条主题类型的滚动公告" />
    <AlertScroll type="success" text="这是一条成功类型的滚动公告" />
    <AlertScroll type="warning" text="这是一条警告类型的滚动公告" show-icon />
    <AlertScroll type="danger" text="这是一条危险类型的滚动公告" />
    <AlertScroll type="error" text="这是一条错误类型的滚动公告" show-icon />
    <AlertScroll type="info" text="这是一条信息类型的滚动公告" />
    <AlertScroll type="secondary" text="这是一条次信息类型的滚动公告" />

    <!-- 可关闭 -->
    <AlertScroll text="这是一条可关闭的滚动公告" show-icon closable @close="handleClose" />

    <!-- 自定义速度 -->
    <AlertScroll text="这是一条滚动速度为 200 毫秒的滚动公告" :speed="200" />

    <!-- 自定义速度和方向 -->
    <AlertScroll type="warning" text="这是一条速度较慢、向右滚动的公告" :speed="30" direction="right" />

    <AlertScroll :pause-on-hover="false" text="这是一条鼠标悬停无法暂停的滚动的公告" />

    <AlertScroll
      text="这是一条文字溢出才会滚动的公告，当文本内容超出容器宽度时才会开始滚动显示，否则保持静止状态"
      @close="handleClose"
      :alwaysScroll="false"
    />

    <AlertScroll type="danger" direction="up" :speed="30" text="这是一条向上滚动的公告" />

    <AlertScroll type="info" direction="down" :speed="30" text="这是一条向下滚动的公告" />
  </el-space>
</template>
