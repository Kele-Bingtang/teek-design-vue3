import type { UserInfo } from "@/pinia";
import { http } from "@/common/http";

export interface LoginParams {
  username: string;
  password: string;
  verifyCode?: string;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export const UserService = {
  // 登录
  login(params: LoginParams) {
    return http.post<httpNs.Response<Token>>("/auth/login", params);
  },

  // 获取用户信息
  getUserInfo() {
    return http.get<httpNs.Response<UserInfo>>("/auth/getUserInfo");
  },
};
