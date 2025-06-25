import type { LoginParams } from "@/common/api/user";
import { ref } from "vue";
import { defineStore } from "pinia";
import { resetRouter } from "@/router";
import { useRouteFn } from "@/composables";
import { useLayoutStore } from "./layout";

export interface UserInfo {
  userId?: string; // 用户 ID
  username?: string; // 用户名
  sex?: string; // 用户性别
  signature?: string; // 签名
  email?: string; // 用户邮箱
  phone?: string; // 用户联系方式
  avatar?: string; // 用户头像
  roles?: string[]; // 用户角色
  job?: string; // 职位
  dept?: string; // 部门
  registerTime?: string; // 用户角色
}

export const useUserStore = defineStore(
  "userStore",
  () => {
    const accessToken = ref("");
    const refreshToken = ref("");

    const userInfo = ref<UserInfo>({});
    const roles = ref<string[]>([]);
    const searchHistory = ref<RouterConfig[]>([]);

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
            username: "visitor",
            sex: "保密",
            signature: "这个人很懒，什么都没有写",
            email: "2456019588@qq.com",
            phone: "13377492843",
            avatar: "https://cdn.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png",
            roles: ["visitor"],
            job: "开发工程师",
            dept: "MIT-智能制造科",
            registerTime: "2022-10-01 19:07:27",
          });
        });
      });

      setUserInfo(userInfo);
      return userInfo;
    };

    const logout = async () => {
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
      accessToken,
      refreshToken,
      userInfo,
      roles,
      searchHistory,

      login,
      logout,
      getUserInfo,
      clearPermission,
      changeRoles,
      setUserInfo,
      setToken,
      setRoles,
      setSearchHistory,
    };
  },
  {
    persist: {
      pick: ["accessToken", "refreshToken", "searchHistory"],
    },
  }
);
