import type { Router } from "vue-router";
import { createAuthGuard } from "./auth";
import { createBrowserTitleGuard } from "./browser-title";
import { createProgressGuard } from "./progress";

export function createRouterGuard(router: Router) {
  createProgressGuard(router);
  createAuthGuard(router);
  createBrowserTitleGuard(router);

  /**
   * 路由跳转错误
   **/
  router.onError(error => {
    console.warn("路由错误", error.message);
  });
}
