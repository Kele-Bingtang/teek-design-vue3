import { createApp } from "vue";
import pinia from "@/pinia";
import router from "@/router";
import directives from "@/common/directives";
import I18n from "@/common/languages";
import { errorHandler, checkNeed, log } from "@/common/utils";
import { Icon, Auth, Role } from "@/components";
import App from "./App.vue";
import Vue3TreeOrg from "vue3-tree-org";
import "virtual:svg-icons-register";
import "vue3-tree-org/lib/vue3-tree-org.css";

import "@styles/normalize.css";
import "@styles/reset.css";
import "@styles/var/index.scss"; // 主题变量
import "@styles/common/base.scss";
import "@styles/common/atomic.scss";
import "@styles/common/scrollbar.scss";
import "@styles/common/transition.scss";
import "@styles/common/theme-animation.scss";
import "@styles/common/menu-theme.scss";
import "@styles/element-plus/el-ui.scss"; // 重写部分 Element Plus 样式
import "@styles/element-plus/el-dark.scss";
import "@styles/plugin.scss";

import "@assets/iconfont/system/iconfont.js"; // 系统彩色图标
import "@assets/iconfont/system/iconfont.css"; // 系统图标

const app = createApp(App);

window.log = log;
checkNeed() && (app.config.errorHandler = errorHandler);

// 全局注册按钮级别权限、页面级别权限、Icon 图标组件组件
app.use(Auth).use(Role).use(Icon);

// 注册树形组件
app.use(Vue3TreeOrg);

// 是否全部引入 Element Plus 的样式
if (import.meta.env.VITE_LOAD_ALL_EP_STYLE === "true") {
  import("@styles/element-plus/el-light.scss");
}

// 是否全部引入 Element Plus 的组件
if (import.meta.env.VITE_LOAD_ALL_EP_COMPONENTS === "true") {
  // EP 样式按需引入和组件全部引入有冲突。因为样式按需引入的前提是手动 import 组件（import 组件才根据组件去找样式），而这里组件全部引入导致在 vue 文件不需要 import。所以样式按需引入会失效，因此这里需要全量引入样式
  if (import.meta.env.VITE_LOAD_ALL_EP_STYLE === "false") {
    import("@styles/element-plus/el-light.scss");
  }

  import("element-plus").then(ElementPlus => {
    app.use(ElementPlus);
  });
}

app.use(I18n).use(pinia).use(router).use(directives).mount("#app");
