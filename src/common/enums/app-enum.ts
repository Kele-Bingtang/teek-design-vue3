// 系统级别枚举
export enum LayoutModeEnum {
  Vertical = "vertical",
  Classic = "classic",
  Horizontal = "horizontal",
  Columns = "columns",
  IFrame = "iframe",
  Mixins = "mixins",
}

// 标签栏模式
export enum TabNavModeEnum {
  Simple = "simple",
  Classic = "classic",
  Element = "element",
}

// 系统主题
export enum GlobalThemeEnum {
  Dark = "dark",
  Light = "light",
  System = "system",
}

// 菜单主题
export enum MenuThemeEnum {
  Dark = "dark",
  Light = "light",
}

// 标题模式
export enum TitleModeEnum {
  ProjectPage = "projectPage",
  UsernamePage = "usernamePage",
  Project = "project",
  Page = "page",
}

// 语言
export enum LanguageEnum {
  ZhCn = "zh-CN",
  EnUs = "en-US",
}

// 布局大小
export enum ElementPlusSizeEnum {
  Default = "default",
  Small = "small",
  Large = "large",
}

// 路由页面过渡效果
export enum PageTransitionEnum {
  None = "",
  Fade = "fade",
  SlideLeft = "slide-left",
  SlideTop = "Slide-top",
  SlideBottom = "slide-bottom",
}

// 顶栏风格
export enum HeaderStyleEnum {
  Page = "page",
  Bg = "bg",
  Line = "line",
  BgLine = "bgLine",
}

// 顶栏菜单位置
export enum HeaderMenuAlignEnum {
  Start = "start",
  Center = "center",
  End = "end",
}

// 主题面板触发按钮位置
export enum ThemePanelTriggerPositionEnum {
  Header = "header",
  Fixed = "fixed",
}
