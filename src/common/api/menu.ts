// import { http } from "@/common/http";

export interface BackstageMenuList {
  imageIcon: string;
  menuCode: string;
  pagePath: string;
  menuName: string;
  menuUrl: string;
  parentMenuCode: string;
  seq: number;
  children?: BackstageMenuList[];
}

export const getMenuList = () => {
  // 模拟请求菜单
  return Promise.resolve([] as BackstageMenuList[]);
  // return http.request<httpNs.Response<BackstageMenuList[]>>({
  //   url: "/getMenuList",
  //   method: "get",
  // });
};
