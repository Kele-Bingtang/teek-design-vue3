import type { ServiceConfig } from "./types";
import { defaultServiceConfig } from "./base-config";
import { defineEnvServiceConfig } from "./env-config";

export const defineServiceConfig = (overrideServiceConfig: DeepPartial<ServiceConfig> = {}): ServiceConfig => {
  const envServiceConfig = defineEnvServiceConfig();

  return {
    layout: {
      ...defaultServiceConfig.layout,
      ...envServiceConfig?.layout,
      ...overrideServiceConfig.layout,
    },
    tabNav: {
      ...defaultServiceConfig.tabNav,
      ...envServiceConfig?.tabNav,
      ...overrideServiceConfig.tabNav,
    },
    breadcrumb: {
      ...defaultServiceConfig.breadcrumb,
      ...envServiceConfig?.breadcrumb,
      ...overrideServiceConfig.breadcrumb,
    },
    header: {
      ...defaultServiceConfig.header,
      ...envServiceConfig?.header,
      ...overrideServiceConfig.header,
    },
    menu: {
      ...defaultServiceConfig.menu,
      ...envServiceConfig?.menu,
      ...overrideServiceConfig.menu,
    },
    theme: {
      ...defaultServiceConfig.theme,
      ...envServiceConfig?.theme,
      ...overrideServiceConfig.theme,
    },
    logo: {
      ...defaultServiceConfig.logo,
      ...envServiceConfig?.logo,
      ...overrideServiceConfig.logo,
    },
    transition: {
      ...defaultServiceConfig.transition,
      ...envServiceConfig?.transition,
      ...overrideServiceConfig.transition,
    },
    widget: {
      ...defaultServiceConfig.widget,
      ...envServiceConfig?.widget,
      ...overrideServiceConfig.widget,
    },
    shortcutKey: {
      ...defaultServiceConfig.shortcutKey,
      ...envServiceConfig?.shortcutKey,
      ...overrideServiceConfig.shortcutKey,
    },
    router: {
      ...defaultServiceConfig.router,
      ...envServiceConfig?.router,
      ...overrideServiceConfig.router,
    },
    cache: {
      ...defaultServiceConfig.cache,
      ...envServiceConfig?.cache,
      ...overrideServiceConfig.cache,
    },
  } as ServiceConfig;
};
