export interface ImageUploadProps {
  /** 上传图片的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可，非必传 */
  api?: (params: any) => Promise<any>;
  /** 是否支持拖拽上传，默认为 true */
  drag?: boolean;
  /** 是否禁用上传组件，默认为 false */
  disabled?: boolean;
  /** 图片大小限制，默认为 5M */
  fileSize?: number;
  /** 图片类型限制，默认为 ["image/jpeg", "image/png", "image/gif"] */
  fileType?: FileTypes[];
  /** 组件高度，默认为 150px */
  height?: string;
  /** 组件宽度，默认为 150px */
  width?: string;
  /** 组件边框圆角，默认为 8px */
  borderRadius?: string;
  /** 最大图片上传数，默认为 5张 */
  limit?: number;
}

// 图片类型限制
export type FileTypes =
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

// 图片上传成功回调
export type SuccessFun = (response: string) => void;

export interface ImageUploadEmits {
  uploadImg: [file: File, callback: SuccessFun];
  checkValidate: [];
}
