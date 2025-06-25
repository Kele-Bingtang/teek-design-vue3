import { defineComponent, h } from "vue";
import "./index.scss";
import { useNamespace } from "@/composables";

const ns = useNamespace("point-flicker");

export interface attrsType {
  width?: string; // 可选 string 宽
  height?: string; // 可选 string 高
  borderRadius?: number | string; // 可选 number | string 传0为方形、传50%或者不传为圆形
  background?: string; // 可选 string 闪烁颜色
  scale?: number | string; // 可选 number | string 闪烁范围，默认2，值越大闪烁范围越大
}

/**
 * 圆点、方形闪烁动画组件
 */
export const useFlicker = (attrs?: attrsType): Component => {
  return defineComponent({
    name: "Flicker",
    render() {
      return h(
        "div",
        {
          class: `${ns.b()}`,
          style: {
            "--point-width": attrs?.width ?? "12px",
            "--point-height": attrs?.height ?? "12px",
            "--point-background": attrs?.background ?? `var(--${ns.elNamespace}-color-primary)`,
            "--point-border-radius": attrs?.borderRadius ?? "50%",
            "--point-scale": attrs?.scale ?? "2",
          },
        },
        {
          default: () => [],
        }
      );
    },
  });
};
