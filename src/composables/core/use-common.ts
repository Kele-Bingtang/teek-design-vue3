import type { TabProps } from "@/pinia";
import { useMediaQuery } from "@vueuse/core";
import { mobileMaxWidthMedia, RefreshPageKey } from "@/common/config";
import { formatTitle } from "@/router/helper";
import { useLayoutStore } from "@/pinia";
import { mittBus } from "@/common/utils";

/**
 * 复用性较高的变量或方法
 */
export const useCommon = () => {
  const refreshPage = (value?: boolean) => mittBus.emit(RefreshPageKey, value);

  const isMobile = useMediaQuery(mobileMaxWidthMedia);
  const layoutStore = useLayoutStore();

  /**
   * 获取路由标题
   */
  const getTitle = (routeConfig: RouterConfig | TabProps) => {
    routeConfig.meta.title = formatTitle(routeConfig);

    watch(
      () => layoutStore.language,
      () => {
        routeConfig.meta.title = formatTitle(routeConfig, true);
      }
    );

    return routeConfig.meta.title;
  };

  return {
    isMobile,
    refreshPage,
    getTitle,

    ...__APP_INFO__.pkg,
    lastBuildTime: __APP_INFO__.lastBuildTime,
  };
};
