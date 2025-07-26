import { useBrowserTitle } from "@/composables";
import type { Router } from "vue-router";

export function createBrowserTitleGuard(router: Router) {
  /**
   * 路由跳转结束
   */
  router.afterEach(_to => {
    const { setBrowserTitle } = useBrowserTitle();
    setBrowserTitle();
  });
}
