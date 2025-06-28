<script setup lang="ts" name="Cropper">
import { ElMessage, ElButton, type UploadRequestOptions } from "element-plus";
import { VueCropper } from "vue-cropper";
import "vue-cropper/dist/index.css";
import { Upload, ZoomIn, ZoomOut, Download } from "@element-plus/icons-vue";
import { toRefs, ref, reactive, onMounted } from "vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "Cropper" });

const ns = useNamespace("cropper");

interface CropperProps {
  imgLink?: string; // 图片链接
  imageType?: "blob" | "base64"; // 图片类型
  cropWidth?: number; // 截图框宽度
  cropHeight?: number; // 截图框高度
  cropContainerHeight?: number; // 截图容器高度
}

const props = withDefaults(defineProps<CropperProps>(), {
  imgLink: "",
  imageType: "blob",
  cropWidth: 200,
  cropHeight: 200,
  cropContainerHeight: 350,
});

type CropperEmitProps = {
  uploadImage: [formData: FormData]; // 图片上传回调
  imgMoving: []; // 图片移动事件
  cropMoving: []; // 图片剪切事件
};

const emits = defineEmits<CropperEmitProps>();

const { imgLink, imageType, cropWidth, cropHeight, cropContainerHeight } = toRefs(props);

// 缩略图对象
const previews = ref({
  div: {
    height: "",
    width: "",
  },
  html: "",
  img: {
    height: "",
    transform: "",
    width: "",
  },
  url: "",
  w: 0,
  h: 0,
});
const options = reactive({
  img: "", // 图片地址
  outputSize: 1, // 裁剪生成图片的质量
  outputType: "png", // 裁剪生成图片的格式（下载）
  info: true, // 裁剪框的大小信息
  canScale: false, // 图片是否允许滚轮缩放
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixedNumber: [1, 1], // 截图框的宽高比例
  fixedBox: false, // 固定截图框大小 不允许改变
  fixed: false, // 是否开启截图框宽高固定比例
  canMove: true, // 上传图片是否可以移动
  canMoveBox: true, // 截图框能否拖动
  original: false, // 上传图片按照原始比例渲染
  centerBox: true, // 截图框是否被限制在图片里面
  infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  full: true, // 是否输出原图比例的截图
  enlarge: "1", // 图片根据截图框输出比例倍数
  mode: "contain", // 图片默认渲染方式
});

const cropperInstance = useTemplateRef("cropperInstance");

onMounted(() => {
  options.autoCropWidth = cropWidth.value || 200;
  options.autoCropHeight = cropHeight.value || 200;
  options.img = imgLink.value || "";
});

// 实时缩略图的回调
const realTime = (image: any) => {
  previews.value = image;
};
// 上传图片前的校验
const beforeUpload = (file: File) => {
  if (file.type.indexOf("image/") === -1) {
    ElMessage.error("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件");
  } else {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      options.img = reader.result as string; // Base64
    };
  }
};

const imgLoad = (res: "success" | "error") => {
  if (res === "error") ElMessage.error("图片上传失败");
};

const uploadImage = () => {
  const formData = new FormData();
  if (imageType.value === "blob") {
    cropperInstance.value.getCropBlob((data: Blob) => {
      const timer = new Date().getTime();
      formData.append("file", data, timer + ".png");
      emits("uploadImage", formData);
    });
  } else if (imageType.value === "base64") {
    cropperInstance.value.getCropData((data: string) => {
      formData.append("images", data);
      emits("uploadImage", formData);
    });
  } else {
    ElMessage.error("图片类型错误！请传入 blob 或者 base64");
  }
};

const downloadImg = (type?: string) => {
  const aLink = document.createElement("a");
  const timer = new Date().getTime();
  aLink.download = timer + ""; // 文件名
  if (type === "blob") {
    // 获取截图的 blob 数据
    cropperInstance.value.getCropBlob((data: Blob) => {
      aLink.href = window.URL.createObjectURL(data); // 生成 blob 格式图片路径
      aLink.click();
    });
  } else {
    // 获取截图的 base64 数据
    cropperInstance.value.getCropData((data: string) => {
      aLink.href = data;
    });
  }
};

const rotateLeft = () => {
  cropperInstance.value.rotateLeft();
};

const rotateRight = () => {
  cropperInstance.value.rotateRight();
};

const changeScale = (num: number) => {
  cropperInstance.value.changeScale(num);
};

// 手动上传的回调，目前为了取消自动上传
const handleHttpRequest = (options: UploadRequestOptions): Promise<any> => {
  return new Promise(resolve => {
    resolve(options);
  });
};
</script>

<template>
  <div :class="ns.b()" :style="{ height: cropContainerHeight + 'px' }">
    <div :class="ns.e('box')">
      <VueCropper
        ref="cropperInstance"
        :img="options.img"
        :output-size="options.outputSize"
        :output-type="options.outputType"
        :info="options.info"
        :full="options.full"
        :auto-crop="options.autoCrop"
        :auto-crop-width="options.autoCropWidth"
        :auto-crop-height="options.autoCropHeight"
        :fixed-box="options.fixedBox"
        :can-move="options.canMove"
        :can-move-nox="options.canMoveBox"
        :original="options.original"
        :enlarge="options.enlarge"
        @real-time="realTime"
        @img-load="imgLoad"
        @img-moving="emits('imgMoving')"
        @crop-moving="emits('cropMoving')"
      />
    </div>
    <div :class="[ns.e('box'), ns.e('previews')]" v-if="previews.url">
      <div :class="ns.em('previews', 'img')" :style="previews.div">
        <img :src="previews.url" :style="previews.img" class="img" alt="头像" />
      </div>
    </div>
  </div>

  <div :class="ns.e('btn')">
    <el-upload
      action="#"
      :http-request="handleHttpRequest"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :class="ns.em('btn', 'upload')"
    >
      <el-button type="primary" plain :icon="Upload">选择</el-button>
    </el-upload>
    <el-button type="primary" plain :icon="ZoomIn" @click="changeScale(1)">放大</el-button>
    <el-button type="primary" plain :icon="ZoomOut" @click="changeScale(-1)">缩小</el-button>
    <el-button type="primary" plain @click="rotateLeft">↺ 左旋转</el-button>
    <el-button type="primary" plain @click="rotateRight">↻ 右旋转</el-button>
    <el-button type="primary" plain :icon="Download" @click="downloadImg('blob')">下载</el-button>
    <el-button type="primary" :icon="Upload" @click="uploadImage" :class="ns.em('btn', 'submit')">提交</el-button>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(cropper) {
  display: flex;

  @include e(box) {
    position: relative;
    width: 50%;
    height: 100%;
  }

  @include e(previews) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 10px;
    overflow: hidden;

    @include m(img) {
      overflow: hidden;
      border-radius: 50%;
      box-shadow: 0 0 4px #cccccc;
    }
  }
}

@include e(btn) {
  display: flex;
  gap: 20px;
  margin-top: 30px;

  @include el-joins(button) {
    margin-left: 0;
  }
}
</style>
