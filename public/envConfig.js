/**
 * ! 该文件中 envConfig 的变量可以覆盖环境变量（.env）里相同名称的变量
 * ! 该文件不随打包进行编译，因此可以在线上环境直接修改该文件内容来覆盖环境变量，如域名
 *
 * 在项目里使用：window.__TEEK_ENV__.xx 来获取环境变量，且 window.__TEEK_ENV__ 初始化为 {}，因此不会 undefined 报错
 */

const envConfig = {
  // VITE_API_URL: "", // 接口请求地址
  // VITE_ROUTE_ACCESS_MODE: "", // 路由权限模式，可选 "frontend" | "backend" | "mixed" | "mixed-hide-frontend"
  // VITE_FILE_ORIGIN_URL: "", // 图片、 附件域名前缀
  // VITE_DPS_BACK_PATH: "", // DPS 后端接口前缀
  // VITE_ROUTE_ACCESS_MODE: "", // 路由权限模式（frontend ｜ backend | mixed）
};

const teekEnv = window.__TEEK_ENV__ ?? {};
const filterEnvConfig = Object.fromEntries(Object.entries(envConfig).filter(([key, value]) => value));

window.__TEEK_ENV__ = Object.assign(teekEnv, filterEnvConfig);
