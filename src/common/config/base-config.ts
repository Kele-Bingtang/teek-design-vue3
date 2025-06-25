import {
  HeaderStyleEnum,
  LanguageEnum,
  LayoutModeEnum,
  LayoutSizeEnum,
  MenuThemeEnum,
  PageTransitionEnum,
  SystemThemeEnum,
  TabNavModeEnum,
  TitleModeEnum,
} from "@/common/enums/appEnum";
import type { SystemInfo, LayoutConfig, SystemConfig, ThemeConfig, RouterConfig, KeyConfig } from "./types";

const systemInfo: SystemInfo = {
  name: "Teek Design Pro",
};

const themeConfig: ThemeConfig = {
  primaryColor: "#395AE3",
  titleMode: TitleModeEnum.ProjectPage,
  layoutMode: LayoutModeEnum.Vertical,
  tabNavMode: TabNavModeEnum.Simple,
  menuTheme: MenuThemeEnum.Light,
  pageTransition: PageTransitionEnum.SlideLeft,
  headerStyle: HeaderStyleEnum.Page,
  systemThemeMode: SystemThemeEnum.System,
  showBreadcrumb: true,
  showTabNav: true,
  showLayoutLogo: true,
  showBreadcrumbIcon: true,
  showTabNavIcon: true,
  showTabNavDot: true,
  recordTabNav: false,
  isCollapse: false,
  menuAccordion: false,
  fixTabNav: true,
  isDark: false,
  isWeak: false,
  isGrey: false,
  maximize: false,
  menuWidth: 240,
  headerHeight: 55,
  radius: 0.75,
  watermark: false,
};

const layoutConfig: LayoutConfig = {
  errorLog: { showInHeader: true, env: [""] },
  moreRouteChildrenHideInMenuThenOnlyOne: false,
  tooltipEffect: "light",
  layoutSize: LayoutSizeEnum.Default,
  language: LanguageEnum.ZhCn,
  watchFrame: false,
};

const routerConfig: RouterConfig = {
  whiteList: [""],
  routeUseI18n: true,
  isKeepAlive: false,
  isFull: false,
  cacheDynamicRoutes: false,
  routeUseTooltip: false,
};

const cacheKeyPrefix = "teek";

const keyConfig: KeyConfig = {
  cacheKeyPrefix,
  tabNavCacheKey: "tabNav",
  cacheDynamicRoutesKey: "dynamicRoutes",
  versionCacheKey: "version",
  tabExcludesUrlKey: ["layoutMode"],
};

export const createBaseConfig = (): SystemConfig => ({
  systemInfo,
  themeConfig,
  layoutConfig,
  routerConfig,
  keyConfig,
});
