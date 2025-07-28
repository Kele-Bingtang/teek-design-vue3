import { ref, readonly } from "vue";
import { useRoute } from "vue-router";
import { TitleModeEnum } from "@/common/enums";
import { serviceConfig } from "@/common/config";
import { formatTitle } from "@/router/helper";
import { useSettingStore, useUserStore } from "@/pinia";

/**
 * 浏览器标题管理
 */
export const useBrowserTitle = () => {
  const settingStore = useSettingStore();
  const userStore = useUserStore();
  const route = useRoute();

  const browserTitle = ref("");

  const { layout } = storeToRefs(settingStore);

  /**
   * 获取浏览器的页面预设标题
   */
  const getBrowserTitle = () => {
    const { name } = serviceConfig.layout;
    const pageTitle = formatTitle(route);

    // 展示标题的多种模式判断
    if (layout.value.titleMode === TitleModeEnum.ProjectPage) return pageTitle ? `${name} - ${pageTitle}` : name;
    if (layout.value.titleMode === TitleModeEnum.UsernamePage) {
      const { username } = userStore.userInfo;

      if (username && pageTitle) return `${username} - ${pageTitle}`;
      if (username) return `${name} - ${username}`;
      if (!pageTitle) return name;
    } else if (layout.value.titleMode === TitleModeEnum.Project) return name;

    if (layout.value.titleMode === TitleModeEnum.Page) return pageTitle + "";

    // 默认标题的模式
    browserTitle.value = pageTitle ? `${name} - ${pageTitle}` : name;
    return browserTitle.value;
  };

  /**
   * 设置浏览器标题
   *
   * @param title 标题
   */
  const setBrowserTitle = (title?: string) => {
    browserTitle.value = getBrowserTitle();
    window.document.title = title || browserTitle.value;
  };

  return { browserTitle: readonly(browserTitle), getBrowserTitle, setBrowserTitle };
};
