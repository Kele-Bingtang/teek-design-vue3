import type { RenderTypes } from "@/components/pro/form-item";

/**
 * Render 相关函数的参数
 */
export type DrawerRenderParams = {
  handleConfirm: () => void;
  handleCancel: () => void;
};

export interface ProDrawerProps {
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
   * 是否渲染全屏图标
   *
   * @default true
   */
  fullscreenIcon?: boolean;
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

  // useDrawer 的 Props

  /**
   * 自定义内容渲染
   */
  render?: () => RenderTypes;
  /**
   * 自定义头部渲染
   */
  renderHeader?: (scope: any) => RenderTypes;
  /**
   * 自定义底部前方渲染
   */
  renderFooterBefore?: (scope: DrawerRenderParams) => RenderTypes;
  /**
   * 自定义底部渲染
   */
  renderFooter?: (scope: DrawerRenderParams) => RenderTypes;
  /**
   * 自定义底部前方渲染
   */
  renderFooterAfter?: (scope: DrawerRenderParams) => RenderTypes;
  /**
   * 确认按钮点击事件
   */
  onConfirm?: (closeDrawer: () => void) => unknown;
  /**
   * 关闭按钮点击事件
   */
  onCancel?: (closeDrawer: () => void) => unknown;
  /**
   * 全屏切换事件
   */
  onFullscreen?: (isFullscreen: boolean) => void;
}

export interface ProDrawerEmits {
  cancel: [];
  confirm: [];
  fullscreen: [isFullscreen: boolean];
}
