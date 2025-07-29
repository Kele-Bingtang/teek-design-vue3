import { storeToRefs } from "pinia";
import { getLightColor, getDarkColor, setCssVar, colorBlend, getCssVar } from "@/common/utils";
import { GlobalThemeEnum } from "@/common/enums";
import { useSettingStore } from "@/pinia";
import { useNamespace } from "@/composables";

/**
 * 切换主题
 */
export const useTheme = () => {
  const ns = useNamespace();
  const settingStore = useSettingStore();

  const { isDark, theme: themeConfig } = storeToRefs(settingStore);
  const { Light, Dark } = GlobalThemeEnum;

  const globalThemeStyle = {
    [Light]: { className: "" },
    [Dark]: { className: GlobalThemeEnum.Dark },
  };

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

    if (theme !== themeConfig.value.globalThemeMode) settingStore.$patch({ theme: { globalThemeMode: theme } });

    const currentTheme = globalThemeStyle[isDark.value ? Dark : Light];
    const oldTheme = globalThemeStyle[isDark.value ? Light : Dark];
    const el = document.documentElement;

    oldTheme.className && el.classList.remove(oldTheme.className);
    currentTheme.className && el.classList.add(currentTheme.className);

    // 获取主题切换后的主题色
    const primaryColor = getCssVar(ns.cssVarNameEl(`color-primary`), el) || themeConfig.value.primaryColor;
    if (primaryColor) deriveColorByPrimary(primaryColor, el);

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
  const changePrimaryColor = (color = themeConfig.value.primaryColor, el = document.documentElement) => {
    if (color !== themeConfig.value.primaryColor) settingStore.$patch({ theme: { primaryColor: color } });

    const primaryColor = getCssVar(ns.cssVarNameEl(`color-primary`), el);
    if (color !== primaryColor) setCssVar(ns.cssVarNameEl(`color-primary`), color, el);

    deriveColorByPrimary(color, el);
  };

  /**
   * 基于主题色衍生其他颜色
   */
  const deriveColorByPrimary = (color = themeConfig.value.primaryColor, el = document.documentElement) => {
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
    changePrimaryColor();

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
