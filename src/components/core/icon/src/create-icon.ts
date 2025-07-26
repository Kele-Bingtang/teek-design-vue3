import type { CommonIconType } from "./types";
import { defineComponent } from "vue";
import Icon from "./index.vue";

/**
 * 创建一个图标组件
 */
export const createIcon = (icon: string, iconType?: CommonIconType) => {
  return defineComponent({
    name: `Icon-${icon}`,
    setup(props, { attrs }) {
      return () => h(Icon, { icon, iconType, ...props, ...attrs });
    },
  });
};
