import type {
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

export interface SystemConfig {
  systemInfo: SystemInfo;
  themeConfig: ThemeConfig;
  layoutConfig: LayoutConfig;
  routerConfig: RouterConfig;
  keyConfig: KeyConfig;
}

export interface SystemInfo {
  name: string; // 系统名称
}

export interface ThemeConfig {
  titleMode: TitleModeEnum; // 标题在浏览器标签上的多种模式
  layoutMode: LayoutModeEnum; // 布局设置
  tabNavMode: TabNavModeEnum; // 标签页设置
  menuTheme: MenuThemeEnum; // 侧边菜单栏的主题色，暗色和亮色，默认为暗色
  pageTransition: PageTransitionEnum; // 进入页面过渡动画
  headerStyle: HeaderStyleEnum; // 顶部样式
  systemThemeMode: SystemThemeEnum; // 系统主题
  showBreadcrumb: boolean; // 是否使用 Breadcrumb
  showTabNav: boolean; // 是否使用 tagsNav
  showLayoutLogo: boolean; // 是否显示布局 Logo
  showBreadcrumbIcon: boolean; // 面包屑 Icon 是否显示
  showTabNavIcon: boolean; // 标签栏 Icon 是否显示
  showTabNavDot: boolean; // 标签栏 Dot 是否显示，优先级低于 showTabNavDot，仅在 tabNavMode 为 simple、classic 模式生效
  recordTabNav: boolean; // 是否记录打开过（没关闭）的 tags，下次打开会加载在 tagsNav
  isCollapse: boolean; // 是否折叠菜单栏
  menuAccordion: boolean; // 是否开启菜单手风琴
  fixTabNav: boolean; // 是否固定标签页
  isDark: boolean; // 是否开启暗色主题
  isWeak: boolean; // 是否开启灰色主题
  isGrey: boolean; // 是否开启色弱主题
  maximize: boolean; // MainContent 是否开启最大化，默认不开启（false）
  primaryColor: string; // 主题色
  menuWidth: number; // 菜单宽度
  headerHeight: number; // 顶部高度
  radius: number; // 圆角
  watermark: boolean; // 是否开启水印
}

export interface LayoutConfig {
  errorLog: {
    showInHeader: boolean; // 设为 false 后不会在顶部显示错误日志徽标
    env: string[]; // 日志收集的环境，对应 .evn.xxx，如 development、test、production
  };
  /**
   * 这是路由和菜单呼应可能产生的问题而需要配置：alwaysShowRoot 为 false 情况（确保您了解路由的配置规则，如果不了解，前往 router/router-config 查看）
   * true：存在多个二级路由，但是只有一个二级路由 hideInMenu 为 false，举例：有 5 个二级路由，但是有 4 个二级路由 hideInMenu: true，则需要开启 true，确保菜单只渲染剩下的路由
   *
   * 为 true 的场景较少见，如果真的遇到，则开启为 true，否则不建议开启，虽然 true 能无需后顾之忧，但是会多重复一次过滤递归，即消耗点性能
   *
   * 如果看不懂这个配置没关系，当您配置路由时遇到为 true 的场景时，自然懂得
   */
  moreRouteChildrenHideInMenuThenOnlyOne: boolean;
  tooltipEffect: "light" | "dark"; // 布局的 el-toolTip 风格
  layoutSize: LayoutSizeEnum;
  language: LanguageEnum;
  watchFrame: boolean; // 是否监听 IFrame 传来的通信，用于 Portal 门户系统，来监听门户所有 IFrame 嵌入系统的通信，比如 A 系统想打开 B 系统，则告诉 Portal 门户帮忙打开
}

export interface RouterConfig {
  whiteList: string[];
  routeUseI18n: boolean; // 「路由」布局是否使用国际化，默认为 false，如果不使用，则需要在路由中给需要在菜单中展示的路由设置 meta: {title: 'xxx'} 用来在菜单中显示文字
  /**
   * 白名单额三种模式：["*"]、["next"]、[to.path, ...]
   * '*' 代表加载所有路由；next 代表直接放行，但不加载权限路由；to.path 表示指定的路由可以放行，可以填多个
   * 优先级：* > next > to.path
   */
  isKeepAlive: boolean; // 路由是否开启缓存
  isFull: boolean; // 是否全屏，不渲染 Layout 布局，只渲染当前路由组件
  cacheDynamicRoutes: boolean; // 是否缓存路由，默认不开启（false）
  routeUseTooltip: boolean; // 菜单的文字超出后，是否使用 el-toolTip 提示，仅针二级路由及以上生效
}

export interface KeyConfig {
  cacheKeyPrefix: string; // 缓存 key 前缀
  tabNavCacheKey: string; // 缓存标签页的 key
  versionCacheKey: string; // 缓存版本号的 key
  tabExcludesUrlKey: string[]; // 当 URL 携带参数时，标签页会出现多个重复且名字一样的 tab，该配置可指定忽略哪些参数生成新的 tab，如果为 * 则忽略所有参数
  cacheDynamicRoutesKey: string; // 缓存路由的 key
}

export interface ThemeSetting {
  name: string;
  theme: SystemThemeEnum;
  color: string[];
  leftLineColor: string;
  rightLineColor: string;
  img: string;
}
