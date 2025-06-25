import type { Directive } from "vue";
import { usePermission } from "@/composables";

const permission: Directive = {
  mounted(el, binding) {
    const { hasRole } = usePermission();
    const { value } = binding;
    if (value) !hasRole(value) && el.parentNode?.removeChild(el);
    else throw new Error("need roles! Like v-role=\"['admin','visitor']\"");
  },
};

export default permission;
