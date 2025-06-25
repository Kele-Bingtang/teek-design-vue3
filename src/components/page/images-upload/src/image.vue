<script setup lang="ts">
import { useSimpleUuid } from "@/common/utils";
import {
  ElUpload,
  ElImageViewer,
  ElIcon,
  ElNotification,
  formContextKey,
  formItemContextKey,
  type UploadProps,
  type UploadRequestOptions,
} from "element-plus";
import { Edit, ZoomIn, Delete, Plus } from "@element-plus/icons-vue";
import { ref, inject, computed } from "vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "ImgUpload" });

const ns = useNamespace("image-upload");

export type SuccessFun = (response: string) => void;

type FileTypes =
  | "image/apng"
  | "image/bmp"
  | "image/gif"
  | "image/jpeg"
  | "image/pjpeg"
  | "image/png"
  | "image/svg+xml"
  | "image/tiff"
  | "image/webp"
  | "image/x-icon";

interface ImageUploadProps {
  api?: (params: any) => Promise<any>; // 上传图片的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可 ==> 非必传
  drag?: boolean; // 是否支持拖拽上传 ==> 非必传（默认为 true）
  disabled?: boolean; // 是否禁用上传组件 ==> 非必传（默认为 false）
  fileSize?: number; // 图片大小限制 ==> 非必传（默认为 5M）
  fileType?: FileTypes[]; // 图片类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
  height?: string; // 组件高度 ==> 非必传（默认为 150px）
  width?: string; // 组件宽度 ==> 非必传（默认为 150px）
  borderRadius?: string; // 组件边框圆角 ==> 非必传（默认为 8px）
}

// 接受父组件参数
const props = withDefaults(defineProps<ImageUploadProps>(), {
  drag: true,
  disabled: false,
  fileSize: 5,
  fileType: () => ["image/jpeg", "image/png", "image/gif"],
  height: "150px",
  width: "150px",
  borderRadius: "8px",
});

// 生成组件唯一id
const uuid = ref("id-" + useSimpleUuid());

// 查看图片
const imgViewVisible = ref(false);
// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0);
// 判断是否禁用上传和删除
const self_disabled = computed(() => {
  return props.disabled || formContext?.disabled;
});

const emits = defineEmits<{
  uploadImg: [file: File, callback: SuccessFun];
  checkValidate: [];
}>();

const imageUrl = defineModel<string>({ required: true });

/**
 * @description 图片上传
 * @param options 上传的文件
 * */
const handleHttpUpload = async (options: UploadRequestOptions) => {
  try {
    // 如果父组件传入 api，则走该 api，否则走 @upload-img
    if (props.api) {
      const formData = new FormData();
      formData.append("file", options.file);
      const res = await props.api(formData);
      emits("uploadImg", res, options.onSuccess);
    } else emits("uploadImg", options.file, options.onSuccess);
  } catch (error) {
    options.onError(error as any);
  }
};

const uploadSuccess = (fileUrl: string) => {
  if (!fileUrl) return;
  imageUrl.value = fileUrl;
  // 调用 el-form 内部的校验方法（可自动校验）
  formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
  emits("checkValidate");
  ElNotification({
    title: "温馨提示",
    message: "图片上传成功！",
    type: "success",
  });
};

/**
 * @description 删除图片
 * */
const deleteImg = () => {
  imageUrl.value = "";
};

/**
 * @description 编辑图片
 * */
const editImg = () => {
  const dom = document.querySelector(`#${uuid.value} .${ns.elNamespace}-upload__input`);
  dom && dom.dispatchEvent(new MouseEvent("click"));
};

/**
 * @description 文件上传之前判断
 * @param rawFile 上传的文件
 * */
const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize;
  const imgType = props.fileType;
  if (!imgType.includes(rawFile.type as FileTypes)) {
    ElNotification({
      title: "温馨提示",
      message: "上传图片不符合所需的格式！",
      type: "warning",
    });
  }
  if (!imgSize) {
    ElNotification({
      title: "温馨提示",
      message: `上传图片大小不能超过 ${props.fileSize}M！`,
      type: "warning",
    });
  }

  return imgType.includes(rawFile.type as FileTypes) && imgSize;
};

// 图片上传错误提示
const uploadError = () => {
  ElNotification({
    title: "温馨提示",
    message: "图片上传失败，请您重新上传！",
    type: "error",
  });
};
</script>

