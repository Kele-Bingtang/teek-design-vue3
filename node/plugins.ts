import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { createStyleImportPlugin, ElementPlusResolve } from "vite-plugin-style-import";
import eslintPlugin from "vite-plugin-eslint";
import progress from "vite-plugin-progress";
import ServerUrlCopy from "vite-plugin-url-copy";
import vueDevTools from "vite-plugin-vue-devtools";
import { visualizer } from "rollup-plugin-visualizer";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { configCompressPlugin } from "./compress";

export function getPluginsList(command: string, viteEnv: ImportMetaEnv) {
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    vue(),
    vueJsx(),
    viteEnv.VITE_DEVTOOLS && vueDevTools(),
    eslintPlugin({ cache: false }), // EsLint 报错信息显示在浏览器界面上
    ServerUrlCopy({
      qrcode: {
        disabled: true, // 是否生成二维码
      },
    }),

    progress(),
    !viteEnv.VITE_LOAD_ALL_EP_STYLE
      ? createStyleImportPlugin({
          resolves: [ElementPlusResolve()],
          libs: [
            {
              libraryName: "element-plus",
              esModule: true,
              resolveStyle: name => {
                if (!name.startsWith("el-")) return "";
                return `element-plus/theme-chalk/src/${name.replace(/^el-/, "")}.scss`;
              },
            },
          ],
        })
      : undefined,

    AutoImport({
      imports: ["vue", "vue-router", "pinia"], // 自动引入 vue 的 ref、toRefs、onMounted 等，无需在页面中再次引入
      dts: "src/types/auto-import.d.ts", // 生成在 src 路径下名为 auto-import.d.ts 的声明文件
      eslintrc: {
        enabled: false, // 改为 true 用于生成 eslint 配置。生成后改回 false，避免重复生成消耗
      },
      resolvers: !viteEnv.VITE_LOAD_ALL_EP_COMPONENTS ? [ElementPlusResolver()] : [],
    }),

    !viteEnv.VITE_LOAD_ALL_EP_COMPONENTS
      ? Components({
          resolvers: [ElementPlusResolver({ importStyle: "sass" })],
          dirs: "src/components", // 自定引入需要扫描的组件路径
          dts: "src/types/auto-components.d.ts", // 生成在 src 路径下名为 auto-components.d.ts 的声明文件
          directoryAsNamespace: true,
        })
      : undefined,

    // 使用 svg 图标
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/common/assets/icons")],
      symbolId: "icon-[dir]-[name]",
    }),

    viteEnv.VITE_BUILD_GZIP && configCompressPlugin(viteEnv.VITE_COMPRESSION),

    // 打包分析
    (lifecycle === "report" || viteEnv.VITE_REPORT) &&
      visualizer({ open: true, brotliSize: true, filename: "report.html" }),
  ];
}
