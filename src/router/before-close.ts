import type { RouteLocationNormalizedLoaded } from "vue-router";
import { ElMessageBox } from "element-plus";

interface BeforeClose {
  [key: string]: (route: RouteLocationNormalizedLoaded) => Promise<boolean>;
  before_close_normal: (route: RouteLocationNormalizedLoaded) => Promise<boolean>;
}

const beforeClose: BeforeClose = {
  before_close_normal: async (route: RouteLocationNormalizedLoaded) => {
    if (route.query._close) return true;

    try {
      await ElMessageBox.confirm("确定要关闭这一页吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });

      return true;
    } catch {
      return false;
    }
  },
};

export default beforeClose;
