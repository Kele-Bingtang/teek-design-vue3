import type { Directive, DirectiveBinding } from "vue";
import { ElMessage } from "element-plus";

interface CopyEl extends HTMLElement {
  __copyData__?: string | number;
  __handleCopyClick__?: (this: HTMLElement, ev: MouseEvent) => void;
}

/**
 * 复制文本到剪贴板
 * @param text 需要复制的文本
 */
async function copyToClipboard(text: string | number): Promise<boolean> {
  if (!text && text !== 0) return false;
  const str = String(text);
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(str);
      return true;
    } catch {
      return false;
    }
  } else {
    // fallback
    const input = document.createElement("input");
    input.value = str;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    try {
      const result = document.execCommand("copy");
      document.body.removeChild(input);
      return result;
    } catch {
      document.body.removeChild(input);
      return false;
    }
  }
}

/**
 * v-copy
 * 复制某个值至剪贴板
 * 接收参数：string类型、Ref<string>类型、Reactive<string>类型
 */
const copy: Directive = {
  mounted(el: CopyEl, binding: DirectiveBinding) {
    el.__copyData__ = binding.value;
    // 如果值为 false，则不进行复制
    if (binding.value === false) return;

    el.__handleCopyClick__ = async function () {
      if (!el.__copyData__ && el.__copyData__ !== 0) {
        ElMessage({ type: "error", message: "复制失败，内容为空" });
        return;
      }
      const success = await copyToClipboard(el.__copyData__);
      if (success) ElMessage({ type: "success", message: "复制成功" });
      else ElMessage({ type: "error", message: "复制失败" });
    };
    el.addEventListener("click", el.__handleCopyClick__);
  },
  updated(el: CopyEl, binding: DirectiveBinding) {
    el.__copyData__ = binding.value;
  },
  beforeUnmount(el: CopyEl) {
    if (el.__handleCopyClick__) {
      el.removeEventListener("click", el.__handleCopyClick__);
      delete el.__handleCopyClick__;
    }
    delete el.__copyData__;
  },
};

export default copy;
