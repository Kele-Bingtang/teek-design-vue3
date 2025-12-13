import type {
  HeaderStyleEnum,
  LanguageEnum,
  LayoutModeEnum,
  ElementPlusSizeEnum,
  MenuThemeEnum,
  PageTransitionEnum,
  GlobalThemeEnum,
  TabNavElementModeEnum,
  TitleModeEnum,
  HeaderMenuAlignEnum,
  ThemePanelTriggerPositionEnum,
  MenuShowModeEnum,
  HeaderShowModeEnum,
  MenuStyleEnum,
} from "@/common/enums";

export interface ServiceConfig {
  /** 全局配置 */
  layout: LayoutConfig;
  /** 主题配置 */
  theme: ThemeConfig;
  /** 顶栏配置 */
  header: headerConfig;
  /** 菜单栏配置 */
  menu: MenuConfig;
  /** 标签栏配置 */
  tabNav: TabNavConfig;
  /** 面包屑配置 */
  breadcrumb: BreadcrumbConfig;
  /** Logo 配置 */
  logo: LogoConfig;
  /** 动画配置 */
  transition: TransitionConfig;
  /** 小部件配置 */
  widget: WidgetConfig;
  /** 快捷键配置 */
  shortcutKey: ShortcutKeyConfig;
  /** 路由配置 */
  router: RouterConfig;
  /** 缓存配置 */
  cache: CacheConfig;
}

export interface LayoutConfig {
  /** 系统名称 */
  name: string;
  /** 默认头像 */
  avatar: string;
  /** 标题在浏览器标签上的多种模式 */
  titleMode: TitleModeEnum;
  /** 布局设置 */
  layoutMode: LayoutModeEnum;
  /** PageContent 是否开启最大化，默认不开启（false） */
  maximize: boolean;
  /** 是否开启水印 */
  watermark: boolean;
  /** El 组件尺寸 */
  elementPlusSize: ElementPlusSizeEnum;
  /**
   * 这是路由和菜单呼应可能产生的问题而需要配置：alwaysShowRoot 为 false 情况（确保您了解路由的配置规则，如果不了解，前往 router/router-config 查看）
   * true：存在多个二级路由，但是只有一个二级路由 hideInMenu 为 false，举例：有 5 个二级路由，但是有 4 个二级路由 hideInMenu: true，则需要开启 true，确保菜单只渲染剩下的路由
   *
   * 为 true 的场景较少见，如果真的遇到，则开启为 true，否则不建议开启，虽然 true 能无需后顾之忧，但是会多重复一次过滤递归，即消耗点性能
   *
   * 如果看不懂这个配置没关系，当您配置路由时遇到为 true 的场景时，自然懂得
   */
  moreRouteChildrenHideInMenuThenOnlyOne: boolean;
  /** 布局的 el-toolTip 风格 */
  tooltipEffect: "light" | "dark" | ((isDark: boolean) => "light" | "dark");
  /** 国际化 */
  language: LanguageEnum;
  /** 是否监听 IFrame 传来的通信，用于 Portal 门户系统，来监听门户所有 IFrame 嵌入系统的通信，比如 A 系统想打开 B 系统，则告诉 Portal 门户帮忙打开 */
  watchFrame: boolean;
  /** 锁屏密钥 */
  lockSecretKey: string;
  errorLog: {
    /** 是否在顶部显示错误日志图标 */
    showInHeader: boolean;
    /** 是否打印错误日志到控制台 */
    printConsole: boolean;
    /** 日志收集的环境，对应 .evn.xxx，如 development、test、production */
    env: string[];
  };
  /** 主题面板触发按钮位置 */
  themePanelTriggerPosition: ThemePanelTriggerPositionEnum;
  /** 全局提示配置 */
  globalAlert?: {
    /** 是否启用提示，默认为 true */
    enabled?: boolean;
    /** 开始时间，默认当天 */
    startDate?: string;
    /** 结束时间，默认为 startDate */
    endDate?: string;
    /** 提示文本 */
    text?: string;
    /** 类型，默认 primary */
    type?: "primary" | "success" | "warning" | "danger" | "error" | "info" | "secondary";
    /** 是否可以关闭，默认 false */
    closable?: boolean;
    /** 是否显示类型图标，默认 false */
    showIcon?: boolean;
  };
}

export interface ThemeConfig {
  /** 主题色 */
  primaryColor: Partial<Record<GlobalThemeEnum, string>>;
  /** 系统主题 */
  globalThemeMode: GlobalThemeEnum;
  /** 指定当切换为暗色模式（html class 为 dark）或跟随系统时，使用的实际暗色模式 */
  defaultDarkMode: GlobalThemeEnum;
  /** 不同主题模式在 html 的 className */
  globalThemeClassName: Partial<Record<GlobalThemeEnum, string>>;
  /** 圆角 */
  radius: number;
  /** 是否开启灰色主题 */
  weakMode: boolean;
  /** 是否开启色弱主题 */
  greyMode: boolean;
  /** 预设颜色 */
  presetsColor: Partial<Record<GlobalThemeEnum, string[]>>;
}

export interface headerConfig {
  /** 是否使用顶栏 */
  enabled: boolean;
  /** 顶部高度 */
  height: number;
  /** 顶部样式 */
  style: HeaderStyleEnum;
  /** 菜单显示模式 */
  showMode: HeaderShowModeEnum;
  /** 顶部菜单样式 */
  menuAlign: HeaderMenuAlignEnum;
}

