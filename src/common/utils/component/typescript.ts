import type { AppContext, Plugin } from "vue";

export type UseInstallWithPlugin<T> = T & Plugin;

export type UseInstallWithContext<T> = UseInstallWithPlugin<T> & {
  _context: AppContext | null;
};
