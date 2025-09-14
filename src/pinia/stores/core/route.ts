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

  const addRoutes = (routers: RouterConfig[]) => {
    loadedRouteList.value = loadedRouteList.value.concat(routers);
  };

  const setFlatRoutes = (routers: RouterConfig[]) => {
    flatRouteList.value = routers;
  };

  const addFlatRoutes = (routers: RouterConfig[]) => {
    flatRouteList.value = flatRouteList.value.concat(routers);
  };

  const setHomeRoute = (route: RouterConfig | null) => {
    homeRoute.value = route;
  };

  return {
    loadedRouteList,
    homeRoute,
    flatRouteList,

    setRoutes,
    addRoutes,
    setFlatRoutes,
    addFlatRoutes,
    setHomeRoute,
  };
});
