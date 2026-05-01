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
export enum TabNavElementModeEnum {
  Simple = "simple",
  Classic = "classic",
  Element = "element",
  Storage = "storage",
}

// 顶栏显示模式
export enum HeaderShowModeEnum {
  Static = "static",
  Fixed = "fixed",
  AutoHidden = "autoHidden",
  ScrollHidden = "scrollHidden",
}

// 系统主题
export enum GlobalThemeEnum {
  Light = "light",
  Dark = "dark",
  System = "system",
}

// 菜单主题
export enum MenuThemeEnum {
  Light = "light",
  Dark = "dark",
  Blue = "blue",
}

// 菜单风格
export enum MenuStyleEnum {
  Simple = "simple",
  Round = "round",
}

// 菜单显示模式
export enum MenuShowModeEnum {
  Static = "static",
  AutoCollapse = "autoCollapse",
  AutoHidden = "autoHidden",
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
  SlideTop = "slide-top",
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

// 主题外观枚举
export enum ThemeSurfaceEnum {
  TeekBrand = "teek-brand",
  CloudWhite = "cloud-white",
  MonoMinimal = "mono-minimal",
  SlatePro = "slate-pro",
  SteelCool = "steel-cool",
  OceanBreeze = "ocean-breeze",
  ForestMoss = "forest-moss",
  SunsetDune = "sunset-dune",
  WarmPaper = "warm-paper",
  LilacMist = "lilac-mist",
  BerrySweet = "berry-sweet",
  NordAurora = "nord-aurora",
  DeepSpace = "deep-space",
  VintageTech = "vintage-tech",
  DeepWood = "deep-wood",
  MidnightLavender = "midnight-lavender",
  JadeLuxe = "jade-luxe",
  DesertSand = "desert-sand",
  DuskHorizon = "dusk-horizon",
  ObsidianGlass = "obsidian-glass",
  CandyFloss = "candy-floss",
  PopArt = "pop-art",
  CyberpunkElectric = "cyberpunk-electric",
  HackerTerminal = "hacker-terminal",
}
