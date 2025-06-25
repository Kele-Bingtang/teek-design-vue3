/**
 * v-debounce
 * 按钮防抖指令，可自行扩展至input
 * 接收参数：function 类型或者 {onClick: 接收参数：function, time: 2000} 类型
 *
 * <button v-debounce="debounceClick">防抖提交</button>
 * <button v-debounce="{onClick: debounceClick, time: 1000}">防抖提交</button>
 */
import type { Directive, DirectiveBinding } from "vue";

interface ElType extends HTMLElement {
  __handleClick__: () => any;
}

const debounce: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    const { value } = binding;
    if (typeof value !== "function" && typeof value?.onClick !== "function") {
      throw Error("callback must be a function");
    }

    const onClick = value.onClick || value;
    const time = value.time || 500;

    let timer: NodeJS.Timeout | null = null;
    el.__handleClick__ = function () {
      if (timer) clearInterval(timer);

      timer = setTimeout(() => {
        onClick();
      }, time);
    };
    el.addEventListener("click", el.__handleClick__);
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener("click", el.__handleClick__);
  },
};

export default debounce;
