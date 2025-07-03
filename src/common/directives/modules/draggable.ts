/*
	实现一个拖拽指令，可在父元素区域任意拖拽元素。

	思路：
		1、设置需要拖拽的元素为absolute，其父元素为relative。
		2、鼠标按下(onmousedown)时记录目标元素当前的 left 和 top 值。
		3、鼠标移动(onmousemove)时计算每次移动的横向距离和纵向距离的变化值，并改变元素的 left 和 top 值
		4、鼠标松开(onmouseup)时完成一次拖拽

	使用：在 Dom 上加上 v-draggable 即可
	<div class="dialog-model" v-draggable></div>
*/
import type { Directive } from "vue";

/**
 * 拖拽指令 v-draggable
 * 使元素在父容器内可拖拽
 */
interface DraggableEl extends HTMLElement {
  __draggableHandlers__?: {
    mousemove: (e: MouseEvent) => void;
    mouseup: (e: MouseEvent) => void;
    mousedown: (e: MouseEvent) => void;
  };
}

const draggable: Directive = {
  mounted(el: DraggableEl) {
    el.style.cursor = "move";
    el.style.position = "absolute";

    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    const getParent = (): HTMLElement => {
      return (el.parentElement || document.body) as HTMLElement;
    };

    const onMouseMove = (e: MouseEvent) => {
      const parent = getParent();
      const maxX = parent.offsetWidth - el.offsetWidth;
      const maxY = parent.offsetHeight - el.offsetHeight;

      let newLeft = initialLeft + (e.pageX - startX);
      let newTop = initialTop + (e.pageY - startY);

      newLeft = Math.max(0, Math.min(newLeft, maxX));
      newTop = Math.max(0, Math.min(newTop, maxY));

      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseDown = (e: MouseEvent) => {
      // 只允许鼠标左键拖拽
      if (e.button !== 0) return;
      startX = e.pageX;
      startY = e.pageY;
      initialLeft = el.offsetLeft;
      initialTop = el.offsetTop;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    el.addEventListener("mousedown", onMouseDown);

    el.__draggableHandlers__ = {
      mousemove: onMouseMove,
      mouseup: onMouseUp,
      mousedown: onMouseDown,
    };
  },
  beforeUnmount(el: DraggableEl) {
    if (el.__draggableHandlers__) {
      el.removeEventListener("mousedown", el.__draggableHandlers__.mousedown);
      document.removeEventListener("mousemove", el.__draggableHandlers__.mousemove);
      document.removeEventListener("mouseup", el.__draggableHandlers__.mouseup);
      delete el.__draggableHandlers__;
    }
  },
};

export default draggable;
