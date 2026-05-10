import type { TableInstance } from "element-plus";
import type { MaybeRef } from "vue";
import { onScopeDispose, getCurrentScope, unref } from "vue";
import { isElement } from "@/common/utils";
import { useNamespace } from "@/composables";

// 拖拽状态
interface DragState {
  startMouseTop: number;
  currentHeight: number;
  deltaTop: number;
  targetElement: HTMLElement | null;
}

const defaultDragState: DragState = { startMouseTop: 0, currentHeight: 0, deltaTop: 0, targetElement: null };

/**
 * 表头高度调整
 */
export const useHeaderHeightResize = (tableInstance: MaybeRef<TableInstance | null>) => {
  const ns = useNamespace();

  let thList: NodeListOf<HTMLElement> | null = null;
  let userSelect = "unset";
  let isDragging = false;
  let dragState = { ...defaultDragState };
  let rowResizeInstance: HTMLDivElement | null = null;
  // 最小高度
  const monRowHeight = 36;
  // 默认行高调整背景色
  const defaultResizeBgColor = ns.cssVarEl("table-border-color");

  // 是否是表头列宽调整
  const isColMouseHover = (event: MouseEvent, thRect: DOMRect) => {
    if (thRect.width > 12 && thRect.right - event.pageX < 8) return true;
    return false;
  };

  // 是否是表头高度调整
  const isRowMouseHover = (event: MouseEvent, thRect: DOMRect) => {
    if (thRect.top + thRect.height - event.clientY < 8) return true;
    return false;
  };

  // 初始化行高调整实例
  const initRowResize = () => {
    const tableEl = unref(tableInstance)?.$el as HTMLElement | null;
    if (rowResizeInstance || !tableEl) return;

    rowResizeInstance = document.createElement("div");
    rowResizeInstance.className = ns.joinEl("table__row-resize-proxy");

    Object.assign(rowResizeInstance.style, {
      position: "absolute",
      left: "0",
      zIndex: "1000",
      display: "none",
      width: "100%",
      height: "1px",
      backgroundColor: defaultResizeBgColor,
    });
    tableEl.appendChild(rowResizeInstance);
  };

  // 移除行高调整实例
  const removeRowResize = () => {
    if (!rowResizeInstance) return;

    rowResizeInstance.remove();
    rowResizeInstance = null;
  };

  // 鼠标移动时 (悬停效果)
  const handleMouseMove = (event: MouseEvent) => {
    // 如果正在拖拽，不处理悬停样式变化
    if (isDragging) return;

    const el = event.target as HTMLElement;
    if (!isElement(el)) return;

    const thEl = el.closest("th");
    if (!thEl) return;

    const thRect = thEl.getBoundingClientRect();
    const bodyStyle = document.body.style;

    // 鼠标悬停时，如果是多级表头(table--group)，则不出现列宽调整鼠标样式
    if (isColMouseHover(event, thRect) && !el.closest(`.${ns.joinEl("table--group")}`)) bodyStyle.cursor = "col-resize";
    else if (isRowMouseHover(event, thRect)) bodyStyle.cursor = "row-resize";
    else document.body.style.cursor = "";
  };

  // 全局 Mouse Move Handler (拖拽中)
  const handleGlobalMouseMove = (event: MouseEvent) => {
    if (!isDragging || !rowResizeInstance) return;

    const tableEl = unref(tableInstance)?.$el;
    if (tableEl && tableEl.style.userSelect !== "none") tableEl.style.userSelect = "none";

    const deltaTop = event.clientY - dragState.startMouseTop;
    dragState.deltaTop = deltaTop;

    const proxyTop = dragState.currentHeight + deltaTop;
    // 限制最小高度
    const newHeight = Math.max(monRowHeight, proxyTop);
    rowResizeInstance.style.top = `${newHeight}px`;
  };

  // 全局 Mouse Up Handler (结束拖拽)
  const handleGlobalMouseUp = () => {
    if (!isDragging) return;

    const tableEl = unref(tableInstance)?.$el;
    if (tableEl && tableEl.style.userSelect !== userSelect) tableEl.style.userSelect = userSelect;

    // 移除监听器
    document.removeEventListener("mousemove", handleGlobalMouseMove);
    document.removeEventListener("mouseup", handleGlobalMouseUp);

    // 重置状态
    document.body.style.cursor = "";
    isDragging = false;

    if (rowResizeInstance) {
      rowResizeInstance.style.display = "none";

      // 应用新高度
      const target = dragState.targetElement;
      if (target) {
        const finalHeight = Math.max(monRowHeight, dragState.currentHeight + dragState.deltaTop);
        target.style.height = `${finalHeight}px`;

        // 强制更新布局
        requestAnimationFrame(() => {
          unref(tableInstance)?.doLayout();
        });
      }
    }

    // 清空临时引用
    dragState = { ...defaultDragState };
  };

  // 鼠标按下时
  const handleMouseDown = (event: MouseEvent) => {
    const el = event.target as HTMLElement;
    if (!isElement(el) || !rowResizeInstance) return;

    const thEl = el.closest("th");
    const thRect = thEl?.getBoundingClientRect();

    // 如果不是表头高度调整，则退出
    if (!thRect || !isRowMouseHover(event, thRect)) return;

    // 阻止默认行为，防止文本选中等
    event.preventDefault();
    event.stopPropagation();

    const target = thEl?.parentElement; // 通常是 tr

    if (!target) return;

    const rect = target.getBoundingClientRect();
    const headerLevel = target?.parentNode?.childNodes;
    const isMultiLevel = Boolean(headerLevel && headerLevel.length > 1);

    isDragging = true;

    // 多级表头时，不需要出现背景色
    if (isMultiLevel) rowResizeInstance.style.backgroundColor = "transparent";
    else rowResizeInstance.style.backgroundColor = defaultResizeBgColor;

    rowResizeInstance.style.display = "block";
    rowResizeInstance.style.top = `${rect.height}px`;

    dragState = {
      startMouseTop: event.clientY,
      currentHeight: rect.height,
      deltaTop: 0,
      targetElement: target,
    };

    // 绑定全局事件
    // 先移除可能存在的旧监听器
    document.removeEventListener("mousemove", handleGlobalMouseMove);
    document.removeEventListener("mouseup", handleGlobalMouseUp);

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
  };

  // 初始化
  const start = () => {
    const tableEl = unref(tableInstance)?.$el;
    if (!tableEl) return;

    // 获取所有表头 th
    thList = tableEl.querySelectorAll(`.${ns.joinEl("table__header")} th`);
    if (!thList?.length) return;

    userSelect = tableEl.style.userSelect || "unset";

    initRowResize();
    thList.forEach(th => {
      // 移除旧监听器防止重复绑定（如果 start 被多次调用）
      th.removeEventListener("mousemove", handleMouseMove);
      th.removeEventListener("mousedown", handleMouseDown);

      th.addEventListener("mousemove", handleMouseMove);
      th.addEventListener("mousedown", handleMouseDown);
    });
  };

  // 停止
  const stop = () => {
    // 清理事件监听器
    if (thList) {
      thList.forEach(th => {
        th.removeEventListener("mousemove", handleMouseMove);
        th.removeEventListener("mousedown", handleMouseDown);
      });
      thList = null;
    }

    // 清理全局监听器
    document.removeEventListener("mousemove", handleGlobalMouseMove);
    document.removeEventListener("mouseup", handleGlobalMouseUp);

    removeRowResize();
    isDragging = false;
    dragState = { ...defaultDragState };
  };

  // 销毁时清除监听器
  if (getCurrentScope()) onScopeDispose(stop);

  return { start, stop };
};
