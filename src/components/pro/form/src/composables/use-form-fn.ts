import type { FormColumn, ProFormInstance } from "../types";

/**
 * ProForm 相关方法获取
 */
export const useProFormFn = (refName: string = "proFormInstance") => {
  const proFormInstance = useTemplateRef<ProFormInstance>(refName);

  const getOptionsMap = () => proFormInstance.value?.getOptionsMap();
  const submitForm = () => proFormInstance.value?.submitForm();
  const resetForm = () => proFormInstance.value?.resetForm();
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
