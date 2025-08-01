import { computed } from "vue";
import { defineStore } from "pinia";
import {
  HeaderMenuAlignEnum,
  HeaderStyleEnum,
  LayoutModeEnum,
  MenuThemeEnum,
  PageTransitionEnum,
  GlobalThemeEnum,
  TabNavElementModeEnum,
  MenuShowModeEnum,
} from "@/common/enums";
import { serviceConfig } from "@/common/config";
import { cacheOperator, getCssVar, localStorageProxy } from "@/common/utils";
import { useNamespace } from "@/composables";

export const useSettingStore = defineStore(
  "settingStore",
  () => {
    const {
      layout: layoutConfig,
      breadcrumb: breadcrumbConfig,
      header: headerConfig,
      tabNav: tabNavConfig,
      menu: menuConfig,
      theme: themeConfig,
      logo: logoConfig,
      transition: transitionConfig,
      widget: widgetConfig,
      shortcutKey: shortcutKeyConfig,
    } = serviceConfig;

    const layout = reactive({
      titleMode: layoutConfig.titleMode,
      layoutMode: layoutConfig.layoutMode || LayoutModeEnum.Classic,
      menuTheme: layoutConfig.menuTheme || MenuThemeEnum.Light,
      maximize: layoutConfig.maximize,
      elementPlusSize: layoutConfig.elementPlusSize,
      watermark: layoutConfig.watermark,
      themePanelTriggerPosition: layoutConfig.themePanelTriggerPosition,
    });

    const theme = reactive({
      primaryColor: themeConfig.primaryColor ?? getCssVar(useNamespace().cssVar("color-primary")),
      radius: themeConfig.radius,
      globalThemeMode: themeConfig.globalThemeMode || GlobalThemeEnum.System,
      weakMode: themeConfig.weakMode,
      greyMode: themeConfig.greyMode,
    });

    const header = reactive({
      enabled: headerConfig.enabled,
      height: headerConfig.height,
      style: headerConfig.style || HeaderStyleEnum.Page,
      menuAlign: headerConfig.menuAlign || HeaderMenuAlignEnum.Start,
      showMode: headerConfig.showMode,
    });

    const menu = reactive({
      enabled: menuConfig.enabled,
      width: menuConfig.width,
      accordion: menuConfig.accordion,
      collapsed: menuConfig.collapsed,
      collapseWidth: menuConfig.collapseWidth,
      showMode: menuConfig.showMode || MenuShowModeEnum.Static,
      autoActivateChild: menuConfig.autoActivateChild,
      showModeAutoFixed: menuConfig.showModeAutoFixed,
      rightClickMenuCollapseToClose: menuConfig.rightClickMenuCollapseToClose,
    });

    const tabNav = reactive({
      enabled: tabNavConfig.enabled,
      elementMode: tabNavConfig.elementMode || TabNavElementModeEnum.Simple,
      persistence: tabNavConfig.persistence,
      showIcon: tabNavConfig.showIcon,
      showDot: tabNavConfig.showDot,
      fixed: tabNavConfig.fixed,
      draggable: tabNavConfig.draggable,
      height: tabNavConfig.height,
      middleClickToClose: tabNavConfig.middleClickToClose,
      middleClickToOpen: tabNavConfig.middleClickToOpen,
      middleClickToOpenInNewWindow: tabNavConfig.middleClickToOpenInNewWindow,
      showMore: tabNavConfig.showMore,
      wheel: tabNavConfig.wheel,
      maxCount: tabNavConfig.maxCount,
    });

    const breadcrumb = reactive({
      enabled: breadcrumbConfig.enabled,
      showIcon: breadcrumbConfig.showIcon,
      hideOnlyOne: breadcrumbConfig.hideOnlyOne,
      showHome: breadcrumbConfig.showHome,
      onlyShowHomeIcon: breadcrumbConfig.onlyShowHomeIcon,
    });
    const logo = reactive({
      enable: logoConfig.enable,
    });

    const transition = reactive({
      pageEnter: transitionConfig.pageEnter || PageTransitionEnum.SlideLeft,
      progress: transitionConfig.progress,
    });

    const widget = reactive({
      menuCollapse: widgetConfig.menuCollapse,
      refresh: widgetConfig.refresh,
      search: widgetConfig.search,
      fullscreen: widgetConfig.fullscreen,
      notification: widgetConfig.notification,
      language: widgetConfig.language,
      theme: widgetConfig.theme,
      lockScreen: widgetConfig.lockScreen,
    });

    const shortcutKey = reactive({
      enable: shortcutKeyConfig.enable,
      search: shortcutKeyConfig.search,
      logout: shortcutKeyConfig.logout,
      lockScreen: shortcutKeyConfig.lockScreen,
    });

    const isDark = computed(() => {
      if (theme.globalThemeMode === GlobalThemeEnum.System) {
        // 自动识别系统主题
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      return theme.globalThemeMode === GlobalThemeEnum.Dark;
    });

    /**
     * 打开侧边菜单
     */
    const expandSideMenu = () => (menu.collapsed = false);
    /**
     * 关闭侧边菜单
     */
    const collapseSideMenu = () => (menu.collapsed = true);

    /**
     * 切换侧边菜单
     */
    const toggleSideMenu = () => (menu.collapsed = !menu.collapsed);

    /**
     * 重置设置
     */
    const resetSetting = async () => {
      localStorageProxy.removeItem("settingStore");
      if (!tabNav.persistence) cacheOperator.removeCacheTabNavList();
    };

    return {
      layout,
      theme,
      tabNav,
      logo,
      breadcrumb,
      menu,
      header,
      transition,
      widget,
      shortcutKey,

      isDark,

      expandSideMenu,
      collapseSideMenu,
      toggleSideMenu,
      resetSetting,
    };
  },
  {
    persist: true,
  }
);
