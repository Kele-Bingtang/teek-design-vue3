import type { App, Directive } from "vue";
import type { UseInstallWithPlugin, UseInstallWithContext } from "./types";

/**
 * 安装组件，通过 app.use 安装
 *
 * @param main 主组件
 * @param extra 额外组件
 */
export const useInstall = <T, E extends Recordable>(main: T, extra?: E) => {
  (main as UseInstallWithPlugin<T>).install = (app: App): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp);
    }
  };

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      (main as any)[key] = comp;
    }
  }
  return main as UseInstallWithPlugin<T> & E;
};

/**
 * 安装函数
 *
 * @param fn 函数
 * @param name 名称
 */
export const useInstallFunction = <T>(fn: T, name: string) => {
  (fn as UseInstallWithPlugin<T>).install = (app: App) => {
    (fn as UseInstallWithContext<T>)._context = app._context;
    app.config.globalProperties[name] = fn;
  };

  return fn as UseInstallWithContext<T>;
};

/**
 * 安装指令
 *
 * @param directive 指令
 * @param name 名称
 */
export const useInstallDirective = <T extends Directive>(directive: T, name: string) => {
  (directive as UseInstallWithPlugin<T>).install = (app: App): void => {
    app.directive(name, directive);
  };

  return directive as UseInstallWithPlugin<T>;
};
