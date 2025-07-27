import type { Router } from "vue-router";
import { serviceConfig } from "@/common/config";
import { NProgress } from "@/common/utils";

export function createProgressGuard(router: Router) {
  /**
   * 路由跳转开始
   */
  router.beforeEach((_to, _from, next) => {
    serviceConfig.transition.progress && NProgress.start();
    next();
  });

  /**
   * 路由跳转结束
   */
  router.afterEach(() => {
    serviceConfig.transition.progress && NProgress.done();
  });

  /**
   * 路由跳转错误
   **/
  router.onError(() => {
    serviceConfig.transition.progress && NProgress.done();
  });
}
