import type { InjectionKey, Ref } from "vue";
import type { ElementPlusSizeEnum } from "@/common/enums";
import type { useWebSocketStore } from "@/pinia";

interface GlobalConfig {
  size: Ref<ElementPlusSizeEnum>;
}

/** 全局配置 */
export const GlobalConfigKey: InjectionKey<GlobalConfig> = Symbol("GlobalConfig");
/** 刷新页面 */
export const RefreshPageKey: InjectionKey<(value?: boolean) => void> = Symbol("RefreshPage");
/** WebSocket */
export const WebSocketKey: InjectionKey<ReturnType<typeof useWebSocketStore>> = Symbol("WebSocket");
/** 刷新 IFrame */
export const RefreshIFrameKey: InjectionKey<() => void> = Symbol("RefreshIFrameKey");
/** 打开搜索对话框 */
export const OpenSearchDialogKey: InjectionKey<() => void> = Symbol("OpenSearchDialog");
/** 打开主题面板 */
export const OpenThemePanelKey: InjectionKey<() => void> = Symbol("OpenThemePanel");
/** 打开锁屏面板 */
export const OpenLockPanelKey: InjectionKey<() => void> = Symbol("OpenLockPanel");
/** 修改菜单区域状态 */
export const UpdateInMenuAreaStateKey: InjectionKey<(state?: boolean) => void> = Symbol("UpdateInMenuAreaStateKey");
