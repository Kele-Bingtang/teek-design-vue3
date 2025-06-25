<script setup lang="ts">
import { Boot, type IEditorConfig, type IDomEditor } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import attachmentModule from "@wangeditor/plugin-upload-attachment"; // wangeditor 的附件插件
import "@wangeditor/editor/dist/css/style.css";
import { toolbarKeys as toolbarKeysConfig } from "./config";
import { onMounted, watch, onBeforeUnmount, computed, shallowRef, reactive } from "vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "WangEditor" });

const ns = useNamespace("wang-editor");

export type ImageInsertFnType = (url: string, alt: string) => void;
export type VideoInsertFnType = (url: string, poster: string) => void;
export type FileInsertFnType = (fileName: string, url: string) => void;

interface WangEditorProp {
  toolbarKeys?: string[]; // 工具栏内容 ==> 非必传（默认为空）
  excludeKeys?: string[]; // 去除掉指定的工具类内容 ==> 非必传（默认为空）
  height?: string; // 富文本高度 ==> 非必传（默认为 500px）
  mode?: "default" | "simple"; // 富文本模式 ==> 非必传（默认为 default）
  disabled?: boolean; // 是否禁用编辑器 ==> 非必传（默认为 false）
  hideToolBar?: boolean; // 是否隐藏工具栏 ==> 非必传（默认为 false）
}
type WangEditorEmits = {
  imageUpload: [file: File, insertFn: ImageInsertFnType];
  imageBeforeUpload: [file: File];
  imageProgress: [progress: number];
  imageSuccess: [file: File, res: any];
  imageFailed: [file: File, res: any];
  imageError: [file: File, err: any, res: any];
  videoUpload: [file: File, insertFn: VideoInsertFnType];
  fileBeforeUpload: [file: File];
  fileUpload: [file: File, insertFn: FileInsertFnType];
  onPaste: [editor: IDomEditor, event: ClipboardEvent];
  onCreated: [editor: IDomEditor];
};

const props = withDefaults(defineProps<WangEditorProp>(), {
  toolbarKeys: () => [],
  excludeKeys: () => [],
  height: "400px",
  mode: "default",
  disabled: false,
  hideToolBar: false,
});

const emits = defineEmits<WangEditorEmits>();

const content = defineModel<string>({ default: "" });

// 富文本 DOM 元素
const editorRef = shallowRef();

const editorConfig = reactive<Partial<IEditorConfig>>({
  placeholder: "请输入内容 ...",
  readOnly: props.disabled, // 是否编辑编辑器
  // hoverbarKeys: {
  //   image: {
  //     // 图片选题菜单
  //     menuKeys: [
  //       "imageWidth30",
  //       "imageWidth50",
  //       "imageWidth100",
  //       "editImage",
  //       "viewImageLink",
  //       "deleteImage",
  //       "|",
  //       "justifyLeft",
  //       "justifyRight",
  //       "justifyCenter",
  //     ],
  //   },
  //   attachment: {
  //     menuKeys: ["downloadAttachment"], // 下载附件菜单
  //   },
  //   paragraph: {
  //     menuKeys: ["uploadImage"],
  //   },
  // },
  MENU_CONF: {
    // 配置上传图片
    uploadImage: {
      // 单个文件的最大体积限制，默认为 2M
      maxFileSize: 10 * 1024 * 1024, // 10M
      // 最多可上传几个文件，默认为 100
      // maxNumberOfFiles: 10,
      // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      allowedFileTypes: ["image/*"],
      // 自定义上传
      customUpload: (file: File, insertFn: ImageInsertFnType) => {
        emits("imageUpload", file, insertFn);
      },
      onBeforeUpload: (file: File) => {
        emits("imageBeforeUpload", file);
      },
      onProgress: (progress: number) => {
        emits("imageProgress", progress);
      },
      onSuccess: (file: File, res: any) => {
        emits("imageSuccess", file, res);
      },
      onFailed: (file: File, res: any) => {
        emits("imageFailed", file, res);
      },
      onError: (file: File, err: any, res: any) => {
        emits("imageError", file, err, res);
      },
    },
    uploadVideo: {
      // 300M
      maxFileSize: 300 * 1024 * 1024,
      allowedFileTypes: ["video/*"],
      customUpload: (file: File, insertFn: VideoInsertFnType) => {
        emits("videoUpload", file, insertFn);
      },
    },
    uploadAttachment: {
      // 10M
      maxFileSize: 10 * 1024 * 1024,
      onBeforeUpload: (file: File) => {
        emits("fileBeforeUpload", file);
      },
      customUpload: (file: File, insertFn: VideoInsertFnType) => {
        emits("fileUpload", file, insertFn);
      },
    },
  },
});

const toolbarConfig = computed(() => {
  return {
    toolbarKeys: props.toolbarKeys.length > 0 ? props.toolbarKeys : toolbarKeysConfig, // 工具栏内容
    excludeKeys: props.excludeKeys, // 去除掉指定的工具类内容3
    // 插入哪些菜单
    insertKeys: {
      index: 22, // 自定义插入的位置
      keys: ["uploadAttachment"], // 上传附件菜单
    },
    // excludeKeys: ["group-video", "insertImage"],
  };
});

watch(
  () => props.disabled,
  () => {
    if (editorRef.value) {
      props.disabled ? editorRef.value.disable() : editorRef.value.enable();
    }
  }
);

onMounted(() => {
  try {
    Boot.registerModule(attachmentModule);
  } catch {
    /* empty */
  }
});

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
  props.disabled ? editorRef.value.disable() : editorRef.value.enable();
  emits("onCreated", editor);
};

const handlePaste = (editor: IDomEditor, event: ClipboardEvent) => {
  emits("onPaste", editor, event);
};

onBeforeUnmount(() => {
  if (!editorRef.value) return;
  editorRef.value.destroy(); // 组件销毁时，及时销毁编辑器
});

defineExpose({
  editor: editorRef,
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
      :style="{ height: typeof height == 'string' ? height : `${height}px`, overflowY: 'hidden' }"
      v-model="content"
      :defaultConfig="editorConfig"
      :mode="mode"
      v-bind="$attrs"
      @on-created="handleCreated"
      @custom-paste="handlePaste"
    />
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

/* 富文本组件校验失败样式 */
.is-error {
  @include b(wang-editor) {
    border-color: var(--#{$el-namespace}-color-danger);
  }
}

/* 富文本组件样式 */
@include b(wang-editor) {
  /* 防止富文本编辑器全屏时 tabs 组件 在其层级之上 */
  z-index: 1100;
  width: 100%;
  border: 1px solid #cccccc;

  /* 富文本组件禁用样式 */
  &.disabled {
    cursor: not-allowed !important;
  }

  @include e(toolbar) {
    border-bottom: 1px solid #cccccc;
  }

  @include e(content) {
    overflow-y: hidden;
  }
}
</style>
