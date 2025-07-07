<script setup lang="ts" name="TinymceDemo">
import { Tinymce, type UITheme } from "@/components";
import { useLayoutStore } from "@/pinia";
import { tinymceHtml } from "@/mock/tinymce";
import { ElMessage } from "element-plus";

const layoutStore = useLayoutStore();
const content = ref(tinymceHtml);
const tinymceActive = ref(true);
const disabled = ref(false);
const theme = ref<UITheme>("default");

const { language } = storeToRefs(layoutStore);

// 是否已上传图片
const hasUploadImage = ref(false);

onActivated(() => {
  tinymceActive.value = true;
});

onDeactivated(() => {
  tinymceActive.value = false;
});

const handleDisabled = () => {
  disabled.value = !disabled.value;
};

const handleTheme = () => {
  tinymceActive.value = false;
  if (theme.value === "default") {
    theme.value = "dark";
  } else {
    theme.value = "default";
  }
  nextTick(() => {
    tinymceActive.value = true;
  });
};
/**
 * 上传图片，复制图片回调
 * @param blobInfo 文件信息
 * @param success 成功回调，返回链接
 * @param failure 失败回调，返回提示信息
 */
const handleImgUpload = async (blobInfo: any, success: (value: unknown) => void, failure: (value: unknown) => void) => {
  const blobFile = blobInfo.blob(); // blob 图片
  // let base64File = blobInfo.base64(); // base64 图片
  // fileName 为 Tinymce 内部处理的文件名（官网说 fileName 一定唯一），而 blobFile.name 是文件上传前自带的文件名
  // let fileName = blobInfo.filename();
  const isLt2M = blobFile.size / 1024 / 1024 < 10;
  // const { name } = blobFile;
  // let imgType = name && name.substring(name.lastIndexOf(".") + 1);
  // if (imgType !== "jpg" && imgType !== "png") {
  //   failure("上传文件只能是 jpg、png 格式!");
  //   return false;
  // }

  if (!isLt2M) {
    failure("上传失败，图片不可超过 10M!");
    return false;
  }

  // 批量上传等于 for 循环调用该 handleImgUpload 函数
  // if ("file" in blobInfo) {
  //   const { blobInfo: b } = await uploadLocal(blobInfo.file);
  //   console.log(b.blobUri());
  //   success(b.blobUri());
  // }

  if (!hasUploadImage.value) {
    const { blobInfo: b } = await uploadLocal(blobFile);
    success(b.blobUri());
    hasUploadImage.value = true;
  } else hasUploadImage.value = false;

  // 上传服务器
  // let formData = new FormData();
  // formData.append("file", blobInfo.blob());
  // axios({
  //   url: "",
  //   method: "post",
  //   data: formData,
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  // })
  //   .then((res: any) => {
  //  使用 axios 进行图片上传，注意 this 是否引入成功
  //     const { url, name } = res.data;
  //     success(url, { title: name });
  //   })
  //   .catch(() => {
  //     failure("上传出错，服务器开小差了呢");
  //   });
};
/**
 *
 * @param file 上传的文件
 * @param filetype 在哪个工具上传文件类型："image" | "media" | "file"，并不是上传的文件类型（文件上传就是插入/编辑链接的那个按钮，传入一个链接）
 * @param callback callback 是个回调，参数 1 是一个有效的 http 链接，如果是图片，执行 callback 后就会执行 @img-upload 回调
 */
const handleFileUpload = async (
  file: File,
  filetype: "image" | "media" | "file",
  callback: (uri: string, meta?: { text?: string; title?: string }) => void
) => {
  if (filetype === "image") {
    // 图片
    if (file.type && !file.type.startsWith("image")) {
      ElMessage.error("请上传图片！");
      return;
    }
    // 本地上传
    const { blobInfo, file: f } = await uploadLocal(file);
    hasUploadImage.value = true;
    callback(blobInfo.blobUri(), { text: f.name, title: f.name });
  } else if (filetype === "media") {
    // 媒体，如视频
    const isValid = await validateVideo(file);
    if (isValid) {
      // 本地上传
      const { blobInfo, file: f } = await uploadLocal(file);
      callback(blobInfo.blobUri(), { text: f.name, title: f.name });
    }
  } else if (filetype === "file") {
    // 文件
    // 本地上传
    const { blobInfo, file: f } = await uploadLocal(file);
    callback(blobInfo.blobUri(), { text: f.name, title: f.name });
  }
};

/**
 * 上传到本地浏览器
 */
const uploadLocal = (file: File): Promise<{ blobInfo: any; file: File }> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function () {
      const id = "id" + new Date().getTime(); // 本地图片的文件名
      const tinymce = (window as any).tinymce;
      const blobCache = tinymce.activeEditor.editorUpload.blobCache;
      const base64 = (reader as any).result.split(",")[1];
      const blobInfo = blobCache.create(id, file, base64);
      blobCache.add(blobInfo);
      resolve({ blobInfo, file });
    };
    reader.readAsDataURL(file);
  });
};
/**
 * 视频上传前验证
 */
