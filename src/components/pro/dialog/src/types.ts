import type { RenderTypes } from "@/components/pro/form-item";

export interface ProDialogProps {
  /**
   * 顶部标题
   *
   * @default ''
   */
  title?: string;
  /**
   * 是否默认全屏
   *
   * @default false
   */
  fullscreen?: boolean;
  /**
   * 是否显示渲染全屏图标
   *
   * @default true
   */
  fullscreenIcon?: boolean;
  /**
   * 内容高度
   *
   * @default 400
   */
  height?: string | number;
  /**
   * 内容最大高度
   *
   * @default 400
   */
  maxHeight?: string | number;
  /**
   * 是否渲染底部
   *
   * @default true
   */
  showFooter?: boolean;
  /**
   * 底部对齐方式
   *
   * @default 'right'
   */
  footerAlign?: "left" | "right" | "center";
  /**
   * 确认按钮 loading
   *
   * @default false
   */
  confirmLoading?: boolean;
  /**
   * 确认按钮文字
   *
   * @default '确认'
   */
  confirmText?: string;
  /**
   * 关闭按钮文字
   *
   * @default '关闭'
   */
  cancelText?: string;

  // useDialog 的 Props

  /**
   * 自定义内容渲染
   */
  render?: () => RenderTypes;
  /**
   * 自定义头部渲染
   */
  headerRender?: (scope: any) => RenderTypes;
  /**
   * 自定义底部渲染
   */
  footerRender?: (closeDialog: () => void) => RenderTypes;
  /**
   * 确认按钮点击事件
   */
  onConfirm?: (closeDialog: () => void) => unknown;
  /**
   * 关闭按钮点击事件
   */
  onCancel?: (closeDialog: () => void) => unknown;
}

export interface ProDialogEmits {
  cancel: [];
  confirm: [];
}
