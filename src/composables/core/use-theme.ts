import { storeToRefs } from "pinia";
import { getLightColor, getDarkColor, setCssVar, colorBlend, getCssVar } from "@/common/utils";
import { serviceConfig } from "@/common/config";
import { GlobalThemeEnum } from "@/common/enums";
import { useSettingStore } from "@/pinia";
import { useNamespace } from "@/composables";

/**
 * 切换主题
 */
export const useTheme = () => {
  const ns = useNamespace();
  const settingStore = useSettingStore();

  const { isDark, theme: themeConfig, primaryColor } = storeToRefs(settingStore);
  const { System } = GlobalThemeEnum;

  /**
   * 禁用过渡效果
   */
  const disableTransitions = () => {
    const style = document.createElement("style");
    style.setAttribute("id", "disable-transitions");
    style.textContent = "* { transition: none !important; }";
    document.head.appendChild(style);
  };

  /**
   * 启用过渡效果
   */
  const enableTransitions = () => {
    const style = document.getElementById("disable-transitions");
    if (style) style.remove();
  };

  /**
   * 修改全局主题
   */
  const changeGlobalTheme = (theme = themeConfig.value.globalThemeMode) => {
    // 临时禁用过渡效果
    disableTransitions();

    const { globalThemeClassName } = serviceConfig.theme;
    const { globalThemeMode, defaultDarkMode } = themeConfig.value;

    if (theme !== globalThemeMode) settingStore.$patch({ theme: { globalThemeMode: theme } });

    const currentThemeClassName = globalThemeClassName[theme];
    const el = document.documentElement;

    // 删除所有主题 class，然后添加切换后的主题 class
    Object.values(globalThemeClassName).forEach(item => item && el.classList.remove(item));
    currentThemeClassName && el.classList.add(currentThemeClassName);

    // 兼容 ElementPlus 暗黑模式 class
    isDark.value ? el.classList.add("dark") : el.classList.remove("dark");

    // 暗黑模式的跟随系统默认为 defaultDarkMode 指定的主题
    theme === System && isDark.value && el.classList.add(globalThemeClassName[defaultDarkMode]);

    // 获取主题切换后的主题色
    if (primaryColor.value) changePrimaryColor(primaryColor.value, el);

    // 使用 requestAnimationFrame 确保在下一帧恢复过渡效果
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        enableTransitions();
      });
    });
  };

  /**
   * 修改主题颜色
   */
  const changePrimaryColor = (color = primaryColor.value, el = document.documentElement) => {
    const primaryColor = themeConfig.value.primaryColor;
    const globalThemeMode = themeConfig.value.globalThemeMode;
    const defaultColor = primaryColor[globalThemeMode];

    if (defaultColor && color !== defaultColor) {
      primaryColor[globalThemeMode] = color;
      settingStore.$patch({ theme: { primaryColor } });
    }

    // el-color-primary = tk-color-primary，因此只需要改 tk-color-primary 的颜色
    const pc = getCssVar(ns.cssVarName(`color-primary`), el);
    if (pc && color !== pc) setCssVar(ns.cssVarName(`color-primary`), color, el);

    color && deriveColorByPrimary(color, el);
  };

  /**
   * 基于主题色衍生其他颜色
   */
  const deriveColorByPrimary = (color = primaryColor.value, el = document.documentElement) => {
    // 颜色加深或变浅
    for (let i = 1; i <= 9; i++) {
      setCssVar(
        ns.cssVarNameEl(`color-primary-light-${i}`),
        isDark.value ? `${getDarkColor(color, i / 10)}` : `${getLightColor(color, i / 10)}`,
        el
      );
    }
    for (let i = 1; i <= 9; i++) {
      setCssVar(ns.cssVarNameEl(`color-primary-dark-${i}`), `${getDarkColor(color, i / 10)}`, el);
    }

    // 生成更淡的颜色
    for (let i = 1; i < 16; i++) {
      const itemColor = colorBlend(color, "#ffffff", i / 16);
      if (itemColor) setCssVar(ns.cssVarNameEl(`color-primary-lighter-${i}`), itemColor, el);
    }
  };

  // 灰色和弱色切换
  const changeGreyOrWeak = (value: boolean, type: "greyMode" | "weakMode") => {
    const body = document.body as HTMLElement;

    if (!value) return body.setAttribute("style", "");
    if (type === "greyMode") body.setAttribute("style", "filter: grayscale(1) ");
    if (type === "weakMode") body.setAttribute("style", "filter: invert(80%)");

    const propName = type === "greyMode" ? "weakMode" : "greyMode";
    settingStore.$patch({ theme: { [propName]: false } });
  };

  // 初始化主题配置
  const initTheme = () => {
    changeGlobalTheme();

    if (themeConfig.value.greyMode) changeGreyOrWeak(true, "greyMode");
    if (themeConfig.value.weakMode) changeGreyOrWeak(true, "weakMode");
  };

  return {
    initTheme,
    changePrimaryColor,
    changeGreyOrWeak,
    changeGlobalTheme,
  };
};
