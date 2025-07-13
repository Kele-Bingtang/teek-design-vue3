import type { Directive, DirectiveBinding } from "vue";
import "./waves.css";

/**
 * 波纹指令 v-waves
 * 用法：<button v-waves="{ color: 'rgba(0,0,0,0.15)', type: 'center' }" />
 */
const waves: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    /**
     * 触发波纹动画
     */
    const showRipple = (e: MouseEvent | TouchEvent) => {
      const customOpts = { ...binding.value };
      const opts = Object.assign(
        {
          ele: el,
          type: "hit", // hit: 点击位置扩散，center: 中心扩散
          color: "rgba(0,0,0,0.15)",
        },
        customOpts
      );
      const target: HTMLElement = opts.ele;
      if (!target) return;
      target.style.position = "relative";
      target.style.overflow = "hidden";
      const rect = target.getBoundingClientRect();

      // 移除旧的 ripple
      let ripple = target.querySelector<HTMLElement>(".waves-ripple");
      if (ripple) {
        ripple.remove();
      }
      ripple = document.createElement("span");
      ripple.className = "waves-ripple";
      ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + "px";
      target.appendChild(ripple);

      // 计算位置
      let top = 0,
        left = 0;
      if (opts.type === "center") {
        top = rect.height / 2 - ripple.offsetHeight / 2;
        left = rect.width / 2 - ripple.offsetWidth / 2;
      } else {
        const event = (e instanceof TouchEvent ? e.touches[0] : e) as MouseEvent | Touch;
        top = event.pageY - rect.top - ripple.offsetHeight / 2 - (window.scrollY || document.documentElement.scrollTop);
        left =
          event.pageX - rect.left - ripple.offsetWidth / 2 - (window.scrollX || document.documentElement.scrollLeft);
      }
      ripple.style.top = `${top}px`;
      ripple.style.left = `${left}px`;
      ripple.style.backgroundColor = opts.color;
      ripple.className = "waves-ripple z-active";
    };

    // 支持鼠标和触摸事件
    el.addEventListener("click", showRipple, false);
    el.addEventListener("touchstart", showRipple, false);
  },
};

export default waves;
