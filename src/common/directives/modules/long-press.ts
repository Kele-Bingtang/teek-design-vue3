/**
 * v-longpress
 * 长按指令，长按时触发事件
 */
import type { Directive, DirectiveBinding } from "vue";

interface LongPressEl extends HTMLElement {
  __longPressHandlers__?: {
    start: (e: MouseEvent | TouchEvent) => void;
    cancel: (e: Event) => void;
  };
  __pressTimer__?: ReturnType<typeof setTimeout> | null;
}

/**
 * v-longPress
 * 长按指令，长按时触发事件
 * 用法：<button v-longPress="handler">长按</button>
 */
const longPress: Directive = {
  mounted(el: LongPressEl, binding: DirectiveBinding) {
    if (typeof binding.value !== "function") {
      throw new Error("v-longPress binding value must be a function");
    }

    const handler = (e: MouseEvent | TouchEvent) => {
      binding.value(e);
    };

    const start = (e: MouseEvent | TouchEvent) => {
      // 只允许鼠标左键
      if (e instanceof MouseEvent && e.button !== 0) return;
      if (el.__pressTimer__) return;
      el.__pressTimer__ = setTimeout(() => {
        handler(e);
        el.__pressTimer__ = null;
      }, 1000);
    };

    const cancel = () => {
      if (el.__pressTimer__) {
        clearTimeout(el.__pressTimer__);
        el.__pressTimer__ = null;
      }
    };

    el.addEventListener("mousedown", start);
    el.addEventListener("touchstart", start);
    el.addEventListener("click", cancel);
    el.addEventListener("mouseout", cancel);
    el.addEventListener("touchend", cancel);
    el.addEventListener("touchcancel", cancel);

    el.__longPressHandlers__ = { start, cancel };
  },

  beforeUnmount(el: LongPressEl) {
    if (el.__longPressHandlers__) {
      el.removeEventListener("mousedown", el.__longPressHandlers__.start);
      el.removeEventListener("touchstart", el.__longPressHandlers__.start);
      el.removeEventListener("click", el.__longPressHandlers__.cancel);
      el.removeEventListener("mouseout", el.__longPressHandlers__.cancel);
      el.removeEventListener("touchend", el.__longPressHandlers__.cancel);
      el.removeEventListener("touchcancel", el.__longPressHandlers__.cancel);
      delete el.__longPressHandlers__;
    }
    if (el.__pressTimer__) {
      clearTimeout(el.__pressTimer__);
      el.__pressTimer__ = null;
    }
  },
};

export default longPress;
