import { ref } from "vue";
import { defineStore } from "pinia";

export const useRouteStore = defineStore("routeStore", () => {
  const loadedRouteList = ref<RouterConfig[]>([]);
  const flatRouteList = ref<RouterConfig[]>([]);

  // 路由里首页的 name 值，必须填且正确，默认为 Home
  const homeRoute = ref<RouterConfig | null>(null);

  const setRoutes = (routers: RouterConfig[]) => {
    loadedRouteList.value = routers;
  };

  const setFlatRoutes = (routers: RouterConfig[]) => {
    flatRouteList.value = routers;
  };

  const setHomeRoute = (route: RouterConfig | null) => {
    homeRoute.value = route;
  };

  return {
    loadedRouteList,
    homeRoute,
    flatRouteList,

    setRoutes,
    setFlatRoutes,
    setHomeRoute,
  };
});
