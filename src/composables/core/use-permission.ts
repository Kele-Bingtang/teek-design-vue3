import router from "@/router";
import { useUserStore } from "@/pinia";
import { containsAll, containsAny, isString } from "@/common/utils";

/**
 * 权限管理
 */
export const usePermission = () => {
  const userStore = useUserStore();

  /**
   * 获取角色列表
   */
  const getRoleList = () => {
    return userStore.roles;
  };

  /**
   * 判断是否具有角色
   *
   * @param value 角色
   */
  const hasRole = (value: string | string[]) => {
    if (!value) return false;
    const roleList = getRoleList();
    return isString(value) ? roleList.includes(value) : containsAny(roleList, value);
  };

  /**
   * 获取权限列表
   */
  const getAuthList = () => {
    return router.currentRoute.value.meta.auths as string[];
  };

  /**
   * 判断是否具有权限
   *
   * @param value 权限
   */
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
