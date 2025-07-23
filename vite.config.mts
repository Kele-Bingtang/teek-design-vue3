import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import { wrapperEnv } from "./node/getEnv";
import { getPluginsList } from "./node/plugins";
import { include, exclude } from "./node/optimize";
import { getNowDate } from "./src/common/utils/core/date";
import pkg from "./package.json";

const { dependencies, devDependencies, name, version } = pkg;

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version }, // package.json 相关信息
  lastBuildTime: getNowDate(), // 编译或打包时间
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  const viteEnv = wrapperEnv(env);

  return {
    base: env.VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@assets": fileURLToPath(new URL("./src/common/assets", import.meta.url)),
        "@api": fileURLToPath(new URL("./src/common/api", import.meta.url)),
        "@config": fileURLToPath(new URL("./src/common/config", import.meta.url)),
        "@directives": fileURLToPath(new URL("./src/common/directives", import.meta.url)),
        "@enums": fileURLToPath(new URL("./src/common/enums", import.meta.url)),
        "@http": fileURLToPath(new URL("./src/common/http", import.meta.url)),
        "@languages": fileURLToPath(new URL("./src/common/languages", import.meta.url)),
        "@styles": fileURLToPath(new URL("./src/common/styles", import.meta.url)),
        "@utils": fileURLToPath(new URL("./src/common/utils", import.meta.url)),
        "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
        "@composables": fileURLToPath(new URL("./src/composables", import.meta.url)),
        "@pinia": fileURLToPath(new URL("./src/pinia", import.meta.url)),
        "@router": fileURLToPath(new URL("./src/router", import.meta.url)),
      },
    },
    plugins: getPluginsList(command, viteEnv),
    // https://cn.vitejs.dev/config/dep-optimization-options.html#dep-optimization-options
    optimizeDeps: {
      include,
      exclude,
    },
    server: {
      // 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0"
      host: "0.0.0.0",
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // 跨域代理配置
      proxy: {
        "/api": {
          target: "https://vue3-design.teek.top",
          changeOrigin: true,
          secure: true, // 是否忽略 https 安全证书问题，true 不忽略，false 忽略
          rewrite: path => path.replace(/^\/api/, ""),
        },
      },
      // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"],
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@styles/index.scss" as *;`,
        },
      },
    },
    // 打包去除 console.log && debugger
    esbuild: {
      pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log"] : [],
      drop: viteEnv.VITE_DROP_DEBUGGER ? ["debugger"] : [],
    },
    build: {
      // esbuild 打包更快，terser 打包慢
      minify: "esbuild",
      // minify: "terser",
      // terserOptions: {
      //   compress: {
      //     drop_console: viteEnv.VITE_DROP_CONSOLE,
      //     drop_debugger: viteEnv.VITE_DROP_DEBUGGER,
      //   },
      // },
      outDir: env.VITE_OUT_DIR || "dist",
      sourcemap: viteEnv.VITE_SOURCEMAP,
      // 消除打包大小超过 500kb 警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: resolve(__dirname, ".", "index.html"),
        },
        // 静态资源分类打包
        output: {
          // 拆包
          manualChunks: {
            "vue-chunks": ["vue", "vue-router", "pinia", "vue-i18n"],
            "element-plus": ["element-plus"],
            "wang-editor": ["@wangeditor/editor", "@wangeditor/editor-for-vue"],
            tinymce: ["tinymce", "@tinymce/tinymce-vue"],
            echarts: ["echarts"],
            codemirror: [
              "codemirror",
              // "@codemirror/autocomplete",
              "@codemirror/commands",
              "@codemirror/language",
              "@codemirror/lint",
              // "@codemirror/search",
              "@codemirror/state",
              "@codemirror/view",
            ],
            // 如果项目只需要一种代码语言，则把其他去掉
            "codemirror-lang": [
              "@codemirror/lang-html",
              "@codemirror/lang-javascript",
              "@codemirror/lang-markdown",
              "@codemirror/lang-java",
              "@codemirror/lang-json",
              "@codemirror/lang-php",
              "@codemirror/lang-python",
              "@codemirror/lang-sql",
              "@codemirror/lang-xml",
            ],
            // 如果项目只需要一种主题，则把其他去掉
            "codemirror-theme": [
              "@codemirror/theme-one-dark",
              "@uiw/codemirror-theme-dracula",
              "@uiw/codemirror-theme-xcode",
            ],
          },
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
      },
      cssCodeSplit: !env.VITE_USE_CSS_SPLIT,
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true", // 去除控制台的一个警告信息
      log: {},
    },
  };
});
