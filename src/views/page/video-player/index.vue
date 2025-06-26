<script setup lang="ts" name="VideoPlayerDemo">
import { VideoPlayer, createVideoViewer, VideoPlayerViewer } from "@/components";

const videoInfo = {
  url: "//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4",
  poster: "//lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc/poster.jpg",
};

const showVideo = () => {
  createVideoViewer(videoInfo);
};

const visible = ref(false);
</script>

<template>
  <el-space fill>
    <el-card shadow="never">
      <template #header>
        <el-link
          href="https://v2.h5player.bytedance.com/gettingStarted/"
          target="_blank"
          underline="never"
          style="font-size: 20px"
        >
          视频播放器
        </el-link>
      </template>
      <VideoPlayer
        url="//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4"
        poster="//lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc/poster.jpg"
      />

      <el-divider />

      <el-button @Click="showVideo">函数式打开视频播放器预览</el-button>

      <el-button @Click="visible = true">组件式打开视频播放器预览</el-button>
      <VideoPlayerViewer v-model="visible" v-bind="videoInfo" />
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="VideoPlayerViewer 配置项 📚" :column="1" border>
        <el-descriptions-item label="v-model/modelValue">
          组件式需要：是否打开视频播放器预览。`boolean` 类型，默认为 `false`
        </el-descriptions-item>
        <el-descriptions-item label="show">
          函数式需要：是否打开视频播放器预览。`boolean` 类型，默认为 `false`
        </el-descriptions-item>
        <el-descriptions-item label="url">视频链接。`string` 类型，默认为 `""`</el-descriptions-item>
        <el-descriptions-item label="poster">视频预览图片。`string` 类型，默认为 `""`</el-descriptions-item>
        <el-descriptions-item label="id">预览容器 id。`string` 类型，默认为 `""`</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>
