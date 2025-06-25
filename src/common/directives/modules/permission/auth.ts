import type { Directive } from "vue";
import { usePermissionNoSetup } from "@/composables";

const auth: Directive = {
  mounted(el, binding) {
    const { hasAuth } = usePermissionNoSetup();
    const { value } = binding;
    if (value) !hasAuth(value) && el.parentNode?.removeChild(el);
    else throw new Error("need auths! Like v-auth=\"['btn.add','btn.edit']\"");
  },
};

export default auth;
