import type { RouteLocationNormalizedLoaded } from "vue-router";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { useRouteStore } from "@/pinia";
import { useRouteFn } from "./use-route-fn";
import { tryOnScopeDispose } from "@vueuse/core";
import { formatTitle } from "@/router/helper";
import { LAYOUT_NAME } from "@/common/config";

export const useBreadcrumbs = () => {
  const breadcrumbList = ref<RouteLocationNormalizedLoaded[]>([]);
  const { homeRoute, loadedRouteList } = useRouteStore();
  const { findParentRoutesByPath } = useRouteFn();
  const route = useRoute();

  /**
   * 获取面包屑列表
   */
  const getBreadcrumbs = (route: RouteLocationNormalizedLoaded): RouteLocationNormalizedLoaded[] => {
    // 首页不存在
    if (!homeRoute?.path || !homeRoute?.name) {
      ElMessage.error({
        message: "您的首页无法获取，请前往 router/routesConfig.ts，找到 HOME_NAME，修改为您首页路由的 name 值",
        duration: 10000,
      });
      return [];
    }

    // 如果是首页，直接返回
    if (route.path === homeRoute?.path || route.name === homeRoute?.name) {
      return [homeRoute] as RouteLocationNormalizedLoaded[];
    }

    // 当前路由的父级路由组成的数组
    let matched = findParentRoutesByPath(route.meta._fullPath, loadedRouteList) as RouteLocationNormalizedLoaded[];
    route.meta.title = formatTitle(route);
    matched.push(route);

    // 首页加上其他页面
    matched = [homeRoute as RouteLocationNormalizedLoaded, ...matched];
    // 过滤掉 hideInBread 的配置
    return matched.filter(
      item => (item.name || item.meta?.title) && !item.meta?.hideInBread && item.name !== LAYOUT_NAME
    );
  };

  const stop = watch(
    () => route.fullPath,
    () => (breadcrumbList.value = getBreadcrumbs(route)),
    { immediate: true }
  );

  tryOnScopeDispose(stop);

  return { breadcrumbList, getBreadcrumbs };
};
