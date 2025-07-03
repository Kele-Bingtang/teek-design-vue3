import { ref } from "vue";
import { defineStore } from "pinia";
import {
  HeaderStyleEnum,
  LayoutModeEnum,
  MenuThemeEnum,
  PageTransitionEnum,
  SystemThemeEnum,
  TabNavModeEnum,
} from "@/common/enums/appEnum";
import SystemConfig from "@/common/config";
import { cacheOperator, localStorageProxy } from "@/common/utils";

export const useSettingStore = defineStore(
  "settingStore",
  () => {
    const { themeConfig } = SystemConfig;

    const primaryColor = ref(themeConfig.primaryColor);
    const titleMode = ref(themeConfig.titleMode);
    const layoutMode = ref(themeConfig.layoutMode || LayoutModeEnum.Classic);
    const tabNavMode = ref(themeConfig.tabNavMode || TabNavModeEnum.Simple);
    const menuTheme = ref(themeConfig.menuTheme || MenuThemeEnum.Light);
    const pageTransition = ref(themeConfig.pageTransition || PageTransitionEnum.SlideLeft);
    const headerStyle = ref(themeConfig.headerStyle || HeaderStyleEnum.Page);
    const systemThemeMode = ref(themeConfig.systemThemeMode || SystemThemeEnum.System);
    const showTabNav = ref(themeConfig.showTabNav);
    const recordTabNav = ref(themeConfig.recordTabNav);
    const showLayoutLogo = ref(themeConfig.showLayoutLogo);
    const showBreadcrumb = ref(themeConfig.showBreadcrumb);
    const showBreadcrumbIcon = ref(themeConfig.showBreadcrumbIcon);
    const showTabNavIcon = ref(themeConfig.showTabNavIcon);
    const showTabNavDot = ref(themeConfig.showTabNavDot);
    const isCollapse = ref(themeConfig.isCollapse);
    const menuAccordion = ref(themeConfig.menuAccordion);
    const fixTabNav = ref(themeConfig.fixTabNav);
    const isWeak = ref(themeConfig.isWeak);
    const isGrey = ref(themeConfig.isGrey);
    const maximize = ref(themeConfig.maximize);
    const menuWidth = ref(themeConfig.menuWidth);
    const headerHeight = ref(themeConfig.headerHeight);
    const radius = ref(themeConfig.radius);
    const watermark = ref(themeConfig.watermark);

    const isDark = computed(() => {
      if (systemThemeMode.value === SystemThemeEnum.System) {
        // 自动识别系统主题
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      return systemThemeMode.value === SystemThemeEnum.Dark;
    });

    /**
     * 关闭侧边菜单
     */
    const closeSideMenu = () => {
      isCollapse.value = true;
    };

    /**
     * 切换侧边菜单
     */
    const toggleSideMenu = () => {
      isCollapse.value = !isCollapse.value;
    };

    /**
     * 重置设置
     */
    const resetSetting = async () => {
      localStorageProxy.removeItem("settingStore");
      if (!themeConfig.recordTabNav) cacheOperator.removeCacheTabNavList();
    };

    return {
      primaryColor,
      titleMode,
      layoutMode,
      tabNavMode,
      menuTheme,
      headerStyle,
      systemThemeMode,
      pageTransition,
      showTabNav,
      recordTabNav,
      showLayoutLogo,
      showBreadcrumb,
      showBreadcrumbIcon,
      showTabNavIcon,
      showTabNavDot,
      isCollapse,
      menuAccordion,
      fixTabNav,
      isDark,
      isWeak,
      isGrey,
      maximize,
      menuWidth,
      headerHeight,
      radius,
      watermark,

      closeSideMenu,
      toggleSideMenu,
      resetSetting,
    };
  },
  {
    persist: true,
  }
);
