import { ref } from "vue";

interface UpgradeLog {
  /** 版本号 */
  version: string;
  /** 更新标题 */
  title: string;
  /** 更新日期 */
  date: string;
  /** 更新内容 */
  detail?: string[];
  /** 是否需要重新登录，默认 false */
  requireReLogin?: boolean;
}

export const upgradeLogList = ref<UpgradeLog[]>([
  {
    version: "v2.0.0",
    title: "UI、布局、组件全面升级",
    date: "2025-07-01",
    detail: ["新增超级组件", "重构布局样式"],
  },
]);
