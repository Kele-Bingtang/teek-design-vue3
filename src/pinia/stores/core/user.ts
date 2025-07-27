import type { LoginParams } from "@/common/api/user";
import { ref } from "vue";
import { defineStore } from "pinia";
import { useRouteFn } from "@/composables";
import { resetRouter } from "@/router";
import { useLayoutStore } from "./layout";

export interface UserInfo {
  /** 用户 ID */
  userId?: string;
  /** 用户名 */
  username?: string;
  /** 用户性别 */
  sex?: string;
  /** 签名 */
  signature?: string;
  /** 用户邮箱 */
  email?: string;
  /** 用户联系方式 */
  phone?: string;
  /** 用户头像 */
  avatar?: string;
  /** 用户角色 */
  roles?: string[];
  /** 职位 */
  job?: string;
  /** 部门 */
  dept?: string;
  /** 注册时间 */
  registerTime?: string;
}

export const useUserStore = defineStore(
  "userStore",
  () => {
    const accessToken = ref("");
    const refreshToken = ref("");

    const userInfo = ref<UserInfo>({});
    const roles = ref<string[]>([]);
    const searchHistory = ref<RouterConfig[]>([]);

    // 锁屏状态
    const isLock = ref(false);
    // 锁屏密码
    const lockPassword = ref("");

    const login = async (loginParams: LoginParams) => {
      // 模拟调用登录接口拿到 token
      // return await UserService.login(loginParams).then(res => {
      //   accessToken.value = res.data.accessToken;
      //   refreshToken.value = res.data.refreshToken;
      //   return res.data;
      // });

      console.log(loginParams);

      const accessToken = "admin-token";
      const refreshToken = "admin-refresh-token";
      setToken(accessToken, refreshToken);
      return { accessToken, refreshToken };
    };

    const getUserInfo = async () => {
      // 模拟获取用户信息
      // return await UserService.getUserInfo().then(res => {
      //   setRoles(res.data.roles);
      //   setUserInfo(res.data);
      //   return res.data;
      // });

      const userInfo = await new Promise<UserInfo>(resolve => {
        setTimeout(() => {
          resolve({
            userId: "v10001",
            username: "Admin",
            sex: "保密",
            signature: "这个人很懒，什么都没有写",
            email: "1234567890@qq.com",
            phone: "1234567890",
            avatar: "https://cdn.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png",
            roles: ["admin"],
            job: "开发工程师",
            dept: "Teek 云科技技术部 - 智能全栈科",
            registerTime: "2022-10-01 19:07:27",
          });
        }, 500);
      });

      setUserInfo(userInfo);
      return userInfo;
    };

    /**
     * 刷新 token
     */
    const doRefreshToken = async () => {
      return await new Promise<boolean>(resolve => {
        setTimeout(() => {
          const accessToken = "admin-token";
          const refreshToken = "admin-refresh-token";
          setToken(accessToken, refreshToken);
          resolve(true);
        }, 500);
      });
    };

    /**
     * 设置锁屏状态
     * @param status 锁屏状态
     */
    const setLockStatus = (status: boolean) => {
      isLock.value = status;
    };

    /**
     * 设置锁屏密码
     * @param password 锁屏密码
     */
    const setLockPassword = (password: string) => {
      lockPassword.value = password;
    };

    const logout = async () => {
      // 重置锁屏状态
      isLock.value = false;
      // 清空锁屏密码
      lockPassword.value = "";
      userInfo.value = {};
      clearPermission();

      const layoutStore = useLayoutStore();
      layoutStore.removeAllTabs();
      layoutStore.setKeepAliveName();
      resetRouter();
    };

    const clearPermission = () => {
      setToken("", "");
      setRoles([]);
    };

    const changeRoles = async (rolesParam: string[]) => {
      // 模拟新的 token
      const accessToken = rolesParam[0] + "-token";
      setToken(accessToken);
      setRoles(rolesParam); // 正常不是直接赋予角色，而是调用 this.getUserInfo(token)，根据 token 重新获取对应的角色
      // await this.getUserInfo(token);
      resetRouter();
      useRouteFn().initDynamicRoutes(rolesParam);
    };

    const setToken = (newAccessToken: string, newRefreshToken?: string) => {
      accessToken.value = newAccessToken;
      if (newRefreshToken) {
        refreshToken.value = newRefreshToken;
      }
    };

    const setUserInfo = (userInfoParam: UserInfo) => {
      userInfo.value = userInfoParam;
      roles.value = userInfoParam.roles || [];
    };

    const setRoles = (rolesParam: string[]) => (roles.value = rolesParam);

    const setSearchHistory = (searchHistoryParam: RouterConfig[]) => (searchHistory.value = searchHistoryParam);

    return {
      lockPassword,
      accessToken,
      refreshToken,
      userInfo,
      roles,
      searchHistory,
      isLock,

      login,
      logout,
      getUserInfo,
      doRefreshToken,
      clearPermission,
      changeRoles,
      setUserInfo,
      setToken,
      setRoles,
      setSearchHistory,
      setLockStatus,
      setLockPassword,
    };
  },
  {
    persist: {
      pick: ["accessToken", "refreshToken", "searchHistory", "isLock", "lockPassword"],
    },
  }
);
