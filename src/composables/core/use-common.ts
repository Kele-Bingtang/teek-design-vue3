import { mobileMaxWidthMedia, RefreshPageKey } from "@/common/config";
import { useMediaQuery } from "@vueuse/core";

/**
 * 复用性较高的变量或方法
 */
export const useCommon = () => {
  const refreshPage = inject(RefreshPageKey, (value?: boolean) => value);

  const isMobile = useMediaQuery(mobileMaxWidthMedia);

  return {
    isMobile,
    refreshPage,
  };
};
