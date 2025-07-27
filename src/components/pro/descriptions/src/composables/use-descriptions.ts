import type { MaybeRef } from "vue";
import type { RenderTypes } from "@/components/pro/form-item";
import type { DescriptionColumn, ProDescriptionsInstance, ProDescriptionsProp, ProDescriptionsEmits } from "../types";
import { ElConfigProvider } from "element-plus";
import { createVNode, getCurrentInstance, nextTick, ref, render, toValue } from "vue";
import { isString } from "@/common/utils";
import { useNamespace } from "@/composables";
import { filterEmpty } from "@/components/pro/helper";
import ProDescriptions from "../index.vue";

type ProDescriptionsPropsWithModel = ProDescriptionsProp & { modelValue?: Recordable };

/**
 * 通过函数动态修改 ProDescriptions 相关数据
 */
export const useProDescriptions = () => {
  // ProDescriptions 实例
  const proDescriptionsInstance = ref<ProDescriptionsInstance | null>();

  const ns = useNamespace();
  const currentInstance = getCurrentInstance();

  /**
   * @param proDescriptions ProDescriptions 实例
   */
  const register = (proDescriptions: ProDescriptionsInstance | null) => {
    proDescriptionsInstance.value = proDescriptions;
  };

  const getProDescriptions = async () => {
    await nextTick();
    const descriptions = proDescriptionsInstance.value;
    if (!descriptions) console.error("The descriptions is not registered. Please use the register method to register");

    return descriptions;
  };

  // 一些内置的方法
  const methods = {
    /**
     * 设置 ProDescriptions 组件的 props
     *
     * @param props ProDescriptions 组件的 props
     */
    setProps: async (props: ProDescriptionsPropsWithModel = {}) => {
      const descriptions = await getProDescriptions();
      descriptions?.setProps(props);

      if (props.modelValue) descriptions?.setValues(props.modelValue);
    },
    /**
     * 设置 model 的值
     *
     * @param model 需要设置的数据
     */
    setValues: async (model: Recordable) => {
      const descriptions = await getProDescriptions();
      descriptions?.setValues(model);
    },
    /**
     * 设置 column
     *
     * @param columnProps 需要设置的 columnProps
     */
    setColumn: async (columnProps: { prop: string; field: string; value: unknown }[]) => {
      const descriptions = await getProDescriptions();
      descriptions?.setColumn(columnProps);
    },
    /**
     * 新增 column
     *
     * @param prop 在哪里新增，number 为下标，字符串为指定的 prop
     * @param position 如果 prop 为字符串，则指定新增到 prop 前还是后
     */
    addColumn: async (
      column: DescriptionColumn,
      propOrIndex?: DescriptionColumn["prop"] | number,
      position: "before" | "after" = "after"
    ) => {
      const descriptions = await getProDescriptions();
      descriptions?.addColumn(column, propOrIndex, position);
    },
    /**
     * 删除 column
     *
     * @param field 删除哪个数据
     */
    delColumn: async (prop: DescriptionColumn["prop"]) => {
      const descriptions = await getProDescriptions();
      descriptions?.delColumn(prop);
    },
    /**
     * 获取表单数据
     *
     * @returns descriptions model
     */
    getModel: async <T extends Recordable>(filterEmptyVal = true): Promise<T> => {
      const descriptions = await getProDescriptions();
      const model = (descriptions?.model || {}) as T;

      if (filterEmptyVal) return filterEmpty<T>(model);
      return model;
    },
    /**
     * 提交表单
     *
     * @returns submit 结果：true | false
     */
    submitForm: async () => {
      const descriptions = await getProDescriptions();
      return descriptions?.handleSubmit();
    },
    /**
     * 重置表单
     */
    resetForm: async () => {
      const descriptions = await getProDescriptions();
      return descriptions?.handleReset();
    },
    /**
     * 获取字典枚举缓存 Map
     *
     * @returns optionsMap
     */
    getOptionsMap: async () => {
      const descriptions = await getProDescriptions();
      return descriptions?.optionsMap;
    },
    /**
     * 打开编辑状态
     */
    openEdited: async () => {
      const descriptions = await getProDescriptions();
      return descriptions?.openEdited();
    },
    /**
     * 关闭编辑状态
     */
    closeEdited: async () => {
      const descriptions = await getProDescriptions();
      return descriptions?.closeEdited();
    },
    /**
     * 获取 ElForm 组件的实例
     *
     * @returns ElForm instance
     */
    getProFormInstances: async () => {
      const descriptions = await getProDescriptions();
      return descriptions?.getProFormInstances();
    },
    /**
     * 获取 ElForm 组件的实例
     *
     * @returns ElForm instance
     */
    getElFormInstance: async (prop: string) => {
      const descriptions = await getProDescriptions();
      return descriptions?.getElFormInstance(prop);
    },
    /**
     * 获取 ProDescriptions 组件的实例
     *
     * @returns ProDescriptions instance
     */
    getProDescriptionsInstance: async () => {
      await getProDescriptions();
      return proDescriptionsInstance.value;
    },
    /**
     * 获取 ProForm 组件的实例
     *
     * @returns ProForm instance
     */
    getProFormInstance: async () => {
      const descriptions = await getProDescriptions();
      return descriptions?.proFormInstances;
    },
    /**
     * 获取 ElFormItem 组件的实例
     *
     * @param prop 表单项唯一标识
     * @returns descriptionsItem instance
     */
    getElFormItemInstance: async (prop: string) => {
      const descriptions = await getProDescriptions();
      return descriptions?.getElFormItemInstance(prop);
    },
    /**
     * 获取表单组件的实例
     *
     * @param prop 表单项唯一标识
     * @returns ElForm instance
     */
    getElInstance: async (prop: string) => {
      const descriptions = await getProDescriptions();
      return descriptions?.getElInstance(prop);
    },
  };

  const createMethods = {
    /**
     * 返回 ProDescriptions 组件的虚拟 DOM，直接在页面中渲染该虚拟 DOM 即可。可以理解为返回一个 Vue 组件
     */
    createDescriptionsComponent: (
      proDescriptionsProps?: ProDescriptionsPropsWithModel & Partial<ProDescriptionsEmits>,
      context: Recordable = {}
    ) => {
      const { attrs, slots } = context;
      const instance = createVNode(
        ProDescriptions,
        { ...attrs, ...proDescriptionsProps, onRegister: register },
        { ...slots }
      );
      return instance;
    },

    /**
     * 动态创建表单。使用该函数
     */
    createDescriptions: async (
      el: MaybeRef<HTMLElement> | string,
      proDescriptionsProps?: ProDescriptionsPropsWithModel & Partial<ProDescriptionsEmits>,
      slots?: { [slotName: string]: (scope?: any) => RenderTypes }
    ) => {
      const proDescriptionsInstance = createVNode(
        ProDescriptions,
        { ...proDescriptionsProps, onRegister: register },
        { ...slots }
      );
      const rootInstance = createVNode(
        ElConfigProvider,
        { namespace: ns.elNamespace },
        { default: () => proDescriptionsInstance }
      );
      await nextTick();

      if (isString(el)) {
        const rootEl = currentInstance?.refs[el as string] as HTMLElement;
        rootEl && render(rootInstance, rootEl);
      } else return render(rootInstance, toValue(el));
    },
  };

  return {
    descriptionsElState: {
      proDescriptionsInstance,
    },
    descriptionsMethods: methods,
    descriptionsRegister: register,
    createMethods,
  };
};
