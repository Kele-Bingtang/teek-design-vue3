import type { FormColumn, ProFormInstance } from "../types";
import { useTemplateRef } from "vue";

/**
 * ProForm 相关方法获取（调用 defineExpose 暴露的数据）
 */
export const useProFormFn = (refName: string = "proFormInstance") => {
  const proFormInstance = useTemplateRef<ProFormInstance>(refName);

  const getOptionsMap = () => proFormInstance.value?.getOptionsMap();
  const submitForm = () => proFormInstance.value?.handleSubmit();
  const resetForm = () => proFormInstance.value?.handleReset();
  const getProFormInstance = () => proFormInstance.value;
  const getElFormInstance = () => proFormInstance.value?.elFormInstance;
  const getElFormItemInstance = (prop: FormColumn["prop"]) => proFormInstance.value?.getElFormItemInstance(prop);
  const getElInstance = (prop: FormColumn["prop"]) => proFormInstance.value?.getElInstance(prop);

  return {
    proFormInstance,
    getOptionsMap,
    submitForm,
    resetForm,
    getProFormInstance,
    getElFormInstance,
    getElFormItemInstance,
    getElInstance,
  };
};
