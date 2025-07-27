import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouteStore } from "@/pinia";
import { serviceConfig, LAYOUT_NAME } from "@/common/config";

/**
 * 菜单管理
 */
export const useMenu = () => {
  const menuList = ref<RouterConfig[]>([]);
  const { loadedRouteList } = storeToRefs(useRouteStore());

  /**
   * 将路由表解析成菜单列表
   *
   * @param loadRolesRoutes 权限路由
   */
  const formatRoutesToMenu = (routes = loadedRouteList.value) => {
    const menusList: RouterConfig[] = [];

    routes.forEach(route => {
      // 如果是布局组件，则跳过
      if (route.name === LAYOUT_NAME) return;
      // 如果配置了 hideInMenu: true，则跳过
      if (route.meta?.hideInMenu) return;
      // 如果只有一个子路由且 alwaysShowRoot 为 false | undefined，则子路由成为一级菜单
      if (route.children?.length === 1 && !route.meta?.alwaysShowRoot) {
        const children = formatRoutesToMenu(route.children);
        children.length && menusList.push(children[0]);
      } else {
        // 否则，生成子菜单列表
        const children = formatRoutesToMenu(route.children || []);
        if (children.length) route.children = children;
        menusList.push(route);
      }
    });
    return menusList;
  };

  const getMenuList = (routes = loadedRouteList.value) => {
    /**
     * 第一次是将 hideInMenu 和 Children 为 1 的过滤掉，第二次是将最终 Children 为 1 的过滤掉（可能第一次 Children 有多个，只有一个 hideInMenu 不为 true）
     *
     * 场景：alwaysShowRoot 为 false
     *    如果一个路由有一个子路由，那么菜单只渲染出该子路由
     *    如果一个路由有两个子路由，其中一个子路由为 hideInMenu 为 true，那么菜单只渲染出另一个子路由
     *    如果一个路由有两个子路由，且都不是 hideInMenu，那么两个子路由为二级菜单
     *
     * 如果您确保您的路由不会出现：多个子路由且只有一个 hideInMenu 不为 true，可以只过滤一次提升性能
     */
    if (serviceConfig.layout.moreRouteChildrenHideInMenuThenOnlyOne)
      return formatRoutesToMenu(formatRoutesToMenu(routes));
    else return formatRoutesToMenu(routes);
  };

  watch(
    loadedRouteList,
    newVal => {
      menuList.value = getMenuList(newVal);
    },
    { immediate: true }
  );

  return { menuList, getMenuList };
};
