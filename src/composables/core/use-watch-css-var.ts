import { watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/pinia";
import { addUnit, removeCssVar, setCssVar } from "@/common/utils";
import { HeaderStyleEnum } from "@/common/enums";
import { useNamespace } from "./use-namespace";

/**
 * 监听并初始化 css 变量
 */
export const useWatchCssVar = () => {
  const ns = useNamespace();
  const settingStore = useSettingStore();

  const { header, menu, theme, tabNav } = storeToRefs(settingStore);

  // 顶栏高度变量
  watchEffect(() => setCssVar(ns.cssVarName("layout-header-height"), addUnit(header.value.height)));
  // 展开菜单宽度变量
  watchEffect(() => setCssVar(ns.cssVarName("layout-expand-aside-width"), addUnit(menu.value.width)));
  //  折叠菜单宽度变量
  watchEffect(() => setCssVar(ns.cssVarName("layout-collapse-aside-width"), addUnit(menu.value.collapseWidth)));
  // 标签栏高度
  watchEffect(() => setCssVar(ns.cssVarName("layout-tab-height"), addUnit(tabNav.value.height)));
  // 圆角变量
  watchEffect(() => setCssVar(ns.cssVarName("radius"), addUnit(theme.value.radius, "rem")));

  // 顶栏和标签栏的背景色、线条变量
  watchEffect(() => {
    const headerBg = ns.cssVarName("layout-header-bg-color");
    const tabBg = ns.cssVarName("layout-tab-bg-color");
    const bgStyle = ns.cssVar("bg-color");

    const headerLine = ns.cssVarName("layout-header-line");
    const tabLine = ns.cssVarName("layout-tab-line");
    const borderStyle = `1px solid ${ns.cssVar("card-border-color-primary")}`;

    if (header.value.style === HeaderStyleEnum.Page) return removeCssVar([headerBg, tabBg, headerLine, tabLine]);

    if (header.value.style === HeaderStyleEnum.Bg) {
      removeCssVar([headerLine, tabLine]);

      setCssVar(headerBg, bgStyle);
      setCssVar(tabBg, bgStyle);
    }

    if (header.value.style === HeaderStyleEnum.Line) {
      removeCssVar([headerBg, tabBg]);

      setCssVar(headerLine, borderStyle);
      setCssVar(tabLine, borderStyle);
    }

    if (header.value.style === HeaderStyleEnum.BgLine) {
      setCssVar(headerBg, bgStyle);
      setCssVar(tabBg, bgStyle);
      setCssVar(headerLine, borderStyle);
      setCssVar(tabLine, borderStyle);
    }
  });
};
