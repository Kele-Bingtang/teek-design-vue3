import type { Component, ComponentPublicInstance } from "vue";
import type { FormItemInstance } from "element-plus";
import type { FormColumn, ProFormMainInstance } from "../types";
import { useTemplateRef } from "vue";

/**
 * ProFormMain 相关方法获取
 */
export const useProFormMainFn = (refName = "proFormMainInstance") => {
  const proFormMainInstance = useTemplateRef<ProFormMainInstance>(refName);

  // 获取 optionsMap 对象
  const getOptionsMap = () => proFormMainInstance.value?.optionsMap;

  // 获取销毁或初始化函数
  const destroyOrInit = (column: FormColumn) => proFormMainInstance.value?.destroyOrInit(column);

  // 获取 ElFormItem 实例
  const getElFormItemInstance = (prop: FormColumn["prop"]): FormItemInstance | null =>
    proFormMainInstance.value?.getElFormItemInstance(prop) || null;

  // 获取表单组件实例
  const getElInstance = (prop: FormColumn["prop"]): Component | ComponentPublicInstance | null =>
    proFormMainInstance.value?.getElInstance(prop) || null;

  const getProFormMainInstance = () => proFormMainInstance.value;

  return {
    proFormMainInstance,
    getOptionsMap,
    destroyOrInit,
    getElFormItemInstance,
    getElInstance,
    getProFormMainInstance,
  };
};
