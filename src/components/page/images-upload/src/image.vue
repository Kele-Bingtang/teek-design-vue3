<script setup lang="ts">
import type { FileTypes, ImageUploadEmits, ImageUploadProps } from "./types";
import type { UploadFile, UploadProps, UploadRequestOptions, UploadUserFile } from "element-plus";
import { ref, inject, computed, useId } from "vue";
import { ElUpload, ElImageViewer, ElIcon, ElNotification, formContextKey, formItemContextKey } from "element-plus";
import { Edit, ZoomIn, Delete, Plus } from "@element-plus/icons-vue";
import { isArray } from "@/common/utils";
import { useNamespace } from "@/composables";

defineOptions({ name: "ImageUpload" });

const ns = useNamespace("image-upload");

const props = withDefaults(defineProps<ImageUploadProps>(), {
  drag: true,
  disabled: false,
  fileSize: 5,
  fileType: () => ["image/jpeg", "image/png", "image/gif"],
  height: "150px",
  width: "150px",
  borderRadius: "8px",
  limit: 5,
});

const emits = defineEmits<ImageUploadEmits>();

// 生成组件唯一 id
const uuid = ref("id-" + useId());

// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0);

// 判断是否禁用上传和删除
const disabled = computed(() => {
  return props.disabled ?? formContext?.disabled ?? false;
});

const imageUrl = defineModel<string | UploadUserFile[]>({ required: true });

const isMultiple = (imageUrl: string | UploadUserFile[]) => isArray(imageUrl);

/**
 * 文件上传之前判断
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

/**
 * 图片上传
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

/**
 * 图片上传成功
 * @param fileUrl 图片链接
 */
const uploadSuccess = (fileUrl: string, uploadFile: UploadFile) => {
  if (!fileUrl) return;
  if (!isMultiple(imageUrl.value)) imageUrl.value = fileUrl;
  else uploadFile.url = fileUrl;

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
 * 删除图片
 * */
const handleRemove = (uploadFile?: UploadFile) => {
  if (!isMultiple(imageUrl.value)) imageUrl.value = "";
  else if (uploadFile) {
    imageUrl.value = (imageUrl.value as UploadUserFile[]).filter(
      item => item.url !== uploadFile.url || item.name !== uploadFile.name
    );
  }
};

/**
 * 编辑图片
 */
const handleEdit = () => {
  const dom = document.querySelector(`#${uuid.value} .${ns.joinEl("upload__input")}`);
  dom && dom.dispatchEvent(new MouseEvent("click"));
};

/**
 * 图片上传错误提示
 */
const uploadError = () => {
  ElNotification({
    title: "温馨提示",
    message: "图片上传失败，请您重新上传！",
    type: "error",
  });
};

/**
 * 文件数超出提示
 */
const handleExceed = () => {
  ElNotification({
    title: "温馨提示",
    message: `当前最多只能上传 ${props.limit} 张图片，请移除后上传！`,
    type: "warning",
  });
};

const viewImageUrl = ref("");
const imgViewVisible = ref(false);

/**
 * 图片预览
 */
const handlePreview = (imageUrl: string) => {
  viewImageUrl.value = imageUrl;
  imgViewVisible.value = true;
};
</script>

<template>
  <div
    :class="ns.b()"
    :style="{
      '--image-upload-width': width,
      '--image-upload-height': height,
      '--image-upload-border-radius': borderRadius,
    }"
  >
    <!-- 单图片上传 -->
    <el-upload
      v-if="!isMultiple(imageUrl)"
      action="#"
      :id="uuid"
      :multiple="false"
      :disabled
      :show-file-list="false"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :drag="drag"
      :accept="fileType.join(',')"
      v-bind="$attrs"
      :class="[ns.is('disabled', disabled), ns.no('border', drag)]"
      class="upload"
    >
      <template v-if="imageUrl">
        <img :src="imageUrl" :class="ns.e('image')" />

        <div :class="ns.e('handle')" @click.stop>
          <div v-if="!disabled" :class="ns.em('handle', 'icon')" @click="handleEdit">
            <el-icon><Edit /></el-icon>
            <span>编辑</span>
          </div>

          <div :class="ns.em('handle', 'icon')" @click="handlePreview(imageUrl)">
            <el-icon><ZoomIn /></el-icon>
            <span>查看</span>
          </div>

          <div v-if="!disabled" :class="ns.em('handle', 'icon')" @click="handleRemove()">
            <el-icon><Delete /></el-icon>
            <span>删除</span>
          </div>
        </div>
      </template>

      <template v-else>
        <div :class="ns.e('empty')">
          <slot name="empty">
            <el-icon><Plus /></el-icon>
          </slot>
        </div>
      </template>
    </el-upload>

    <!-- 多图片上传 -->
    <el-upload
      v-else
      action="#"
      list-type="picture-card"
      v-model:file-list="imageUrl"
      multiple
      :disabled
      :limit="limit"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :drag="drag"
      :accept="fileType.join(',')"
      v-bind="$attrs"
      :class="['upload', ns.is('disabled', disabled), ns.no('border', drag)]"
    >
      <template #file="{ file }">
        <img :src="file.url" :class="ns.e('image')" />

        <div :class="ns.e('handle')" @click.stop>
          <div :class="ns.em('handle', 'icon')" @click="handlePreview(file.url || '')">
            <el-icon><ZoomIn /></el-icon>
            <span>查看</span>
          </div>

          <div v-if="!disabled" :class="ns.em('handle', 'icon')" @click="handleRemove(file)">
            <el-icon><Delete /></el-icon>
            <span>删除</span>
          </div>
        </div>
      </template>

      <div :class="ns.e('empty')">
        <slot name="empty">
          <el-icon><Plus /></el-icon>
        </slot>
      </div>
    </el-upload>

    <div :class="ns.joinEl('upload__tip')">
      <slot name="tip"></slot>
    </div>
    <el-image-viewer v-if="imgViewVisible" @close="imgViewVisible = false" :url-list="[viewImageUrl]" />
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
