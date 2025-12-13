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
    primaryColor: {
      [GlobalThemeEnum.System]: "", // 跟随系统即自动获取系统预设的主题色
      [GlobalThemeEnum.Light]: "#395ae3",
      [GlobalThemeEnum.DarkBlue]: "#4a8fe1",
      [GlobalThemeEnum.DarkDeep]: "#4a6bc5",
      [GlobalThemeEnum.DarkMidnight]: "#3a7fdb",
      [GlobalThemeEnum.DarkNeutral]: "#6d94e6",
    },
    globalThemeMode: GlobalThemeEnum.System,
    defaultDarkMode: GlobalThemeEnum.DarkNeutral,
    globalThemeClassName: {
      [GlobalThemeEnum.Light]: "",
      [GlobalThemeEnum.DarkBlue]: "dark-blue",
      [GlobalThemeEnum.DarkDeep]: "dark-deep",
      [GlobalThemeEnum.DarkMidnight]: "dark-midnight",
      [GlobalThemeEnum.DarkNeutral]: "dark-neutral",
    },
    radius: 0.75,
    weakMode: false,
    greyMode: false,
    presetsColor: {
      [GlobalThemeEnum.Light]: [
        "#4a6cf7", // 鲜艳蓝
        "#ff6b6b", // 珊瑚粉
        "#00bbf9", // 天蓝
        "#00f5d4", // 蓝绿
        "#708090", // 石板灰
        "#f15bb5", // 粉红
        "#8ac926", // 黄绿
        "#ff9e6b", // 橙红
        "#ffd166", // 浅黄
      ],
      [GlobalThemeEnum.DarkBlue]: [
        "#5a8fe6", // 亮蓝
        "#ff6b6b", // 珊瑚粉
        "#1abc9c", // 蓝绿
        "#708090", // 石板灰
        "#f1c40f", // 明黄
        "#2980b9", // 深蓝
        "#ff69b4", // 热粉
        "#d35400", // 深橙
        "#9b59b6", // 紫色
      ],
      [GlobalThemeEnum.DarkDeep]: [
        "#db7093", // 深蓝紫
        "#8e44ad", // 紫罗兰
        "#16a085", // 蓝绿
        "#708090", // 石板灰
        "#f1c40f", // 明黄
        "#2c3e50", // 钢蓝
        "#c0392b", // 深红
        "#2980b9", // 深蓝
        "#27ae60", // 绿松石
      ],
      [GlobalThemeEnum.DarkMidnight]: [
        "#ff6b6b", // 珊瑚粉
        "#1abc9c", // 蓝绿
        "#708090", // 石板灰
        "#f1c40f", // 明黄
        "#2c3e50", // 钢蓝
        "#ff69b4", // 热粉
        "#d35400", // 深橙
        "#2980b9", // 深蓝
        "#27ae60", // 绿松石
      ],
      [GlobalThemeEnum.DarkNeutral]: [
        "#ff6b6b", // 珊瑚粉
        "#42aaff", // 中性天蓝
        "#4cd890", // 中性蓝绿
        "#708090", // 石板灰
        "#ff9e6b", // 中性橙
        "#ff69b4", // 热粉
        "#5a7fd9", // 中性蓝紫
        "#db7093", // 紫红
        "#9b59b6", // 紫色
      ],
    },
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
