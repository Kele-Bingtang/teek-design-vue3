import {
  OpenLockPanelKey,
  OpenSearchDialogKey,
  OpenThemePanelKey,
  RefreshIFrameKey,
  RefreshPageKey,
} from "@/common/config";
import { mittBus } from "@/common/utils";

export const useMittBus = () => {
  /**
   * 刷新当前页面
   */
  const refreshPage = (value?: boolean) => mittBus.emit(RefreshPageKey, value);
  /**
   * 打开主题面板
   */
  const openThemePanel = () => mittBus.emit(OpenThemePanelKey);
  /**
   * 打开全局搜索框
   */
  const openSearchDialog = () => mittBus.emit(OpenSearchDialogKey);

  /**
   * 刷新当前 IFrame 页面
   */
  const refreshIFrame = () => mittBus.emit(RefreshIFrameKey);
  /**
   * 锁屏
   */
  const openLockPanel = () => mittBus.emit(OpenLockPanelKey);

  return {
    refreshPage,
    openThemePanel,
    openSearchDialog,
    refreshIFrame,
    openLockPanel,
  };
};
