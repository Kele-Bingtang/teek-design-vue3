import { computed } from "vue";
import { defineStore } from "pinia";
import {
  HeaderMenuAlignEnum,
  HeaderStyleEnum,
  LayoutModeEnum,
  MenuThemeEnum,
  PageTransitionEnum,
  SystemThemeEnum,
  TabNavModeEnum,
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
    } = serviceConfig;

    const layout = reactive({
      titleMode: layoutConfig.titleMode,
      layoutMode: layoutConfig.layoutMode || LayoutModeEnum.Classic,
      menuTheme: layoutConfig.menuTheme || MenuThemeEnum.Light,
      isWeak: layoutConfig.isWeak,
      isGrey: layoutConfig.isGrey,
      maximize: layoutConfig.maximize,
      elementPlusSize: layoutConfig.elementPlusSize,
      watermark: layoutConfig.watermark,
      themePanelTriggerPosition: layoutConfig.themePanelTriggerPosition,
    });

    const theme = reactive({
      primaryColor: themeConfig.primaryColor ?? getCssVar(useNamespace().cssVar("color-primary")),
      radius: themeConfig.radius,
      systemThemeMode: themeConfig.systemThemeMode || SystemThemeEnum.System,
    });

    const tabNav = reactive({
      enabled: tabNavConfig.enabled,
      tabNavMode: tabNavConfig.tabNavMode || TabNavModeEnum.Simple,
      recordTabNav: tabNavConfig.recordTabNav,
      showTabNavIcon: tabNavConfig.showTabNavIcon,
      showTabNavDot: tabNavConfig.showTabNavDot,
      fixTabNav: tabNavConfig.fixTabNav,
      draggable: tabNavConfig.draggable,
      height: tabNavConfig.height,
      middleClickToClose: tabNavConfig.middleClickToClose,
      middleClickToOpen: tabNavConfig.middleClickToOpen,
      showMore: tabNavConfig.showMore,
      wheel: tabNavConfig.wheel,
    });

    const logo = reactive({
      enable: logoConfig.enable,
    });

    const breadcrumb = reactive({
      enabled: breadcrumbConfig.enabled,
      showIcon: breadcrumbConfig.showIcon,
      hideOnlyOne: breadcrumbConfig.hideOnlyOne,
      showHome: breadcrumbConfig.showHome,
      onlyShowHomeIcon: breadcrumbConfig.onlyShowHomeIcon,
    });

    const menu = reactive({
      width: menuConfig.width,
      accordion: menuConfig.accordion,
      isCollapse: menuConfig.isCollapse,
    });

    const header = reactive({
      enabled: headerConfig.enabled,
      style: headerConfig.style || HeaderStyleEnum.Page,
      height: headerConfig.height,
      menuAlign: headerConfig.menuAlign || HeaderMenuAlignEnum.Start,
    });

    const transition = reactive({
      page: transitionConfig.page || PageTransitionEnum.SlideLeft,
      progress: transitionConfig.progress,
    });

    const isDark = computed(() => {
      if (theme.systemThemeMode === SystemThemeEnum.System) {
        // 自动识别系统主题
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      return theme.systemThemeMode === SystemThemeEnum.Dark;
    });

    /**
     * 打开侧边菜单
     */
    const openSideMenu = () => (menu.isCollapse = false);
    /**
     * 关闭侧边菜单
     */
    const closeSideMenu = () => (menu.isCollapse = true);

    /**
     * 切换侧边菜单
     */
    const toggleSideMenu = () => (menu.isCollapse = !menu.isCollapse);

    /**
     * 重置设置
     */
    const resetSetting = async () => {
      localStorageProxy.removeItem("settingStore");
      if (!tabNav.recordTabNav) cacheOperator.removeCacheTabNavList();
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

      isDark,

      openSideMenu,
      closeSideMenu,
      toggleSideMenu,
      resetSetting,
    };
  },
  {
    persist: true,
  }
);
