import type { MaybeRef } from "vue";
import type { FormInstance } from "element-plus";
import type { RenderTypes } from "@/components/pro/form-item";
import type { FormColumn, ProFormInstance, ProFormNamespace } from "../types";
import { ElConfigProvider } from "element-plus";
import { createVNode, getCurrentInstance, nextTick, ref, render, toValue } from "vue";
import { isString } from "@/common/utils";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";
import { filterEmpty } from "@/components/pro/helper";
import ProForm from "../index.vue";

type ProFormPropsWithModel = ProFormNamespace.Props & { modelValue?: Recordable };

/**
 * 通过函数动态修改 ProForm 相关数据
 */
export const useProForm = () => {
  // ProFrom 实例
  const proFormInstance = ref<ProFormInstance | null>();

  // ElForm 实例
  const elFormInstance = ref<FormInstance | null>();

  const ns = useNamespace();
  const currentInstance = getCurrentInstance();

  const settingStore = useSettingStore();

  const { layout } = storeToRefs(settingStore);

  /**
   * @param proForm ProForm 实例
   * @param elForm ElForm 实例
   */
  const register = (proForm: ProFormInstance | null, elForm: FormInstance | null) => {
    proFormInstance.value = proForm;
    elFormInstance.value = elForm;
  };

  const getProForm = async () => {
    await nextTick();
    const form = proFormInstance.value;
    if (!form) console.error("The form is not registered. Please use the register method to register");

    return form;
  };

  // 一些内置的方法
  const methods = {
    /**
     * 设置 ProForm 组件的 props
     *
     * @param props ProForm 组件的 props
     */
    setProps: async (props: ProFormPropsWithModel = {}) => {
      const form = await getProForm();
      form?.setProps(props);

      if (props.modelValue) form?.setValues(props.modelValue);
    },
    /**
     * 设置 model 的值
     *
     * @param model 需要设置的数据
     */
    setValues: async (model: Recordable) => {
      const form = await getProForm();
      form?.setValues(model);
    },
    /**
     * 设置 column
     *
     * @param columnProps 需要设置的 columnProps
     */
    setColumn: async (columnProps: { prop: string; field: string; value: any }[]) => {
      const form = await getProForm();
      form?.setColumn(columnProps);
    },
    /**
     * 新增 column
     *
     * @param prop 在哪里新增，number 为下标，字符串为指定的 prop
     * @param position 如果 prop 为字符串，则指定新增到 prop 前还是后
     */
    addColumn: async (
      column: FormColumn,
      propOrIndex?: FormColumn["prop"] | number,
      position: "before" | "after" = "after"
    ) => {
      const form = await getProForm();
      form?.addColumn(column, propOrIndex, position);
    },
    /**
     * 删除 column
     *
     * @param field 删除哪个数据
     */
    delColumn: async (prop: FormColumn["prop"]) => {
      const form = await getProForm();
      form?.delColumn(prop);
    },
    /**
     * 获取表单数据
     *
     * @returns form model
     */
    getFormModel: async <T extends Recordable>(filterEmptyVal = true): Promise<T> => {
      const form = await getProForm();
      const model = (form?.model || {}) as T;

      if (filterEmptyVal) return filterEmpty<T>(model);
      return model;
    },
    /**
     * 提交表单
     *
     * @returns submit 结果：true | false
     */
    submitForm: async () => {
      const form = await getProForm();
      return form?.handleSubmit();
    },
    /**
     * 重置表单
     */
    resetForm: async () => {
      const form = await getProForm();
      return form?.handleReset();
    },
    /**
     * 获取字典枚举缓存 Map
     *
     * @returns optionsMap
     */
    getOptionsMap: async () => {
      const form = await getProForm();
      return form?.getOptionsMap();
    },
    /**
     * 获取 ElForm 组件的实例
     *
     * @returns ElForm instance
     */
    getElFormInstance: async () => {
      await getProForm();
      return elFormInstance.value;
    },
    /**
     * 获取 ProForm 组件的实例
     *
     * @returns ProForm instance
     */
    getProFormInstance: async () => {
      await getProForm();
      return proFormInstance.value;
    },
    /**
     * 获取 ProFormMain 组件的实例
     *
     * @returns ProForm instance
     */
    getProFormMainInstance: async () => {
      const form = await getProForm();
      return form?.proFormMainInstance;
    },
    /**
     * 获取 ElFormItem 组件的实例
     *
     * @param prop 表单项唯一标识
     * @returns formItem instance
     */
    getElFormItemInstance: async (prop: string) => {
      const form = await getProForm();
      return form?.getElFormItemInstance(prop);
    },
    /**
     * 获取表单组件的实例
     *
     * @param prop 表单项唯一标识
     * @returns ElForm instance
     */
    getElInstance: async (prop: string) => {
      const form = await getProForm();
      return form?.getElInstance(prop);
    },
  };

  const createMethods = {
    /**
     * 返回 ProForm 组件的虚拟 DOM，直接在页面中渲染该虚拟 DOM 即可。可以理解为返回一个 Vue 组件
     */
    createFormComponent: (
      proFormProps?: ProFormPropsWithModel & Partial<ProFormNamespace.OnEmits>,
      context: Recordable = {}
    ) => {
      const { attrs, slots } = context;
      const instance = createVNode(ProForm, { ...attrs, ...proFormProps, onRegister: register }, { ...slots });
      return instance;
    },

    /**
     * 动态创建表单
     */
    createForm: async (
      el: MaybeRef<HTMLElement> | string,
      proFormProps?: ProFormPropsWithModel & Partial<ProFormNamespace.OnEmits>,
      slots?: { [slotName: string]: (scope?: any) => RenderTypes }
    ) => {
      const proFormInstance = createVNode(ProForm, { ...proFormProps, onRegister: register }, { ...slots });
      const rootInstance = createVNode(
        ElConfigProvider,
        { namespace: ns.elNamespace, size: layout.value.elementPlusSize },
        { default: () => proFormInstance }
      );
      await nextTick();

      if (isString(el)) {
        const rootEl = currentInstance?.refs[el as string] as HTMLElement;
        rootEl && render(rootInstance, rootEl);
      } else return render(rootInstance, toValue(el));
    },
  };

  return {
    formElState: {
      proFormInstance,
      elFormInstance,
    },
    formMethods: methods,
    formRegister: register,
    createMethods,
  };
};
