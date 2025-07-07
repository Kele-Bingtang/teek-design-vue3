import type { IDomEditor } from "@wangeditor/editor";

export type ImageInsertFnType = (url: string, alt: string) => void;
export type VideoInsertFnType = (url: string, poster: string) => void;
export type FileInsertFnType = (fileName: string, url: string) => void;

export interface WangEditorProp {
  /** 工具栏内容 */
  toolbarKeys?: string[];
  /** 去除掉指定的工具类内容 */
  excludeKeys?: string[];
  /** 富文本高度 */
  height?: string;
  /** 富文本模式 */
  mode?: "default" | "simple";
  /** 是否禁用编辑器 */
  disabled?: boolean;
  /** 是否隐藏工具栏 */
  hideToolBar?: boolean;
  /** 占位符 */
  placeholder?: string;
  /** 上传配置 */
  uploadConfig?: {
    /** 单个文件的最大体积限制，默认为 2M */
    maxFileSize?: number;
    /** 最多可上传几个文件，默认为 100 */
    maxNumberOfFiles?: number;
    /** 上传服务器 */
    server?: string;
  };
}

export type WangEditorEmits = {
  /** 图片上传 */
  imageUpload: [file: File, insertFn: ImageInsertFnType];
  /** 图片上传前 */
  imageBeforeUpload: [file: File];
  /** 图片上传进度 */
  imageProgress: [progress: number];
  /** 图片上传成功 */
  imageSuccess: [file: File, res: any];
  /** 图片上传失败 */
  imageFailed: [file: File, res: any];
  /** 图片上传错误 */
  imageError: [file: File, err: any, res: any];
  /** 视频上传 */
  videoUpload: [file: File, insertFn: VideoInsertFnType];
  /** 文件上传 */
  fileBeforeUpload: [file: File];
  /** 文件上传 */
  fileUpload: [file: File, insertFn: FileInsertFnType];
  /** 粘贴事件 */
  onPaste: [editor: IDomEditor, event: ClipboardEvent];
  /** 创建事件 */
  onCreated: [editor: IDomEditor];
};
