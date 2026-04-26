import { storeToRefs } from "pinia";
import { getLightColor, getDarkColor, setCssVar, getCssVar, removeCssVar } from "@/common/utils";
import { useSettingStore } from "@/pinia";
import { useNamespace } from "@/composables";

/**
 * 切换主题
 */
export const useTheme = () => {
  const ns = useNamespace();
  const settingStore = useSettingStore();

  const { isDark, theme: themeConfig } = storeToRefs(settingStore);

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
  const changeGlobalTheme = (
    theme = themeConfig.value.globalThemeMode,
    changeFunctionalColor = themeConfig.value.functionalColorStrictly
  ) => {
    // 临时禁用过渡效果
    disableTransitions();

    const { globalThemeMode } = themeConfig.value;

    if (theme !== globalThemeMode) settingStore.$patch({ theme: { globalThemeMode: theme } });

    // 兼容 ElementPlus 暗黑模式 class
    isDark.value ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");

    if (changeFunctionalColor) changeAllFunctionalColor();
    else deriveFunctionalColor(themeConfig.value.primaryColor, "primary");

    // 使用 requestAnimationFrame 确保在下一帧恢复过渡效果
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        enableTransitions();
      });
    });
  };

  /**
   * 修改主题外观
   */
  const changeThemeSurface = (
    surface = themeConfig.value.surface,
    changeFunctionalColor = themeConfig.value.functionalColorStrictly
  ) => {
    disableTransitions();

    document.documentElement.setAttribute("surface", surface);
    if (surface !== themeConfig.value.surface) settingStore.$patch({ theme: { surface } });

    if (changeFunctionalColor) changeAllFunctionalColor();
    else deriveFunctionalColor(themeConfig.value.primaryColor, "primary");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        enableTransitions();
      });
    });
  };

  /**
   * 修改所有功能色
   */
  const changeAllFunctionalColor = (reset = false, el = document.documentElement) => {
    const { primaryColor, successColor, warningColor, dangerColor, errorColor, infoColor } = themeConfig.value;

    changeFunctionalColor(reset ? primaryColor : "", "primary", el);
    changeFunctionalColor(reset ? successColor : "", "success", el);
    changeFunctionalColor(reset ? warningColor : "", "warning", el);
    changeFunctionalColor(reset ? dangerColor : "", "danger", el);
    changeFunctionalColor(reset ? errorColor : "", "error", el);
    changeFunctionalColor(reset ? infoColor : "", "info", el);
  };

  /**
   * 修改功能色
   */
  const changeFunctionalColor = (
    color: string,
    type: "primary" | "success" | "warning" | "danger" | "error" | "info" | "secondary" = "primary",
    el = document.documentElement
  ) => {
    // 定义颜色类型与 Store 字段、CSS 变量名的映射关系
    const colorConfig: Record<string, { storeKey: keyof typeof themeConfig.value; cssVarName: string }> = {
      primary: { storeKey: "primaryColor", cssVarName: ns.cssVarName(`color-primary`) },
      success: { storeKey: "successColor", cssVarName: ns.cssVarName(`color-success`) },
      warning: { storeKey: "warningColor", cssVarName: ns.cssVarName(`color-warning`) },
      danger: { storeKey: "dangerColor", cssVarName: ns.cssVarName(`color-danger`) },
      error: { storeKey: "errorColor", cssVarName: ns.cssVarName(`color-error`) },
      info: { storeKey: "infoColor", cssVarName: ns.cssVarName(`color-info`) },
    };
    const config = colorConfig[type];
    if (!config) return;

    const { storeKey, cssVarName } = config;

    removeCssVar([cssVarName], el);
    // 获取当前颜色：优先使用传入的 color，其次从 CSS 变量获取，最后默认为空
    const cssColor = getCssVar(cssVarName, el);
    const changeColor = color || cssColor || "";

    // 尝试更新 Store
    if (changeColor !== themeConfig.value[storeKey]) settingStore.$patch({ theme: { [storeKey]: changeColor } });

    // 尝试更新 CSS 变量
    if (changeColor !== cssColor) setCssVar(cssVarName, changeColor, el);

    // 特殊处理：如果是主色，需要衍生其他色阶
    if (type === "primary") deriveFunctionalColor(changeColor, "primary", el);
  };

  /**
   * 基于主色衍生其他颜色
   */
  const deriveFunctionalColor = (
    color: string,
    type: "primary" | "success" | "warning" | "danger" | "error" | "info" | "secondary" = "primary",
    el = document.documentElement
  ) => {
    // 颜色加深或变浅
    for (let i = 1; i <= 9; i++) {
      setCssVar(
        ns.cssVarNameEl(`color-${type}-light-${i}`),
        isDark.value ? `${getDarkColor(color, i / 10)}` : `${getLightColor(color, i / 10)}`,
        el
      );
    }
    for (let i = 1; i <= 9; i++) {
      setCssVar(ns.cssVarNameEl(`color-${type}-dark-${i}`), `${getDarkColor(color, i / 10)}`, el);
    }

    // 生成更淡的颜色
    // for (let i = 1; i < 16; i++) {
    //   const itemColor = colorBlend(color, "#ffffff", i / 16);
    //   if (itemColor) setCssVar(ns.cssVarNameEl(`color-${type}-lighter-${i}`), itemColor, el);
    // }
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
    changeGlobalTheme(themeConfig.value.globalThemeMode, false);
    changeThemeSurface(themeConfig.value.surface, false);
    changeAllFunctionalColor(true);

    if (themeConfig.value.greyMode) changeGreyOrWeak(true, "greyMode");
    if (themeConfig.value.weakMode) changeGreyOrWeak(true, "weakMode");
  };

  return {
    initTheme,
    changeFunctionalColor,
    changeGreyOrWeak,
    changeGlobalTheme,
    changeThemeSurface,
  };
};
