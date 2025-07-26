import type { Router } from "vue-router";
import { NProgress } from "@/common/utils";

export function createProgressGuard(router: Router) {
  /**
   * 路由跳转开始
   */
  router.beforeEach((_to, _from, next) => {
    NProgress.start();
    next();
  });

  /**
   * 路由跳转结束
   */
  router.afterEach(() => {
    NProgress.done();
  });

  /**
   * 路由跳转错误
   **/
  router.onError(() => {
    NProgress.done();
  });
}
