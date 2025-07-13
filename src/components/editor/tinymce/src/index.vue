<script setup lang="ts" name="Tinymce">
import type { TinymceEmitProps, TinymceProps } from "./types";
import { ref, reactive, computed, onBeforeUnmount, watch, nextTick, useAttrs } from "vue";
import TinymceEditor from "@tinymce/tinymce-vue";
import { useNamespace } from "@/composables";
import { plugins, toolbar as toolbarConfig } from "./config";

import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";
import "./plugins-import";

defineOptions({ name: "Tinymce" });

const ns = useNamespace("tinymce");

const props = withDefaults(defineProps<TinymceProps>(), {
  disabled: false,
  theme: "default",
  contentTheme: "",
  id: () => "vue3-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + ""),
  menubar: "file edit view insert format tools table help",
  toolbar: toolbarConfig,
  toolbarMode: "sliding",
  width: "auto",
  height: 360,
  minHeight: 160,
  lang: "zh-CN",
  move: true,
  tinymceProps: () => ({}),
  bodyClass: "editor-body",
});

const emits = defineEmits<TinymceEmitProps>();

const tinymceContent = defineModel<string>({ default: "" });

const fullscreen = ref(false);

const languageTypeList = reactive<Recordable>({
  "zh-CN": "zh_CN",
  "en-US": "en_US",
  // 更多语言请看：https://www.tiny.cloud/get-tiny/language-packages/
});

const language = computed(() => languageTypeList[props.lang]);

const skinTheme = computed(() => {
  if (props.theme === "default") return "oxide";
  else if (props.theme === "dark") return "oxide-dark";

  return props.theme;
});

// 使用文档：https://www.tiny.cloud/docs/tinymce/latest/
const initOptions = computed(() => ({
  selector: `#${props.id}`,
  deprecation_warnings: false, // 去除再控制台展示的废弃 API 提示
  width: props.width, // 编辑器宽度
  height: props.height, // 编辑器高度
  min_height: props.minHeight, // 编辑器最小高度
  body_class: props.bodyClass, // 编辑器自定义 class
  resize: props.move, // 自动控制大小
  plugins: plugins, // 插件
  toolbar: props.toolbar, // 工具栏
  toolbar_mode: props.toolbarMode, // 工具栏溢出展示模式
  menubar: props.menubar, // 菜单栏
  language: language.value, // 语言
  promotion: false, // 去除右上角的 ⚡️Upgrade
  branding: false, // 去除左下角的 Tiny
  base_url: import.meta.env.VITE_PUBLIC_PATH === "/" ? "/tinymce" : `${import.meta.env.VITE_PUBLIC_PATH}/tinymce`, // 静态资源根路径
  skin: skinTheme.value, // 皮肤
  content_css: props.contentTheme ? props.contentTheme : props.theme, // 内容 CSS 文件
  end_container_on_empty_block: true, // 在空的内部块元素内按下 Enter 键时如何拆分当前容器块元素
  draggable_modal: true, // 对话框拖拽
  autosave_restore_when_empty: true, // 当编辑器在初始化时为空时，TinyMCE 是否应自动恢复存储在本地存储中的内容
  default_link_target: "_blank", // 新窗口打开链接
  link_title: false, // 链接插件配置项：禁用对话框中的链接输入字段
  fullscreen_native: true, // 全屏插件配置项：编辑器使用浏览器全屏模式，而不是仅在启用全屏模式时填充浏览器窗口
  nonbreaking_force_tab: true, // nonbreaking 插件配置项：按下键盘 tab 键时插入三个空格符
  insertdatetime_formats: ["%H:%M:%S", "%Y-%m-%d", "%I:%M:%S %p", "%D"], // 插入日期/时间插件配置项：插入的日期格式
  convert_urls: false, // URL 处理选项插件配置项：自动转换 URL
  paste_data_images: true, // 复制和粘贴插件配置项：允许复制图片
  images_file_types: "jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp", // 图片和文件选项插件：支持的上传图片类型
  /**
   * 模板插件配置项，7.x 版本移出免费插件，升级为付费插件
   */
  template_mdate_format: "%Y-%m-%d %H:%M:%S",
  templates: [
    {
      title: "当前时间",
      description: "当前时间模板",
      content: '<p class="mdate">例如：1999-07-27 07:27:27，当然以您目前的时间为准</p>',
    },
    {
      title: "您的身份",
      description: "您的身份模板，您的身份将会放在 ${} 里",
      content: "<p>Name: {$username}, EmployeeNo: {$employeeNo}</p>",
    },
    {
      title: "您的身份",
      description: "您的身份模板，这里仅是预览，输出后不是实际的效果",
      content: "<p>Name: {$username}, EmployeeNo: {$employeeNo}</p>",
    },
  ],
  template_replace_values: {
    username: "Teek",
    employeeNo: "100338",
  },
  template_preview_replace_values: {
    username: "Teek",
    employeeNo: "100338",
  },
  /**
   * 图片上传回调（触发回调条件：插入图片框的 tab 名为上传而不是一般）
   */
  images_upload_handler: (blobInfo: any, progress: () => void) =>
    new Promise((resolve, reject) => {
      emits("imgUpload", blobInfo, resolve, reject, progress);
    }),
  /**
   * 附件上传回调（触发回调条件：1. 插入图片框的 tab 名为一般；2. 插入链接；3. 插入媒体）
   */
  file_picker_callback: (callback: (url: string) => void, value: any, meta: any) => {
    const filetype =
      ".pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4,.mkv, .avi,.wmv, .rmvb,.mov,.mpg,.mpeg,.webm, .jpg, .jpeg, .png, .gif"; // 限制文件的上传类型
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", filetype);
    input.onchange = function () {
      const file = (this as any).files[0];
      emits("fileUpload", file, meta.filetype, callback);
    };
    input.click();
  },
  /**
   * 复制前的回调，可以添加文字水印
   */
  paste_preprocess: (plugin: any, args: any) => {
    // args.content += "水印";
  },
  ...useAttrs(), // 其他透传的属性
}));

onBeforeUnmount(() => {
  destroyTinymce();
});

const destroyTinymce = () => {
  const tinymce = (window as any).tinymce.get(props.id);
  if (fullscreen.value) tinymce.execCommand("mceFullScreen");
  if (tinymce) tinymce.destroy();
};

watch(language, () => {
  const tinymceManager = (window as any).tinymce;
  const tinymceInstance = tinymceManager.get(props.id);
  if (fullscreen.value) {
    tinymceInstance.execCommand("mceFullScreen");
  }
  if (tinymceInstance) {
    tinymceInstance.destroy();
  }
  nextTick(() => tinymceManager.init(initOptions.value));
});
</script>

<template>
  <div :class="[ns.b(), ns.is('fullscreen', fullscreen)]">
    <TinymceEditor :id="id" v-model="tinymceContent" :init="initOptions" :disabled v-bind="tinymceProps" />
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/function" as *;

:deep(.tox-edit-area) {
  &::before {
    // 鼠标悬浮时，编辑器边框颜色
    border-color: cssVar(color-primary) !important;
  }
}
</style>
