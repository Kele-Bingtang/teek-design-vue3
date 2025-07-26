import { ref, readonly } from "vue";
import { useRoute } from "vue-router";
import { TitleModeEnum } from "@/common/enums";
import SystemConfig from "@/common/config";
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

  /**
   * 获取浏览器的页面预设标题
   */
  const getBrowserTitle = () => {
    const { name } = SystemConfig.systemInfo;
    const { titleMode } = settingStore;
    const pageTitle = formatTitle(route);

    // 展示标题的多种模式判断
    if (titleMode === TitleModeEnum.ProjectPage) return pageTitle ? `${name} - ${pageTitle}` : name;
    if (titleMode === TitleModeEnum.UsernamePage) {
      const { username } = userStore.userInfo;

      if (username && pageTitle) return `${username} - ${pageTitle}`;
      if (username) return `${name} - ${username}`;
      if (!pageTitle) return name;
    } else if (titleMode === TitleModeEnum.Project) return name;

    if (titleMode === TitleModeEnum.Page) return pageTitle + "";

    // 默认标题的模式
    return pageTitle ? `${name} - ${pageTitle}` : name;
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
