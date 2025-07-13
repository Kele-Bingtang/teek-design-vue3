<template>
  <el-config-provider :namespace="ns.elNamespace" :locale="i18nLocale" :button="config" :size="layoutSize">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </el-config-provider>
</template>

<script setup lang="ts" name="App">
import { reactive, computed, provide } from "vue";
import { storeToRefs } from "pinia";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import { LanguageEnum } from "@/common/enums/appEnum";
import SystemConfig, { GlobalConfigKey, WebSocketKey } from "@/common/config";
import { isFunction } from "@/common/utils";
import { useNamespace, useBrowserTitle, useWatchCssVar, useTheme } from "@/composables";
import { useUserStore, useWebSocketStore, useLayoutStore } from "@/pinia";
import { useIFrame } from "@/layout/components/iframe/use-iframe";

const ns = useNamespace();

const layoutStore = useLayoutStore();
const userStore = useUserStore();

const { layoutSize, language } = storeToRefs(layoutStore);

// 自定义注入全局参数。ElConfigProvider 会自动使用 provide 全局注入它的 props 到项目里，可以通过 configProviderContextKey 来 inject 获取（先从 element-plus 引入，然后 const config = inject(configProviderContextKey)）
provide(GlobalConfigKey, { size: layoutSize });

// 初始化主题配置
useTheme().initTheme();
// 浏览器标题
useBrowserTitle();
// 监听布局样式变量
useWatchCssVar();
// IFrame 通信
useIFrame(SystemConfig.layoutConfig.watchFrame);

// 配置 element 按钮文字中间是否有空格
const config = reactive({ autoInsertSpace: false });

// element 语言配置
const i18nLocale = computed(() => {
  if (language.value === LanguageEnum.ZhCn) return zhCn;
  if (language.value === LanguageEnum.EnUs) return en;
  return document.documentElement.lang === "zh-CN" ? zhCn : en;
});

// 初始化 WebSocket
if (import.meta.env.VITE_WEBSOCKET === "true") {
  const webSocketStore = useWebSocketStore();
  const url = import.meta.env.VITE_WEBSOCKET_URL || "";

  // url 后面的 ?token= 为认证信息，需要后端配合获取 token 来认证（这是普通的 GET 请求，WebSocket 无法放入请求头或者发起 POST 请求）
  url && webSocketStore.connect(url + "?token=" + userStore.accessToken);

  provide(WebSocketKey, webSocketStore);
}

if (isFunction(log.success)) log.success(__APP_INFO__.pkg.version, "欢迎使用 Teek Design Pro 系统");
</script>
