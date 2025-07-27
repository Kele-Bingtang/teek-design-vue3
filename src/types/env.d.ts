/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, any>;
  export default component;
}

declare module "*.scss" {
  const scss: Record<string, string>;
  export default scss;
}

// import.meta.env 环境变量
interface ImportMetaEnv {
  /**
   * 项目端口号
   */
  VITE_PORT: number;
  /**
   * 运行 npm run dev 时自动打开浏览器
   */
  VITE_OPEN: boolean;
  /**
   * 是否生成包分析文件
   */
  VITE_REPORT: boolean;
  /**
   * 是否开启 gzip 压缩
   */
  VITE_BUILD_GZIP: boolean;
  /**
   * 打包过程是否删除 console
   */
  VITE_DROP_CONSOLE: boolean;
  /**
   * 打包过程是否删除 debugger
   */
  VITE_DROP_DEBUGGER: boolean;
  /**
   * 是否生成 sourcemap 文件
   */
  VITE_SOURCEMAP: boolean;
  /**
   * 打包输出目录，默认 dist
   */
  VITE_OUT_DIR: string;
  /**
   * 是否将 css 切割
   */
  VITE_CSS_SPLIT: boolean;
  /**
   * 是否加载所有 element-plus 样式，false 则为按需加载
   */
  VITE_LOAD_ALL_EP_STYLE: boolean | string;
  /**
   * 是否加载所有 element-plus 组件，false 则为按需加载
   */
  VITE_LOAD_ALL_EP_COMPONENTS: boolean | string;
  /**
   * 当前环境
   */
  VITE_NODE_ENV: string;
  /**
   * 接口跟地址
   */
  VITE_API_URL: string;
  /**
   * 静态资源路径
   */
  VITE_PUBLIC_PATH: string;
  /**
   * 打包文件的压缩类型
   */
  VITE_COMPRESSION: "none" | "gzip" | "brotli" | "both" | "gzip-clear" | "brotli-clear" | "both-clear";
  /**
   * 路由模式
   *
   * @default 'history'
   */
  VITE_ROUTER_MODE: string;
  /**
   * 是否启用 WebSocket
   */
  VITE_WEBSOCKET: boolean | string;
  /**
   * WebSocket 连接 URL，仅当 VITE_WEBSOCKET 为 true 生效
   */
  VITE_WEBSOCKET_URL: string;
  /**
   * 路由权限模式，默认前端 frontend
   */
  VITE_ROUTE_ACCESS_MODE: "frontend" | "backend" | "mixed";
  /**
   * 是否使用 Vue DevTools 插件
   */
  VITE_DEVTOOLS: boolean;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