const validateVideo = async (file: File) => {
  const isMP4 = file.type === "video/mp4"; // 如果允许所有视频格式，可以 file.type.startsWith("video")
  const isLt100M = file.size / 1024 / 1024 < 100;

  if (!isMP4) {
    ElMessage.error("上传视频必须为 MP4 格式！");
    return false;
  }

  if (!isLt100M) {
    ElMessage.error("上传视频大小限制 100M 以内！");
    return false;
  }

  const duration = await getVideoDuration(file);
  if (duration > 60) {
    ElMessage.error("上传视频时长不能超过 60 秒！");
    return false;
  }
  return true;
};
/**
 * 获取视频时长
 * @param file - 要上传的文件
 */
const getVideoDuration = (file: File): Promise<number> => {
  return new Promise(resolve => {
    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(file);

    videoElement.addEventListener("loadedmetadata", () => {
      resolve(videoElement.duration);
    });
  });
};
/**
 * 上传文件
 * @param file - 要上传的文件
 * @param folder - 所存放的文件夹，如果你的服务器没有该配置，则不需要传
 */
// const uploadFile = async (file: any, folder = "video") => {
// const formData = new FormData();
// formData.append("file", file);
// formData.append("accept", folder);

// 注：此为调用后端上传接口，需根据实际情况进行调整
// const { data } = await axios({
//   method: "POST",
//   url: "/api/v1/upload",
//   data: formData,
//   headers: { "Content-Type": "multipart/form-data" },
// });

// return {
//   url: data.url,
//   name: file.name,
// };
//   return {
//     url: "",
//     name: "",
//   };
// };
</script>

<template>
  <el-space fill>
    <el-card shadow="never">
      <template #header>
        <el-link href="https://www.tiny.cloud/" target="_blank" underline="never" style="font-size: 20px">
          Tinymce 富文本
        </el-link>
      </template>

      <el-button type="primary" @click="handleDisabled" style="margin-bottom: 20px">
        {{ disabled ? "启动编辑器" : "禁用编辑器" }}
      </el-button>
      <el-button type="primary" @click="handleTheme" style="margin-bottom: 20px">
        {{ theme === "default" ? "暗色主题" : "默认主题" }}
      </el-button>
      <Tinymce
        v-if="tinymceActive"
        v-model="content"
        :height="400"
        :disabled="disabled"
        :lang="language"
        :theme="theme"
        @img-upload="handleImgUpload"
        @file-upload="handleFileUpload"
      />
    </el-card>

    <el-card shadow="never" header="实时预览">
      <div v-html="content"></div>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="v-model">编辑器内容。`string` 类型，必传</el-descriptions-item>
        <el-descriptions-item label="disabled">编辑器是否禁用。`boolean` 类型，默认 `false`</el-descriptions-item>
        <el-descriptions-item label="theme">UI 主题。`UITheme` 类型，默认 `default`</el-descriptions-item>
        <el-descriptions-item label="contentTheme">
          内容区主题，如果不传，默认等于 UI 主题。`ContentTheme` 类型，默认 `""`
        </el-descriptions-item>
        <el-descriptions-item label="id">
          编辑器 id。`string` 类型。默认 `"vue3-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + "")`
        </el-descriptions-item>
        <el-descriptions-item label="menubar">
          菜单区配置项。`string` 类型，默认 `"file edit view insert format tools table help"`
        </el-descriptions-item>
        <el-descriptions-item label="toolbar">工具区配置项。`string[]` 类型，默认 `[]`</el-descriptions-item>
        <el-descriptions-item label="height">编辑器高度。`string | number` 类型，默认 `360`</el-descriptions-item>
        <el-descriptions-item label="width">编辑器宽度。`string | number` 类型，默认 `"auto"`</el-descriptions-item>
        <el-descriptions-item label="lang">编辑器语言。`string` 类型，默认 `"zh-CN"`</el-descriptions-item>
        <el-descriptions-item label="move">
          true：编辑器可以垂直移动；false：编辑器无法移动；both：编辑器垂直和水平都可以移动。`true | false | "both"`
          类型，默认 `true`
        </el-descriptions-item>
        <el-descriptions-item label="tinymceProps">
          编辑器额外的配置项。`Recordable` 类型，默认 `{}`
        </el-descriptions-item>
        <el-descriptions-item label="bodyClass">编辑器内自定义 class。`string` 类型，默认 `""`</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="Emits 事件 📚" :column="1" border>
        <el-descriptions-item label="imgUpload">
          图片上传事件。 `(blobInfo: Function, resolve: (url: url) => void, reject: (value: unknown) => void, progress:
          Function) => void` 类型。处理完图片上传后，需要调用 resolve 函数传入图片的链接到富文本里
        </el-descriptions-item>
        <el-descriptions-item label="fileUpload">
          附件上传事件。 `(file: File, filetype: "image" | "media" | "file", callback: (url: string) => void) => void`
          类型。处理完文件上传后，需要调用 callback 函数传入文件的链接到富文本里
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>
