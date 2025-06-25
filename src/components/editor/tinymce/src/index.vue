<script setup lang="ts" name="Tinymce">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick, useAttrs } from "vue";
import TinymceEditor from "@tinymce/tinymce-vue";
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/plugins/accordion"; // 手提琴，https://www.tiny.cloud/docs/tinymce/6/accordion/
import "tinymce/plugins/advlist"; // 高级列表，https://www.tiny.cloud/docs/tinymce/6/advlist/
import "tinymce/plugins/anchor"; // 在工具栏中添加了一个锚点/书签按钮，https://www.tiny.cloud/docs/tinymce/6/advlist/anchor/
import "tinymce/plugins/autolink"; // 当用户键入有效的完整 URL 时，自动链接插件会自动创建超链接，https://www.tiny.cloud/docs/tinymce/6/advlist/autolink/
import "tinymce/plugins/autoresize"; // 自动根据其中的内容调整编辑器的大小，https://www.tiny.cloud/docs/tinymce/6/advlist/autoresize/
import "tinymce/plugins/autosave"; // 自动保存，如果离开页面来不及保存，弹框提示，https://www.tiny.cloud/docs/tinymce/6/advlist/autosave/
import "tinymce/plugins/charmap"; // 字符映射表插件，https://www.tiny.cloud/docs/tinymce/6/advlist/charmap/
import "tinymce/plugins/code"; // 允许编辑所见即所得视图隐藏的 HTML 代码，https://www.tiny.cloud/docs/tinymce/6/advlist/code/
import "tinymce/plugins/codesample"; // 允许用户将语法颜色突出显示的代码片段插入和嵌入到可编辑区域，https://www.tiny.cloud/docs/tinymce/6/advlist/codesample/
import "tinymce/plugins/directionality"; // 该插件在工具栏中添加了方向性控件，使TinyMCE能够更好地处理从右到左编写的语言，https://www.tiny.cloud/docs/tinymce/6/advlist/directionality/
import "tinymce/plugins/emoticons"; // 表情符号插件，https://www.tiny.cloud/docs/tinymce/6/advlist/emoticons/
import "tinymce/plugins/emoticons/js/emojis"; // 表情包
import "tinymce/plugins/fullscreen"; // 将 TinyMCE 放大到整个屏幕，https://www.tiny.cloud/docs/tinymce/6/advlist/fullscreen/
import "tinymce/plugins/help"; // 显示帮助对话框，https://www.tiny.cloud/docs/tinymce/6/advlist/help/
import "tinymce/plugins/image"; // 将图像插入TinyMCE，https://www.tiny.cloud/docs/tinymce/6/advlist/image/
import "tinymce/plugins/importcss"; // 自动将 CSS 类名填充到“格式”下拉列表中，https://www.tiny.cloud/docs/tinymce/6/advlist/importcss/
import "tinymce/plugins/insertdatetime"; // 将当前日期和/或时间插入 TinyMCE，https://www.tiny.cloud/docs/tinymce/6/advlist/insertdatetime/
import "tinymce/plugins/link"; // 向内容添加超链接，https://www.tiny.cloud/docs/tinymce/6/advlist/link/
import "tinymce/plugins/lists"; // 规范浏览器之间的列表行为，https://www.tiny.cloud/docs/tinymce/6/advlist/lists/
import "tinymce/plugins/media"; // 添加 HTML5 视频和音频元素，https://www.tiny.cloud/docs/tinymce/6/advlist/media/
import "tinymce/plugins/nonbreaking"; // 插入一个不间断的空格，https://www.tiny.cloud/docs/tinymce/6/advlist/nonbreaking/
import "tinymce/plugins/pagebreak"; // 添加分页符，https://www.tiny.cloud/docs/tinymce/6/advlist/pagebreak/
import "tinymce/plugins/preview"; // 以只读格式显示当前内容的弹出窗口，https://www.tiny.cloud/docs/tinymce/6/advlist/preview/
import "tinymce/plugins/quickbars"; // 工具栏，用户界面控件可更快地创建内容，https://www.tiny.cloud/docs/tinymce/6/advlist/quickbars/
import "tinymce/plugins/save"; // 将保存按钮添加到 TinyMCE 工具栏，https://www.tiny.cloud/docs/tinymce/6/advlist/save/
import "tinymce/plugins/searchreplace"; // 在TinyMCE中查找和替换内容，https://www.tiny.cloud/docs/tinymce/6/advlist/searchreplace/
import "tinymce/plugins/table"; // 表格，https://www.tiny.cloud/docs/tinymce/6/table/
import "tinymce/plugins/template"; // 添加了对自定义模板的支持，https://www.tiny.cloud/docs/tinymce/6/template/
import "tinymce/plugins/visualblocks"; // 允许用户在可编辑区域中查看块级元素，https://www.tiny.cloud/docs/tinymce/6/visualblocks/
import "tinymce/plugins/visualchars"; // 增加了查看可编辑区域中显示的不可见字符的功能，https://www.tiny.cloud/docs/tinymce/6/visualchars/
import "tinymce/plugins/wordcount"; // 右下角统计字数，https://www.tiny.cloud/docs/tinymce/6/wordcount/
import "tinymce/models/dom";
import { plugins, toolbar as toolbarConfig } from "./config";
import "/public/tinymce/plugins/axupimgs/plugin";
import { useNamespace } from "@/composables";

