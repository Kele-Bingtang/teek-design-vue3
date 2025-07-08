<script setup lang="ts">
import type { ImageInsertFnType, VideoInsertFnType, WangEditorEmits, WangEditorProp } from "./types";
import { onMounted, watch, onBeforeUnmount, computed, shallowRef, reactive } from "vue";
import type { IEditorConfig, IDomEditor } from "@wangeditor/editor";
import { Boot } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import attachmentModule from "@wangeditor/plugin-upload-attachment"; // wangeditor 的附件插件
import { toolbarKeys as toolbarKeysConfig } from "./config";
import { useNamespace } from "@/composables";

import "@wangeditor/editor/dist/css/style.css";

defineOptions({ name: "WangEditor" });

const ns = useNamespace("wang-editor");

const props = withDefaults(defineProps<WangEditorProp>(), {
  toolbarKeys: () => [],
  excludeKeys: () => [],
  height: "400px",
  mode: "default",
  disabled: false,
  hideToolBar: false,
  placeholder: "请输入内容 ...",
  uploadConfig: () => ({}),
});

const emits = defineEmits<WangEditorEmits>();

const content = defineModel<string>({ default: "" });

// 富文本 DOM 元素
const editorRef = shallowRef();

// 富文本编辑器配置
const editorConfig = reactive<Partial<IEditorConfig>>({
  placeholder: props.placeholder,
  readOnly: props.disabled, // 是否编辑编辑器
  MENU_CONF: {
    // 配置上传图片
    uploadImage: {
      maxFileSize: 10 * 1024 * 1024,
      maxNumberOfFiles: 10,
      allowedFileTypes: ["image/*"],
      ...props.uploadConfig,
      /**
       * 自定义上传图片
       */
      customUpload: (file: File, insertFn: ImageInsertFnType) => {
        emits("imageUpload", file, insertFn);
      },
      /**
       * 上传图片前事件
       */
      onBeforeUpload: (file: File) => {
        emits("imageBeforeUpload", file);
      },
      /**
       * 上传图片进度事件
       */
      onProgress: (progress: number) => {
        emits("imageProgress", progress);
      },
      /**
       * 上传图片成功事件
       */
      onSuccess: (file: File, res: any) => {
        emits("imageSuccess", file, res);
      },
      /**
       * 上传图片失败事件
       */
      onFailed: (file: File, res: any) => {
        emits("imageFailed", file, res);
      },
      /**
       * 上传图片错误事件
       */
      onError: (file: File, err: any, res: any) => {
        emits("imageError", file, err, res);
      },
    },
    uploadVideo: {
      maxFileSize: 300 * 1024 * 1024,
      allowedFileTypes: ["video/*"],
      ...props.uploadConfig,
      /**
       * 自定义上传视频
       */
      customUpload: (file: File, insertFn: VideoInsertFnType) => {
        emits("videoUpload", file, insertFn);
      },
    },
    uploadAttachment: {
      maxFileSize: 10 * 1024 * 1024,
      ...props.uploadConfig,
      /**
       * 自定义上传附件
       */
      customUpload: (file: File, insertFn: VideoInsertFnType) => {
        emits("fileUpload", file, insertFn);
      },
      /**
       * 上传附件前事件
       */
      onBeforeUpload: (file: File) => {
        emits("fileBeforeUpload", file);
      },
    },
  },
});

// 富文本工具栏配置
const toolbarConfig = computed(() => {
  return {
    toolbarKeys: props.toolbarKeys.length > 0 ? props.toolbarKeys : toolbarKeysConfig, // 工具栏内容
    excludeKeys: props.excludeKeys, // 去除掉指定的工具类内容
    // 插入哪些菜单
    insertKeys: {
      index: 22,
      keys: ["uploadAttachment"],
    },
    // excludeKeys: ["group-video", "insertImage"],
  };
});

watch(
  () => props.disabled,
  newValue => {
    if (editorRef.value) {
      newValue ? editorRef.value.disable() : editorRef.value.enable();
    }
  }
);

/**
 * 创建富文本事件
 */
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
  props.disabled ? editorRef.value.disable() : editorRef.value.enable();
  emits("onCreated", editor);
};

/**
 * 粘贴事件
 */
const handlePaste = (editor: IDomEditor, event: ClipboardEvent) => {
  emits("onPaste", editor, event);
};

onMounted(() => {
  try {
    Boot.registerModule(attachmentModule);
  } catch {
    /* empty */
  }
});

onBeforeUnmount(() => {
  if (!editorRef.value) return;
  // 组件销毁时，及时销毁编辑器
  editorRef.value.destroy();
});

defineExpose({
  /** 获取编辑器实例 */
  editor: editorRef,
  /** 设置编辑器内容 */
  setHtml: (html: string) => editorRef.value?.setHtml(html),
  /** 获取编辑器内容 */
  getHtml: () => editorRef.value?.getHtml(),
  /** 清空编辑器 */
  clear: () => editorRef.value?.clear(),
  /** 聚焦编辑器 */
  focus: () => editorRef.value?.focus(),
});
</script>

<template>
  <div :class="[ns.b(), { disabled }]">
    <Toolbar
      :class="ns.e('toolbar')"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      v-if="!hideToolBar"
    />
    <Editor
      :class="ns.e('content')"
      :style="{ height: typeof height == 'string' ? height : `${height}px` }"
      v-model="content"
      :defaultConfig="editorConfig"
      :mode="mode"
      v-bind="$attrs"
      @on-created="handleCreated"
      @custom-paste="handlePaste"
    />
  </div>
</template>

<style lang="scss">
@use "./index";
</style>
