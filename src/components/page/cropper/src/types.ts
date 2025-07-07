export interface CropperProps {
  /** 图片链接 */
  imgLink?: string;
  /** 图片类型 */
  imageType?: "blob" | "base64";
  /** 截图框宽度 */
  cropWidth?: number;
  /** 截图框高度 */
  cropHeight?: number;
  /** 截图容器高度 */
  cropContainerHeight?: number;
}

export interface CropperEmitProps {
  /** 图片上传回调 */
  uploadImage: [formData: FormData];
  /** 图片移动事件 */
  imgMoving: [];
  /** 图片剪切事件 */
  cropMoving: [];
}
