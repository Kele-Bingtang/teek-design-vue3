/**
 * v-debounce
 * 按钮防抖指令，可扩展至 input 等场景
 * 接收参数：function 类型或者 {onClick: function, time: 1000, debounceClass: 'is-debouncing'}
 *
 * <button v-debounce="debounceClick">防抖提交</button>
 * <button v-debounce="{onClick: debounceClick, time: 1000, debounceClass: 'is-debouncing'}">防抖提交</button>
 */
import type { Directive, DirectiveBinding } from "vue";

interface ElType extends HTMLElement {
  __handleClick__?: () => any;
  __debounceTimer__?: ReturnType<typeof setTimeout> | null;
}

const debounce: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    const { value } = binding;
    if (typeof value !== "function" && typeof value?.onClick !== "function") {
      throw Error("v-debounce: callback must be a function");
    }

    const onClick = value.onClick || value;
    const time = value.time || 500;
    const debounceClass = value.debounceClass || "is-debouncing";

    /**
     * 防抖点击事件
     */
    el.__handleClick__ = function () {
      if (el.__debounceTimer__) clearTimeout(el.__debounceTimer__);
      el.classList.add(debounceClass);
      el.__debounceTimer__ = setTimeout(() => {
        el.classList.remove(debounceClass);
        onClick();
      }, time);
    };

    el.addEventListener("click", el.__handleClick__);
  },

  beforeUnmount(el: ElType) {
    el.removeEventListener("click", el.__handleClick__!);
    if (el.__debounceTimer__) {
      clearTimeout(el.__debounceTimer__);
      el.__debounceTimer__ = null;
    }
  },
};

export default debounce;
