import { inject } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { mobileMaxWidthMedia, RefreshPageKey } from "@/common/config";

/**
 * 复用性较高的变量或方法
 */
export const useCommon = () => {
  const refreshPage = inject(RefreshPageKey, (value?: boolean) => value);

  const isMobile = useMediaQuery(mobileMaxWidthMedia);

  return {
    isMobile,
    refreshPage,
    ...__APP_INFO__.pkg,
    lastBuildTime: __APP_INFO__.lastBuildTime,
  };
};
