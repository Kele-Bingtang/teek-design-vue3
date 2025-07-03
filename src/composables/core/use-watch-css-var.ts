import { useSettingStore } from "@/pinia";
import { addUnit, removeCssVar, setCssVar } from "@/common/utils";
import { HeaderStyleEnum } from "@/common/enums/appEnum";
import { useNamespace } from "./use-namespace";

/**
 * 监听并初始化 css 变量
 */
export const useWatchCssVar = () => {
  const ns = useNamespace();
  const settingStore = useSettingStore();

  const { menuWidth, headerHeight, headerStyle, radius } = storeToRefs(settingStore);

  // 展开菜单宽度变量
  watchEffect(() => setCssVar(ns.cssVarName("layout-open-aside-width"), addUnit(menuWidth.value)));
  //  折叠菜单宽度变量
  watchEffect(() => setCssVar(ns.cssVarName("layout-close-aside-width"), "64px"));
  // 顶部高度变量
  watchEffect(() => setCssVar(ns.cssVarName("layout-header-height"), addUnit(headerHeight.value)));
  // 圆角变量
  watchEffect(() => setCssVar(ns.cssVarName("radius"), addUnit(radius.value, "rem")));
  // 顶部和标签栏的背景色、线条变量
  watchEffect(() => {
    const headerBg = ns.cssVarName("layout-header-bg-color");
    const tabBg = ns.cssVarName("layout-tab-bg-color");
    const bgStyle = ns.cssVar("bg-color");

    const headerLine = ns.cssVarName("layout-header-line");
    const tabLine = ns.cssVarName("layout-tab-line");
    const borderStyle = `1px solid ${ns.cssVar("card-border-color-primary")}`;

    if (headerStyle.value === HeaderStyleEnum.Page) return removeCssVar([headerBg, tabBg, headerLine, tabLine]);

    if (headerStyle.value === HeaderStyleEnum.Bg) {
      removeCssVar([headerLine, tabLine]);

      setCssVar(headerBg, bgStyle);
      setCssVar(tabBg, bgStyle);
    }

    if (headerStyle.value === HeaderStyleEnum.Line) {
      removeCssVar([headerBg, tabBg]);

      setCssVar(headerLine, borderStyle);
      setCssVar(tabLine, borderStyle);
    }

    if (headerStyle.value === HeaderStyleEnum.BgLine) {
      setCssVar(headerBg, bgStyle);
      setCssVar(tabBg, bgStyle);
      setCssVar(headerLine, borderStyle);
      setCssVar(tabLine, borderStyle);
    }
  });
};
