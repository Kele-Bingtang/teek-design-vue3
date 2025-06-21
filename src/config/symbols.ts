import type { LayoutSizeEnum } from "@/enums/appEnum";
import type { useWebSocketStore } from "@/stores";
import type { InjectionKey, Ref } from "vue";

interface GlobalConfig {
  size: Ref<LayoutSizeEnum>;
}

export const GlobalConfigKey: InjectionKey<GlobalConfig> = Symbol("GlobalConfig");
export const RefreshPageKey: InjectionKey<(value?: boolean) => void> = Symbol("RefreshPage");
export const WebSocketKey: InjectionKey<ReturnType<typeof useWebSocketStore>> = Symbol("WebSocket");
export const RefreshIFrameKey: InjectionKey<() => void> = Symbol("RefreshIFrameKey");
export const OpenSearchDialogKey: InjectionKey<() => void> = Symbol("OpenSearchDialog");
export const OpenThemePanelKey: InjectionKey<() => void> = Symbol("OpenThemePanel");
