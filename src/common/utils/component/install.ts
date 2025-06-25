import type { App, Directive } from "vue";
import type { UseInstallWithPlugin, UseInstallWithContext } from "./typescript";

export const useInstall = <T, E extends Record<string, any>>(main: T, extra?: E) => {
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

export const useInstallFunction = <T>(fn: T, name: string) => {
  (fn as UseInstallWithPlugin<T>).install = (app: App) => {
    (fn as UseInstallWithContext<T>)._context = app._context;
    app.config.globalProperties[name] = fn;
  };

  return fn as UseInstallWithContext<T>;
};

export const useInstallDirective = <T extends Directive>(directive: T, name: string) => {
  (directive as UseInstallWithPlugin<T>).install = (app: App): void => {
    app.directive(name, directive);
  };

  return directive as UseInstallWithPlugin<T>;
};
