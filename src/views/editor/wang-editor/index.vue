<script setup lang="ts" name="WangEditorDemo">
import { WangEditor, type FileInsertFnType, type ImageInsertFnType, type VideoInsertFnType } from "@/components";
import { uploadLocal } from "@/common/utils";

const content = ref("");
const disabled = ref(false);

const imageUpload = async (file: File, insertFn: ImageInsertFnType) => {
  // 上传到本地
  const { blobInfo, file: f } = await uploadLocal(file);
  console.log(blobInfo);
  const url = URL.createObjectURL(file);
  insertFn(url, f.name);
  // 上传服务器
  // uploadFiles(file, appId, this.$sso.userId)
  //   .then(res => {
  //     if (res.result === true) {
  //       let { fileKey, fileName } = res.data[0];
  //       let url = `${import.meta.env.VITE_API_URL}/documentStore/api/public/v1/download/downloadFileByGet?appId=a41d9bf7-5ffa-4ad0-bfd7-a57692cfdbc7&fileKey=${fileKey}`;
  //       insertFn(url, fileName);
  //     } else {
  //       this.$message.error("上传出错，服务器开小差了呢");
  //     }
  //   })
  //   .catch(() => {
  //     this.$message.error("上传出错，服务器开小差了呢");
  //   });
};

const videoUpload = async (file: File, insertFn: VideoInsertFnType) => {
  // 上传到本地
  const { blobInfo, file: f } = await uploadLocal(file);
  console.log(blobInfo);
  const url = URL.createObjectURL(file);
  insertFn(url, f.name);
  // 上传服务器
  // uploadFiles(file, appId, this.$sso.userId)
  //   .then(res => {
  //     if (res.result === true) {
  //       let { fileKey, fileName } = res.data[0];
  //       let url = `${import.meta.env.VITE_API_URL}/documentStore/api/public/v1/download/downloadFileByGet?appId=a41d9bf7-5ffa-4ad0-bfd7-a57692cfdbc7&fileKey=${fileKey}`;
  //       insertFn(url, fileName);
  //     } else {
  //       this.$message.error("上传出错，服务器开小差了呢");
  //     }
  //   })
  //   .catch(() => {
  //     this.$message.error("上传出错，服务器开小差了呢");
  //   });
};

const fileUpload = async (file: File, insertFn: FileInsertFnType) => {
  // 上传到本地
  const { blobInfo, file: f } = await uploadLocal(file);
  console.log(blobInfo);
  const url = URL.createObjectURL(file);
  insertFn(f.name, url);
  // 上传服务器
  // uploadFiles(file, appId, this.$sso.userId)
  //   .then(res => {
  //     if (res.result === true) {
  //       let { fileKey, fileName } = res.data[0];
  //       let url = `${import.meta.env.VITE_API_URL}/documentStore/api/public/v1/download/downloadFileByGet?appId=a41d9bf7-5ffa-4ad0-bfd7-a57692cfdbc7&fileKey=${fileKey}`;
  // 名称放在前面
  //       insertFn(fileName, url);
  //     } else {
  //       this.$message.error("上传出错，服务器开小差了呢");
  //     }
  //   })
  //   .catch(() => {
  //     this.$message.error("上传出错，服务器开小差了呢");
  //   });
};
</script>

<template>
  <el-space fill>
    <el-card shadow="never" class="tk-card-minimal">
      <template #header>
        <el-link href="https://www.wangeditor.com/" target="_blank" underline="never" style="font-size: 20px">
          WangEditor 富文本
        </el-link>
      </template>
      <el-button type="primary" @click="disabled = !disabled" style="margin-bottom: 20px">
        {{ disabled ? "启动编辑器" : "禁用编辑器" }}
      </el-button>

      <WangEditor
        v-model="content"
        height="400px"
        :disabled="disabled"
        @image-upload="imageUpload"
        @video-upload="videoUpload"
        @file-upload="fileUpload"
      ></WangEditor>
    </el-card>

    <el-card shadow="never" header="实时预览">
      <div class="editor-content" v-html="content"></div>
    </el-card>

    <el-card shadow="never" class="tk-card-minimal">
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="v-model">编辑器内容。`string` 类型，必传</el-descriptions-item>
        <el-descriptions-item label="toolbarKeys">工具栏内容。`string[]` 类型，默认为 `[]`</el-descriptions-item>
        <el-descriptions-item label="excludeKeys">
          去除掉指定的工具类内容。`string[]` 类型，默认 `[]`
        </el-descriptions-item>
        <el-descriptions-item label="height">富文本高度。`string` 类型，默认 `500px`</el-descriptions-item>
        <el-descriptions-item label="mode">
          富文本模式。`"default" | "simple"` 类型，默认 `"default"`
        </el-descriptions-item>
        <el-descriptions-item label="disabled">是否禁用编辑器。`boolean` 类型，默认 `false`</el-descriptions-item>
        <el-descriptions-item label="hideToolBar">是否隐藏工具栏。`boolean` 类型，默认 `false`</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never" class="tk-card-minimal">
      <el-descriptions title="Emits 事件 📚" :column="1" border>
        <el-descriptions-item label="imageUpload">
          图片上传事件。`(file: File, insertFn: ImageInsertFnType) => void` 类型。需要调用 insertFn
          函数传入图片的链接到富文本里
        </el-descriptions-item>
        <el-descriptions-item label="imageBeforeUpload">
          图片上传前事件。(file: File) => void 类型。
        </el-descriptions-item>
        <el-descriptions-item label="imageProgress">
          图片上传进度条事件。(progress: number) => void 类型。
        </el-descriptions-item>
        <el-descriptions-item label="imageSuccess">
          图片上传成功事件。(file: File, res: any) => void 类型。
        </el-descriptions-item>
        <el-descriptions-item label="imageFailed">
          图片上传失败事件。(file: File, res: any) => void 类型。
        </el-descriptions-item>
        <el-descriptions-item label="imageError">
          图片上传错误事件。(file: File, err: any, res: any) => void 类型。
        </el-descriptions-item>
        <el-descriptions-item label="videoUpload">
          视频上传错误事件。(file: File, insertFn: VideoInsertFnType) => void 类型。
        </el-descriptions-item>
        <el-descriptions-item label="fileBeforeUpload">
          文件上传前事件。(file: File) => void 类型。
        </el-descriptions-item>
        <el-descriptions-item label="fileUpload">
          文件上传事件。(file: File, insertFn: FileInsertFnType) => void 类型。需要调用 insertFn
          函数传入文件的链接到富文本里
        </el-descriptions-item>
        <el-descriptions-item label="onPaste">
          复制剪贴板内容到富文本事件。(editor: IDomEditor, event: ClipboardEvent) => void 类型
        </el-descriptions-item>
        <el-descriptions-item label="onCreated">
          富文本初始化成功后事件。(editor: IDomEditor) => void 类型
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never" class="tk-card-minimal">
      <el-descriptions title="expose 参数 📚" :column="1" border>
        <el-descriptions-item label="editor">富文本 Ref 实例</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>
