/*
  需求：防止按钮在短时间内被多次点击，使用节流函数限制规定时间内只能点击一次。

  思路：
    1、第一次点击，立即调用方法并禁用按钮，等延迟结束再次激活按钮
    2、将需要触发的方法绑定在指令上
  使用：给 Dom 加上 v-throttle 及回调函数即可

  <button v-throttle="throttleClick">节流提交</button>
  <button v-throttle="{onClick: throttleClick, time: 2000}">节流提交</button>
*/
import type { Directive, DirectiveBinding } from "vue";

interface ElType extends HTMLElement {
  __handleClick__: () => any;
  disabled: boolean;
}

const throttle: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    const { value } = binding;
    if (typeof value !== "function" && typeof value?.onClick !== "function") {
      throw Error("callback must be a function");
    }

    const onClick = value.onClick || value;
    const time = value.time || 2000;

    let timer: NodeJS.Timeout | null = null;
    el.__handleClick__ = function () {
      if (timer) clearTimeout(timer);

      if (!el.classList.contains("is-disabled")) {
        el.classList.add("is-disabled");
        onClick();
        timer = setTimeout(() => {
          el.classList.remove("is-disabled");
        }, time);
      }
    };
    el.addEventListener("click", el.__handleClick__);
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener("click", el.__handleClick__);
  },
};

export default throttle;
