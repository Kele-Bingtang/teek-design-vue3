export type UITheme = "default" | "dark" | "tinymce-5" | "tinymce-5-dark";
export type ContentTheme = "" | "default" | "dark" | "document" | "tinymce-5" | "tinymce-5-dark";

export interface TinymceProps {
  /** 编辑器是否禁用 */
  disabled?: boolean;
  /** UI 主题 */
  theme?: UITheme;
  /** 内容区主题，如果不传，默认等于 UI 主题 */
  contentTheme?: ContentTheme;
  /** 编辑器 id */
  id?: string;
  /** 菜单区配置项 */
  menubar?: string;
  /** 工具区配置项 */
  toolbar?: string;
  /** 工具区超出一行的显示模式，floating：鼠标悬浮显示；sliding：鼠标点击显示；scrolling：鼠标滚动显示；wrap：直接换行显示 */
  toolbarMode?: "floating" | "sliding" | "scrolling" | "wrap";
  /** 编辑器宽度 */
  width?: string | number;
  /** 编辑器高度 */
  height?: string | number;
  /** 编辑器最小高度 */
  minHeight?: string | number;
  /** 编辑器语言 */
  lang?: string;
  /** true：编辑器可以垂直移动；false：编辑器无法移动；both：编辑器垂直和水平都可以移动 */
  move?: true | false | "both";
  /** 编辑器额外的配置 */
  tinymceProps?: Recordable;
  /** 编辑器内自定义 class */
  bodyClass?: string;
}

export interface TinymceEmitProps {
  /** 图片上传回调 */
  imgUpload: [
    blobInfo: () => void,
    resolve: (value: unknown) => void,
    reject: (value: unknown) => void,
    progress: () => void,
  ];
  fileUpload: [file: File, filetype: "image" | "media" | "file", callback: (url: string) => void];
}
