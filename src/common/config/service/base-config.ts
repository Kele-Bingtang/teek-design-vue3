import type { ServiceConfig } from "./types";
import {
  ElementPlusSizeEnum,
  HeaderMenuAlignEnum,
  HeaderStyleEnum,
  LanguageEnum,
  LayoutModeEnum,
  MenuThemeEnum,
  PageTransitionEnum,
  GlobalThemeEnum,
  TabNavElementModeEnum,
  ThemePanelTriggerPositionEnum,
  TitleModeEnum,
  MenuShowModeEnum,
  HeaderShowModeEnum,
  MenuStyleEnum,
  ThemeSurfaceEnum,
} from "@/common/enums";

export const defaultServiceConfig: ServiceConfig = {
  layout: {
    name: "Teek Design Vue3",
    avatar: "/avatar.png",
    titleMode: TitleModeEnum.ProjectPage,
    layoutMode: LayoutModeEnum.Vertical,
    maximize: false,
    watermark: false,
    moreRouteChildrenHideInMenuThenOnlyOne: false,
    tooltipEffect: isDark => (isDark ? "light" : "dark"),
    elementPlusSize: ElementPlusSizeEnum.Default,
    language: LanguageEnum.ZhCn,
    watchFrame: false,
    lockSecretKey: "my-secret-key",
    errorLog: {
      showInHeader: true,
      printConsole: true,
      env: [],
    },
    themePanelTriggerPosition: ThemePanelTriggerPositionEnum.Header,
    globalAlert: {
      enabled: true,
      text: "Teek Design Vue3 祝您圣诞快乐，愿节日的欢乐与祝福如雪花般纷至沓来！",
      startDate: "2025-12-25",
      endDate: "2025-12-25",
      type: "primary",
      closable: true,
      showIcon: false,
    },
  },
  theme: {
    // 默认与 css var 一致，在这里配置一份，方便生成 1 - 9 的基础色
    primaryColor: "#395ae3",
    successColor: "#0b9e40",
    warningColor: "#e68a00",
    dangerColor: "#d93126",
    errorColor: "#dd5c27",
    infoColor: "#5c667a",
    globalThemeMode: GlobalThemeEnum.System,
    radius: 0.75,
    weakMode: false,
    greyMode: false,
    presetsColor: [
      "#4a6cf7", // 鲜艳蓝
      "#ff6b6b", // 珊瑚粉
      "#00bbf9", // 天蓝
      "#00f5d4", // 蓝绿
      "#708090", // 石板灰
      "#f15bb5", // 粉红
      "#8ac926", // 黄绿
      "#ff9e6b", // 橙红
      "#ffd166", // 浅黄
      "#ff6b6b", // 珊瑚粉
      "#42aaff", // 中性天蓝
      "#4cd890", // 中性蓝绿
      "#ff69b4", // 热粉
      "#5a7fd9", // 中性蓝紫
      "#db7093", // 紫红
      "#9b59b6", // 紫色
    ],
    surface: ThemeSurfaceEnum.TeekBrand,
    functionalColorStrictly: true,
  },
  header: {
    enabled: true,
    height: 55,
    style: HeaderStyleEnum.Page,
    menuAlign: HeaderMenuAlignEnum.Start,
    showMode: HeaderShowModeEnum.Fixed,
  },
  menu: {
    enabled: true,
    width: 240,
    accordion: false,
    collapsed: false,
    collapseWidth: 64,
    theme: MenuThemeEnum.Light,
    style: MenuStyleEnum.Simple,
    showMode: MenuShowModeEnum.Static,
    autoActivateChild: true,
    showModeAutoFixed: true,
    rightClickMenuCollapseToClose: true,
  },
  tabNav: {
    enabled: true,
    elementMode: TabNavElementModeEnum.Simple,
    showIcon: true,
    showDot: true,
    persistence: false,
    fixed: true,
    draggable: true,
    height: 38,
    middleClickToClose: false,
    middleClickToOpen: false,
    middleClickToOpenInNewWindow: true,
    showMore: true,
    wheel: true,
    maxCount: 0,
  },
  breadcrumb: {
    enabled: true,
    showIcon: true,
    hideOnlyOne: false,
    showHome: true,
    onlyShowHomeIcon: false,
  },
  logo: {
    enable: true,
    source: "/logo.png",
  },
  transition: {
    pageEnter: PageTransitionEnum.SlideLeft,
    progress: true,
    loading: true,
  },
  widget: {
    menuCollapse: true,
    refresh: true,
    search: true,
    fullscreen: true,
    notification: true,
    language: true,
    theme: true,
    lockScreen: true,
    searchIcon: false,
  },
  shortcutKey: {
    enable: true,
    search: true,
    logout: true,
    lockScreen: true,
  },
  router: {
    whiteList: [""],
    routeUseI18n: true,
    nameI18nPrefix: "_route",
    isKeepAlive: false,
    isFull: false,
    cacheDynamicRoutes: false,
    routeUseTooltip: false,
  },
  cache: {
    cacheKeyPrefix: "teek",
    tabNavCacheKey: "tabNav",
    cacheDynamicRoutesKey: "dynamicRoutes",
    versionCacheKey: "version",
    tabExcludesUrlKey: ["layoutMode"],
    cleanCacheWhenUpgrade: false,
  },
} as ServiceConfig;