<template>
  <div :class="ns.b()">
    <el-upload
      action="#"
      :id="uuid"
      :class="[ns.e('upload'), self_disabled ? 'disabled' : '', drag ? 'no-border' : '']"
      :multiple="false"
      :disabled="self_disabled"
      :show-file-list="false"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :drag="drag"
      :accept="fileType.join(',')"
    >
      <template v-if="imageUrl">
        <img :src="imageUrl" :class="ns.e('image')" />
        <div :class="ns.e('handle')" @click.stop>
          <div :class="ns.em('handle', 'icon')" @click="editImg" v-if="!self_disabled">
            <el-icon><Edit /></el-icon>
            <span>编辑</span>
          </div>
          <div :class="ns.em('handle', 'icon')" @click="imgViewVisible = true">
            <el-icon><ZoomIn /></el-icon>
            <span>查看</span>
          </div>
          <div :class="ns.em('handle', 'icon')" @click="deleteImg" v-if="!self_disabled">
            <el-icon><Delete /></el-icon>
            <span>删除</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div :class="ns.e('empty')">
          <slot name="empty">
            <el-icon><Plus /></el-icon>
            <!-- <span>请上传图片</span> -->
          </slot>
        </div>
      </template>
    </el-upload>
    <div :class="`${ns.elNamespace}-upload__tip`">
      <slot name="tip"></slot>
    </div>
    <el-image-viewer v-if="imgViewVisible" @close="imgViewVisible = false" :url-list="[imageUrl]" />
  </div>
</template>

<style lang="scss" scoped>
$prefix-class: #{$admin-namespace}-image-upload;

.is-error {
  .upload {
    :deep(.#{$el-namespace}-upload),
    :deep(.#{$el-namespace}-upload-dragger) {
      border: 1px dashed var(--#{$el-namespace}-color-danger) !important;

      &:hover {
        border-color: var(--#{$el-namespace}-color-primary) !important;
      }
    }
  }
}

// #{$el-namespace} 默认为 el，如果组件迁移到其他项目，且项目架构与此项目不同，则请修改 #{$el-namespace} 为 el
:deep(.#{$prefix-class}__upload.disabled) {
  .#{$el-namespace}-upload,
  .#{$el-namespace}-upload-dragger {
    cursor: not-allowed !important;
    background: var(--#{$el-namespace}-disabled-bg-color);
    border: 1px dashed var(--#{$el-namespace}-border-color-darker) !important;

    &:hover {
      border: 1px dashed var(--#{$el-namespace}-border-color-darker) !important;
    }
  }
}

.#{$prefix-class} {
  .#{$prefix-class}__upload.no-border {
    :deep(.#{$el-namespace}-upload) {
      border: none !important;
    }
  }

  :deep(.#{$prefix-class}__upload) {
    .#{$el-namespace}-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: v-bind(width);
      height: v-bind(height);
      overflow: hidden;
      border: 1px dashed var(--#{$el-namespace}-border-color-darker);
      border-radius: v-bind(borderRadius);
      transition: var(--#{$el-namespace}-transition-duration-fast);

      &:hover {
        border-color: var(--#{$el-namespace}-color-primary);

        .upload-handle {
          opacity: 1;
        }
      }

      .#{$el-namespace}-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        background-color: transparent;
        border: 1px dashed var(--#{$el-namespace}-border-color-darker);
        border-radius: v-bind(borderRadius);

        &:hover {
          border: 1px dashed var(--#{$el-namespace}-color-primary);
        }
      }

      .#{$el-namespace}-upload-dragger.is-dragover {
        background-color: var(--#{$el-namespace}-color-primary-light-9);
        border: 2px dashed var(--#{$el-namespace}-color-primary) !important;
      }

      .#{$prefix-class}__image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .#{$prefix-class}__handle {
        position: absolute;
        top: 0;
        right: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgb(0 0 0 / 60%);
        opacity: 0;
        transition: var(--#{$el-namespace}-transition-duration-fast);

        &--icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          color: aliceblue;

          .#{$el-namespace}-icon {
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }

          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }

  .#{$prefix-class}__empty {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    line-height: 30px;
    color: var(--#{$el-namespace}-color-info);

    .#{$el-namespace}-icon {
      font-size: 28px;
      color: var(--#{$el-namespace}-text-color-secondary);
    }
  }

  .#{$el-namespace}-upload__tip {
    line-height: 18px;
    text-align: center;
  }
}
</style>