export interface MenuConfig {
  /** 是否使用菜单栏 */
  enabled: boolean;
  /** 菜单宽度 */
  width: number;
  /** 是否开启菜单手风琴 */
  accordion: boolean;
  /** 是否折叠菜单栏 */
  collapsed: boolean;
  /** 菜单栏折叠宽度 */
  collapseWidth: number;
  /** 菜单栏的主题色，暗色和亮色，默认为暗色 */
  theme: MenuThemeEnum;
  /** 菜单样式，朴素和圆润，默认为朴素 */
  style: MenuStyleEnum;
  /** 菜单显示模式 */
  showMode: MenuShowModeEnum;
  /** 点击目录时自动激活子菜单，在分栏布局生效 */
  autoActivateChild: boolean;
  /** 当菜单显示模式为 Auto 时，是否固定菜单栏 */
  showModeAutoFixed: boolean;
  /** 鼠标右键点击关闭菜单栏 */
  rightClickMenuCollapseToClose: boolean;
}

export interface TabNavConfig {
  /** 是否使用 tagsNav */
  enabled: boolean;
  /** 标签栏元素模式设置 */
  elementMode: TabNavElementModeEnum;
  /** 标签栏 Icon 是否显示 */
  showIcon: boolean;
  /** 标签栏 Dot 是否显示，优先级低于 showTabNavDot，仅在 elementMode 为 simple、classic 模式生效 */
  showDot: boolean;
  /** 是否记录打开过（没关闭）的 tags，下次打开会加载在 tagsNav */
  persistence: boolean;
  /** 是否固定标签栏 */
  fixed: boolean;
  /** 是否开启多标签页拖拽 */
  draggable: boolean;
  /** 标签栏高度 */
  height: number;
  /** 是否点击中键时关闭标签，优先级低于 middleClickToOpen */
  middleClickToClose: boolean;
  /** 是否点击中键时打开标签页，优先级低于 middleClickToOpenWindow */
  middleClickToOpen: boolean;
  /** 是否点击中键时新窗口打开标签页 */
  middleClickToOpenInNewWindow: boolean;
  /** 显示更多按钮 */
  showMore: boolean;
  /** 是否开启鼠标滚轮响应 */
  wheel: boolean;
  /** 最大标签数，超出后关闭最先打开的旧标签，0 表示不限制 */
  maxCount: number;
}

export interface BreadcrumbConfig {
  /** 是否使用 Breadcrumb */
  enabled: boolean;
  /** 面包屑 Icon 是否显示 */
  showIcon: boolean;
  /** 面包屑是否只有一个时隐藏 */
  hideOnlyOne: boolean;
  /** 面包屑首页面包屑是否可见，当 onlyShowHomeIcon 为 true 则一定为 false */
  showHome: boolean;
  /** 是否只显示首页图标 */
  onlyShowHomeIcon: boolean;
}

export interface LogoConfig {
  /** 是否显示 Logo */
  enable: boolean;
  /** logo 地址 */
  source: string;
}

export interface TransitionConfig {
  /** 进入页面过渡动画 */
  pageEnter: PageTransitionEnum;
  /** 是否开启页面加载进度动画 */
  progress: boolean;
  /** 是否开启页面加载动画 */
  loading: boolean;
}

export interface WidgetConfig {
  /** 是否显示菜单栏折叠 */
  menuCollapse: boolean;
  /** 是否显示刷新图标 */
  refresh: boolean;
  /** 是否显示搜索框 */
  search: boolean;
  /** 是否显示全屏图标 */
  fullscreen: boolean;
  /** 是否显示通知图标 */
  notification: boolean;
  /** 是否显示国际化图标 */
  language: boolean;
  /** 是否显示暗黑切换图标 */
  theme: boolean;
  /** 是否显示锁屏按钮 */
  lockScreen: boolean;
  /** 是否使用搜索图标替换搜索框 */
  searchIcon: boolean;
}

export interface ShortcutKeyConfig {
  /** 是否启用快捷键 */
  enable: boolean;
  /** 是否启用全局搜索快捷键 */
  search: boolean;
  /** 是否启用全局注销快捷键 */
  logout: boolean;
  /** 是否启用全局锁屏快捷键 */
  lockScreen: boolean;
}

export interface RouterConfig {
  /**
   * 白名单额三种模式：["*"]、["next"]、[to.path, ...]
   * '*' 代表加载所有路由；next 代表直接放行，但不加载权限路由；to.path 表示指定的路由可以放行，可以填多个
   * 优先级：* > next > to.path
   */
  whiteList: string[];
  /** 「路由」布局是否使用国际化，默认为 false，如果不使用，则需要在路由中给需要在菜单中展示的路由设置 meta: {title: 'xxx'} 用来在菜单中显示文字 */
  routeUseI18n: boolean;
  /** 当使用路由国际化时，通过 name 属性读取国际化文本的前缀 */
  nameI18nPrefix: string;
  /** 路由是否开启缓存 */
  isKeepAlive: boolean;
  /** 是否全屏，不渲染 Layout 布局，只渲染当前路由组件 */
  isFull: boolean;
  /** 是否缓存路由，默认不开启（false） */
  cacheDynamicRoutes: boolean;
  /** 菜单的文字超出后，是否使用 el-toolTip 提示，仅针二级路由及以上生效 */
  routeUseTooltip: boolean;
}

export interface CacheConfig {
  /** 缓存 key 前缀 */
  cacheKeyPrefix: string;
  /** 缓存标签栏的 key */
  tabNavCacheKey: string;
  /** 缓存版本号的 key */
  versionCacheKey: string;
  /** 当 URL 携带参数时，标签栏会出现多个重复且名字一样的 tab，该配置可指定忽略哪些参数生成新的 tab，如果为 * 则忽略所有参数 */
  tabExcludesUrlKey: string[];
  /** 缓存路由的 key */
  cacheDynamicRoutesKey: string;
  /** 是否在升级时清理所有缓存，默认 false */
  cleanCacheWhenUpgrade: boolean;
}
