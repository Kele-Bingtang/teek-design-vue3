import type { FormInstance, FormItemProp } from "element-plus";

export const useVerifyCode = () => {
  const isDisabled = ref(false);
  const text = ref("");
  let timer: ReturnType<typeof setInterval> | null;

  const start = async (formEl: FormInstance | null, props: FormItemProp, time = 60) => {
    if (!formEl) return;
    const initTime = time;
    await formEl.validateField(props, isValid => {
      if (isValid) {
        stop();
        timer = setInterval(() => {
          if (time > 0) {
            text.value = `${time}`;
            isDisabled.value = true;
            time -= 1;
          } else {
            text.value = "";
            isDisabled.value = false;
            stop();
            time = initTime;
          }
        }, 1000);
      }
    });
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const end = () => {
    text.value = "";
    isDisabled.value = false;
    stop();
  };

  return {
    isDisabled,
    text,
    start,
    end,
  };
};
