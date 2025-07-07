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
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

$border-radius: 6px;

/* 富文本组件校验失败样式 */
.is-error {
  @include b(wang-editor) {
    border-color: cssVarEl(color-danger);
  }
}

/* 富文本组件样式 */
@include b(wang-editor) {
  /* 激活颜色 */
  --w-e-toolbar-active-bg-color: rgb(var(--#{$admin-namespace}-gray-200-rgb), 0.4);

  /* toolbar 图标和文字颜色 */
  --w-e-toolbar-color: #000000;

  /* 表格选中时候的边框颜色 */
  --w-e-textarea-selected-border-color: var(--#{$admin-namespace}-color-primary);

  /* 表格头背景颜色 */
  --w-e-textarea-slight-bg-color: var(--#{$admin-namespace}-gray-200);

  z-index: 1100;
  width: 100%;
  height: 100%;
  border: 1px solid cssVar(gray-300);
  border-radius: calc(cssVar(radius) / 2 + 2px);

  /* 富文本组件禁用样式 */
  &.disabled {
    cursor: not-allowed;
  }

  @include e(toolbar) {
    border-bottom: 1px solid cssVar(gray-300);
  }

  .w-e-bar {
    border-radius: $border-radius;
  }

  /* 下拉选择框配置 */
  .w-e-select-list {
    padding: 6px;
    border: none;
  }

  /* 下拉选择框元素配置 */
  .w-e-select-list ul li {
    padding: 5px 16px;
    margin-top: 5px;
    font-size: 15px;
    border-radius: $border-radius;

    &:hover {
      background-color: cssVar(gray-100);
    }

    &.selected {
      background-color: cssVar(gray-100);

      /** 隐藏勾选图标 */
      svg {
        display: none;
      }
    }
  }

  /* 工具栏按钮样式 */
  .w-e-bar-item button {
    border-radius: $border-radius;

    &:hover {
      background-color: cssVar(gray-200);
    }
  }

  /* 工具栏菜单 */
  .w-e-bar-item-group .w-e-bar-item-menus-container {
    border: none;
    border-radius: $border-radius;
  }

  /* 弹出框 */
  .w-e-drop-panel {
    border: 0;
    border-radius: $border-radius;
  }

  a {
    color: cssVarEl(color-primary);
  }

  /* 富文本编辑器内容区样式 */
  .w-e-text-container {
    border-radius: $border-radius;

    strong,
    b {
      font-weight: 500;
    }

    i,
    em {
      font-style: italic;
    }
  }

  .w-e-text-container [data-slate-editor] {
    /* 代码块 */
    pre > code {
      padding: 0.6rem 1rem;
      background-color: cssVar(gray-100);
      border-radius: $border-radius;
    }

    /* 表格样式优化 */
    .table-container th {
      border-right: none;

      &:last-of-type {
        border-right: 1px solid #cccccc;
      }
    }

    /* 引用 */
    blockquote {
      background-color: rgb(cssVar(gray-300-rgb), 0.25);
      border-left: 4px solid cssVar(gray-300);
    }

    /* 图片样式调整 */
    .w-e-selected-image-container {
      overflow: inherit;

      &:hover {
        border: 0;
        border: 1px solid cssVarEl(color-primary);
      }

      img {
        border: 1px solid transparent;
        transition: border 0.3s;

        &:hover {
          border: 1px solid cssVarEl(color-primary);
        }
      }

      .w-e-image-dragger {
        width: 12px;
        height: 12px;
        background-color: cssVarEl(color-primary);
        border: 1px solid #ffffff;
        border-radius: $border-radius;
      }
    }
  }

  /* 输入区域弹出 bar  */
  .w-e-hover-bar {
    border-radius: $border-radius;
  }

  /* 超链接弹窗 */
  .w-e-modal {
    border: none;
    border-radius: $border-radius;
  }
}
</style>