defineOptions({ name: "Tinymce" });

const ns = useNamespace("tinymce");

export type UITheme = "default" | "dark" | "tinymce-5" | "tinymce-5-dark";
export type ContentTheme = "" | "default" | "dark" | "document" | "tinymce-5" | "tinymce-5-dark";

interface TinymceProps {
  disabled?: boolean; // 编辑器是否禁用
  theme?: UITheme; // UI 主题
  contentTheme?: ContentTheme; // 内容区主题，如果不传，默认等于 UI 主题
  id?: string; // 编辑器 id
  menubar?: string; // 菜单区配置项
  toolbar?: string[]; // 工具区配置项
  toolbarMode?: "floating" | "sliding" | "scrolling" | "wrap"; // 工具区超出一行的显示模式，floating：鼠标悬浮显示；sliding：鼠标点击显示；scrolling：鼠标滚动显示；wrap：直接换行显示
  width?: string | number; // 编辑器宽度
  height?: string | number; // 编辑器高度
  lang?: string; // 编辑器语言
  move?: true | false | "both"; // true：编辑器可以垂直移动；false：编辑器无法移动；both：编辑器垂直和水平都可以移动
}
const props = withDefaults(defineProps<TinymceProps>(), {
  disabled: false,
  theme: "default",
  contentTheme: "",
  id: () => "vue3-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + ""),
  menubar: "file edit view insert format tools table help",
  toolbar: () => [],
  toolbarMode: "sliding",
  width: "auto",
  height: 360,
  lang: "zh-CN",
  move: true,
});

type TinymceEmitProps = {
  imgUpload: [
    blobInfo: () => void,
    resolve: (value: unknown) => void,
    reject: (value: unknown) => void,
    progress: () => void,
  ];
  fileUpload: [file: File, filetype: "image" | "media" | "file", callback: (url: string) => void];
};

const emits = defineEmits<TinymceEmitProps>();

const tinymceContent = defineModel<string>({ default: "" });

const fullscreen = ref(false);

const languageTypeList = reactive<Record<string, any>>({
  "zh-CN": "zh_CN",
});

const language = computed(() => languageTypeList[props.lang]);

const skinTheme = computed(() => {
  if (props.theme === "default") {
    return "oxide";
  } else if (props.theme === "dark") {
    return "oxide-dark";
  }
  return props.theme;
});

const initOptions = computed(() => ({
  selector: `#${props.id}`,
  deprecation_warnings: false, // 去除再控制台展示的废弃 API 提示
  width: props.width, // 编辑器宽度
  height: props.height, // 编辑器高度
  min_height: 160, // 编辑器最小高度
  body_class: "editor-body", // 编辑器自定义 class
  resize: props.move, // 自动控制大小
  plugins: plugins, // 插件
  toolbar: props.toolbar.length > 0 ? props.toolbar : toolbarConfig, // 工具栏
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
  template_mdate_format: "%Y-%m-%d %H:%M:%S", // 模板插件配置项：模板中插入当前日期的格式
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
    username: "Kobe Liu",
    employeeNo: "100338",
  },
  template_preview_replace_values: {
    username: "Kobe Liu",
    employeeNo: "100338",
  },
  // 图片上传回调
  images_upload_handler: (blobInfo: () => void, progress: () => void) =>
    new Promise((resolve, reject) => {
      emits("imgUpload", blobInfo, resolve, reject, progress);
    }),
  // 附件上传回调
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
  // 复制前的回调，可以添加文字水印
  paste_preprocess: (plugin: any, args: any) => {
    console.log(args.content);
    // args.content += "水印";
  },
  ...useAttrs(), // 其他透传的属性
}));

onMounted(() => {
  onDisabledChange();
});

onBeforeUnmount(() => {
  destroyTinymce();
});

const destroyTinymce = () => {
  const tinymce = (window as any).tinymce.get(props.id);
  if (fullscreen.value) tinymce.execCommand("mceFullScreen");
  if (tinymce) tinymce.destroy();
};

const onDisabledChange = () => {
  const tinymceInstance = (window as any).tinymce.get(props.id);
  if (tinymceInstance) {
    const status = props.disabled ? "readonly" : "design";
    tinymceInstance.mode.set(status);
  }
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

watch(
  () => props.disabled,
  () => onDisabledChange()
);
</script>

<template>
  <div :class="[ns.b(), ns.is('fullscreen', fullscreen)]">
    <TinymceEditor :id="id" v-model="tinymceContent" :init="initOptions" />
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(tinymce) {
  position: relative;
  line-height: normal;

  // 内容区
  // :deep(.tox) {
  //   z-index: 2000 !important;
  // }
}
</style>
