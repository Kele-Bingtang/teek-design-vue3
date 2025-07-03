import { useRoute } from "vue-router";
import router from "@/router";
import { useUserStore } from "@/pinia";
import { containsAll, containsAny, isString } from "@/common/utils";

export const usePermission = () => {
  const userStore = useUserStore();

  const getRoleList = () => {
    return userStore.roles;
  };

  const hasRole = (value: string | string[]) => {
    if (!value) return false;
    const roleList = getRoleList();
    return isString(value) ? roleList.includes(value) : containsAny(roleList, value);
  };

  const getAuthList = () => {
    // 不能放到外面，否则 v-role 失效，因为 v-role 自定义指令不支持 useRoute()
    const route = useRoute();
    return route.meta.auths;
  };

  const hasAuth = (value: string | string[]) => {
    if (!value) return false;

    const authList = getAuthList();
    if (!authList) return false;

    return isString(value) ? authList.includes(value) : containsAll(authList, value);
  };

  return {
    getRoleList,
    getAuthList,
    hasRole,
    hasAuth,
  };
};

/**
 * 可以在任意文件调用，不再拘束于 setup
 */
export const usePermissionNoSetup = () => {
  const getAuthList = () => {
    return router.currentRoute.value.meta.auths as string[];
  };

  const hasAuth = (value: string | string[]) => {
    if (!value) return false;
    const authList = getAuthList();
    if (!authList) return false;
    return isString(value) ? authList.includes(value) : containsAll(authList, value);
  };

  return {
    getAuthList,
    hasAuth,
  };
};
