import { storeToRefs } from "pinia";
import { getLightColor, getDarkColor, setCssVar, colorBlend } from "@/common/utils";
import { SystemThemeEnum } from "@/common/enums";
import { useSettingStore } from "@/pinia";
import { useNamespace } from "@/composables";

/**
 * 切换主题
 */
export const useTheme = () => {
  const ns = useNamespace();
  const settingStore = useSettingStore();

  const { isDark, layout, theme: themeConfig } = storeToRefs(settingStore);
  const { Light, Dark } = SystemThemeEnum;

  const systemThemeStyle = {
    [Light]: { className: "" },
    [Dark]: { className: SystemThemeEnum.Dark },
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
   * 修改系统主题
   */
  const changeSystemTheme = (theme = themeConfig.value.systemThemeMode) => {
    // 临时禁用过渡效果
    disableTransitions();

    if (theme !== themeConfig.value.systemThemeMode) settingStore.$patch({ theme: { systemThemeMode: theme } });

    const currentTheme = systemThemeStyle[isDark.value ? Dark : Light];
    if (currentTheme) document.documentElement.setAttribute("class", currentTheme.className);

    // 颜色加深或变浅
    for (let i = 1; i <= 9; i++) {
      setCssVar(
        ns.cssVarNameEl(`color-primary-light-${i}`),
        isDark.value
          ? `${getDarkColor(themeConfig.value.primaryColor, i / 10)}`
          : `${getLightColor(themeConfig.value.primaryColor, i / 10)}`
      );
    }

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
  const changePrimaryColor = (color = themeConfig.value.primaryColor) => {
    if (color !== themeConfig.value.primaryColor) settingStore.$patch({ theme: { primaryColor: color } });

    // 兼容暗黑模式，自动计算主题颜色由深到浅的其他颜色
    setCssVar(ns.cssVarNameEl(`color-primary`), color);

    // 颜色加深或变浅
    for (let i = 1; i <= 9; i++) {
      setCssVar(
        ns.cssVarNameEl(`color-primary-light-${i}`),
        isDark.value ? `${getDarkColor(color, i / 10)}` : `${getLightColor(color, i / 10)}`
      );
    }
    for (let i = 1; i <= 9; i++) {
      setCssVar(ns.cssVarNameEl(`color-primary-dark-${i}`), `${getDarkColor(color, i / 10)}`);
    }

    // 生成更淡的颜色
    for (let i = 1; i < 16; i++) {
      const itemColor = colorBlend(color, "#ffffff", i / 16);
      if (itemColor) setCssVar(ns.cssVarNameEl(`color-primary-lighter-${i}`), itemColor);
    }
  };

  // 灰色和弱色切换
  const changeGreyOrWeak = (value: boolean, type: string) => {
    const body = document.body as HTMLElement;

    if (!value) return body.setAttribute("style", "");
    if (type === "grey") body.setAttribute("style", "filter: grayscale(1) ");
    if (type === "weak") body.setAttribute("style", "filter: invert(80%)");

    const propName = type === "grey" ? "isWeak" : "isGrey";
    settingStore.$patch({ [propName]: false });
  };

  // 初始化 primaryColor 配置
  const initTheme = () => {
    changePrimaryColor();
    changeSystemTheme();

    if (layout.value.isGrey) changeGreyOrWeak(true, "grey");
    if (layout.value.isWeak) changeGreyOrWeak(true, "weak");
  };

  return {
    initTheme,
    changePrimaryColor,
    changeGreyOrWeak,
    changeSystemTheme,
  };
};
