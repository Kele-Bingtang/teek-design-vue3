import type { ProFormInstance } from "@/components/pro/form";
import type { TableColumn } from "../types";
import { ref } from "vue";
import { setProp } from "@/components/pro/helper";

/**
 * 获取编辑态表单相关实例
 */
export const useTableFormInstance = () => {
  const proFormInstances = ref<Record<string, ProFormInstance>[]>([]);

  const registerProFormInstance = (index: number, prop: string, instance: ProFormInstance | null) => {
    proFormInstances.value[index] ??= {};
    setProp(proFormInstances.value[index], prop, instance);
  };

  // 获取指定行的指定 prop 的 ElForm 实例
  const getElFormInstance = (index: number, prop?: TableColumn["prop"]) => {
    const proFormItemInstance = proFormInstances.value?.[index];
    return proFormItemInstance?.[prop!].elFormInstance;
  };

  // 获取指定行的指定 prop 的 ElFormItem 实例
  const getElFormItemInstance = (index: number, prop?: TableColumn["prop"]) => {
    const proFormItemInstance = proFormInstances.value?.[index];
    return proFormItemInstance?.[prop!].getElFormItemInstance(prop!);
  };

  // 获取指定行的指定 prop 的表单组件实例
  const getElInstance = (index: number, prop: TableColumn["prop"]) => {
    const proFormItemInstance = proFormInstances.value?.[index];
    return proFormItemInstance?.[prop!].getElInstance(prop!);
  };

  return { registerProFormInstance, getElFormInstance, getElFormItemInstance, getElInstance };
};
