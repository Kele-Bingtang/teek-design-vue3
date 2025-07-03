<script setup lang="ts" name="Watermark"></script>

<template>
  <el-space fill>
    <el-card
      shadow="never"
      header="自定义水印指令"
      v-waterMarker="{ text: 'Teek Design Vue3', fontSize: '16px', textColor: 'rgba(180, 180, 180, 0.6)' }"
    >
      <p>
        在标签上加 v-waterMarker="{ text: 'Teek Design Vue3', fontSize: '16px', textColor: 'rgba(180, 180, 180, 0.6)' }"
      </p>
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="text">水印文字</el-descriptions-item>
        <el-descriptions-item label="fontSize">水印大小，默认 16px</el-descriptions-item>
        <el-descriptions-item label="textColor">水印文字颜色，默认 rgba(180, 180, 180, 0.6)</el-descriptions-item>
        <el-descriptions-item label="width">水印宽度，默认 205</el-descriptions-item>
        <el-descriptions-item label="height">水印高度，默认 140</el-descriptions-item>
        <el-descriptions-item label="fontFamily">水印字体，默认微软雅黑</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>
