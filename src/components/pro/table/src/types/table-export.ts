import type { AppContext } from "vue";
import type { ElMessageBoxOptions } from "element-plus";
import type { ExportKey } from "../helper";

/**
 * 表格导出类型
 */
export interface ExportProps {
  /**
   * 导出时的表头配置
   *
   * @default 'label'
   */
  mode?: ExportKey | `${ExportKey}`;
  /**
   * 导出的文件名
   * @default 'export-table'
   */
  fileName?: string;
  /**
   * ElMessageBox.confirm 的 title
   *
   * @default '请选择导出列'
   */
  title?: string;
  /**
   * ElMessageBox.confirm 的 options
   */
  options?: ElMessageBoxOptions;
  /**
   * ElMessageBox.confirm 的 appContext
   */
  appContext?: AppContext | null;
  /**
   * 自定义导出为文件
   *
   * @param data 表格数据
   */
  exportFile?: (data: Recordable[]) => void;
}
