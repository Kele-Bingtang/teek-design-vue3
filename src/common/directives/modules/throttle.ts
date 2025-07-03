/*
  防止按钮在短时间内被多次点击，使用节流函数限制规定时间内只能点击一次。

  思路：
    1、第一次点击，立即调用方法并禁用按钮，等延迟结束再次激活按钮
    2、将需要触发的方法绑定在指令上
  使用：给 Dom 加上 v-throttle 及回调函数即可

  <button v-throttle="throttleClick">节流提交</button>
  <button v-throttle="{onClick: throttleClick, time: 2000, disabledClass: 'is-disabled'}">节流提交</button>
*/
import type { Directive, DirectiveBinding } from "vue";

interface ElType extends HTMLElement {
  __handleClick__?: () => any;
  __throttleTimer__?: ReturnType<typeof setTimeout> | null;
}

const throttle: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    const { value } = binding;
    if (typeof value !== "function" && typeof value?.onClick !== "function") {
      throw Error("v-throttle: callback must be a function");
    }

    const onClick = value.onClick || value;
    const time = value.time || 2000;
    const disabledClass = value.disabledClass || "is-disabled";

    /**
     * 节流点击事件
     */
    el.__handleClick__ = function () {
      if (el.__throttleTimer__) clearTimeout(el.__throttleTimer__);

      if (!el.classList.contains(disabledClass)) {
        el.classList.add(disabledClass);
        onClick();
      }
      el.__throttleTimer__ = setTimeout(() => {
        el.classList.remove(disabledClass);
      }, time);
    };

    el.addEventListener("click", el.__handleClick__);
  },

  beforeUnmount(el: ElType) {
    el.removeEventListener("click", el.__handleClick__!);
    if (el.__throttleTimer__) {
      clearTimeout(el.__throttleTimer__);
      el.__throttleTimer__ = null;
    }
  },
};

export default throttle;
