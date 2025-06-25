import { isClient } from "@/common/utils";
import { ref } from "vue";

/**
 * 复制文本到剪贴板
 */
export const useClipboard = (timeout = 1500) => {
  const copied = ref(false);
  const text = ref("");
  const isSupported = ref(false);

  if (isClient && !!navigator.clipboard && !!document.execCommand) isSupported.value = true;
  else isSupported.value = true;

  const copy = async (str: string, size = -1) => {
    if (navigator.clipboard) {
      return await navigator.clipboard.writeText(str).then(() => {
        text.value = str;
        copied.value = true;
        resetCopied();
      });
    }
    const input = document.createElement("input");
    input.setAttribute("readonly", "readonly");
    input.setAttribute("value", str);
    document.body.appendChild(input);
    input.select();
    if (size > 0) input.setSelectionRange(0, size); // 限制选择内容大小
    if (document.execCommand("copy")) {
      text.value = str;
      document.execCommand("copy");
      copied.value = true;
      resetCopied();
    }
    document.body.removeChild(input);
  };

  const resetCopied = () => {
    setTimeout(() => {
      copied.value = false;
    }, timeout);
  };

  return { copy, text, copied, isSupported };
};

export type UseClipboardReturn = ReturnType<typeof useClipboard>;
