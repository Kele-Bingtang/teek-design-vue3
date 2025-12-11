<script setup lang="ts" name="ImageViewerDemo">
import { ref } from "vue";
import { createImageViewer, ImageViewer } from "@/components";

const urlList = [
  "https://images.unsplash.com/photo-1659959103870-c4beea371a9b?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1749044300940-3a6c9e51a584?q=80&w=648&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1748723594323-f5210fe2b9ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM4fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
];

const open = () => {
  createImageViewer({
    urlList: urlList,
  });
};

const visible = ref(false);
</script>

<template>
  <el-space fill alignment="normal" style="width: 100%">
    <el-card shadow="never" header="图片预览组件" class="tk-card-minimal">
      <el-button @click="open()">函数式打开图片预览</el-button>

      <el-button @click="visible = true">组件式打开图片预览</el-button>
      <ImageViewer v-model="visible" :urlList="urlList" />
    </el-card>

    <el-card shadow="never" class="tk-card-minimal">
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="v-model/modelValue">
          组件式需要：是否打开图片预览。`boolean` 类型，默认 `false`
        </el-descriptions-item>
        <el-descriptions-item label="show">
          函数式需要：是否打开图片预览。`boolean` 类型，默认 `true`
        </el-descriptions-item>
        <el-descriptions-item label="urlList">图片链接数组。`string[]` 类型，默认为 `[]`</el-descriptions-item>
        <el-descriptions-item label="zIndex">图片预览组件 z-index 样式。`string` 类型，默认 `200`</el-descriptions-item>
        <el-descriptions-item label="initialIndex">第一次加载图片的下标。`number` 类型，默认 `0`</el-descriptions-item>
        <el-descriptions-item label="infinite">是否开启循环预览功能。`boolean` 类型，默认 `true`</el-descriptions-item>
        <el-descriptions-item label="hideOnClickModal">
          是否点击遮罩层后关闭图片预览组件。`boolean` 类型，默认 `false`
        </el-descriptions-item>
        <el-descriptions-item label="teleported">
          是否插入到 boyd 元素。`boolean` 类型，默认 `false`
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>
