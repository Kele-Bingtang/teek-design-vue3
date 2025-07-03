import type { AppContext, Plugin } from "vue";

export type UseInstallWithPlugin<T> = T & Plugin;

/**
 * 安装组件类型
 */
export type UseInstallWithContext<T> = UseInstallWithPlugin<T> & {
  _context: AppContext | null;
};
