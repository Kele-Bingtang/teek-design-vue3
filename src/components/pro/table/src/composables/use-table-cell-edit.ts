import type { ShallowRef, Ref } from "vue";
import type { FormValidationResult, TableInstance } from "element-plus";
import type { ProTableNamespace, TableColumn, TableRow } from "../types";
import { toValue } from "vue";

/**
 * 表格单元格编辑相关方法
 */
export const useTableCellEdit = (
  columns: Ref<TableColumn[]>, // 配置项
  editable: ProTableNamespace.Props["editable"], // 是否开启编辑功能
  elTableInstance: ShallowRef<TableInstance | null>, // el-table 实例
  callbackFn: {
    preventCellEdit?: (column: TableColumn) => boolean; // 自定义阻止开启编辑逻辑
    preventCellEditClass?: string[]; //  阻止开启编辑的单元格类名
    leaveCellEdit?: (row: TableRow, column: TableColumn) => void; // 离开单元格编辑态回调
  } = {}
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  // 缓存关闭当前单元格的编辑态方法
  let closeCurrentCellEdit: (() => void) | null = null;
  // 缓存当前单元格的校验方法
  let validateCurrentCellEdit: (() => FormValidationResult | undefined) | null = () => Promise.resolve(true);
  // 缓存当前的 closeCurrentEditCell 函数
  let currentStopEditHandler: ((e: MouseEvent) => void) | null = null;

  // 清除定时器
  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  /**
   * 点击单元格进入编辑态
   */
  const handleCellEdit = async (row: TableRow, column: TableColumn, type: "click" | "dblclick") => {
    const columnIndex = column.getColumnIndex?.();
    if (columnIndex === undefined) return;

    const currentColumn = columns.value[columnIndex];

    // 不是可编辑行，如功能列，操作列等，并且支持自定义函数判断
    if (!currentColumn || currentColumn.type || callbackFn.preventCellEdit?.(currentColumn)) return;

    // 没有开启点击编辑功能
    if (toValue(editable) !== type) return;

    // 原先的单元格校验失败
    if (!(await validateCurrentCellEdit?.())) return;

    // 清理之前的监听器
    if (currentStopEditHandler) document.removeEventListener("click", currentStopEditHandler);

    clearTimer();
    timer = setTimeout(() => {
      // 定义停止编辑的函数
      currentStopEditHandler = (e: MouseEvent) => {
        handleStopEditClick(e, row, { ...column, ...currentColumn });
      };

      // 添加退出单元格编辑事件监听
      document.addEventListener("click", currentStopEditHandler);
    }, 10);

    // 停止上一个单元格的编辑状态
    closeCurrentCellEdit?.();
    // 缓存当前单元格的退出编辑状态函数和校验函数
    closeCurrentCellEdit = () => row._closeCellEdit(currentColumn.prop);
    validateCurrentCellEdit = () => row._validateCellEdit(undefined, currentColumn.prop);

    // 开启当前点击的单元格的编辑
    row._openCellEdit?.(currentColumn.prop);
  };

  /**
   * 点击非表格的区域，停止当前单元格的编辑
   */
  const handleStopEditClick = async (e: MouseEvent, row: TableRow, column: TableColumn) => {
    if (!(await row._validateCellEdit(undefined, column.prop))) return;

    if (closeCurrentCellEdit && elTableInstance.value) {
      const target = e?.target as HTMLElement;

      // 如果点击的单元格上存在 preventCellEditClass 的类名，则不关闭当前单元格编辑
      if (callbackFn.preventCellEditClass?.some(className => target.classList.contains(className))) return;

      const contains = elTableInstance.value.$el?.contains(target);

      if (!contains) {
        closeCurrentCellEdit();
        // 离开编辑的回调
        callbackFn.leaveCellEdit?.(row, column);
        if (currentStopEditHandler) document.removeEventListener("click", currentStopEditHandler);
      }
    }
  };

  return { handleCellEdit };
};
