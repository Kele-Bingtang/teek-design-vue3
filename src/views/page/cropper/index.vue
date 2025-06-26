<script setup lang="ts" name="CropperDemo">
import { Cropper } from "@/components";
import { useNamespace } from "@/composables";

const ns = useNamespace("cropper-demo");

const uploadImage = (imgData: FormData) => {
  console.log(imgData);
};
</script>

<template>
  <el-space fill>
    <el-card shadow="never" :class="ns.b()">
      <template #header>
        <el-link href="https://github.xyxiao.cn/vue-cropper/" target="_blank" underline="never" style="font-size: 20px">
          Cropper
        </el-link>
      </template>

      <Cropper
        imgLink="https://cdn.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png"
        :crop-width="200"
        :crop-height="200"
        :crop-container-height="350"
        image-type="base64"
        @upload-image="uploadImage"
      ></Cropper>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="imgLink">图片链接。`string` 类型，默认为 `""`</el-descriptions-item>
        <el-descriptions-item label="imageType">
          图片类型。`"blob" | "base64"` 类型，默认为 `"blob"`
        </el-descriptions-item>
        <el-descriptions-item label="cropWidth">截图框宽度。`number` 类型，默认为 `200`</el-descriptions-item>
        <el-descriptions-item label="cropHeight">截图框高度。`number` 类型，默认为 `200`</el-descriptions-item>
        <el-descriptions-item label="cropContainerHeight">
          截图容器高度。`number` 类型，默认为 `350`
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="Emits 事件 📚" :column="1" border>
        <el-descriptions-item label="uploadImage">
          图片上传事件。`(formData: FormData) => void` 类型
        </el-descriptions-item>
        <el-descriptions-item label="imgMoving">移动图片事件。`() => void` 类型</el-descriptions-item>
        <el-descriptions-item label="cropMoving">图片剪切事件。`() => void` 类型</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(cropper-demo) {
  width: 1000px;
}
</style>
