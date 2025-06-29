import type { FormColumn } from "@/components/pro/form";
import type { RenderTypes } from "@/components/pro/form-item";
import type { ProFormGroupInstance, ProFormGroupOnEmits, ProFormGroupProps } from "../types";
import { ElConfigProvider, type FormInstance } from "element-plus";
import { createVNode, getCurrentInstance, nextTick, ref, render } from "vue";
import { useNamespace } from "@/composables";
import { useLayoutStore } from "@/pinia";
import { isString } from "@/common/utils";
import { filterEmpty } from "@/components/pro/helper";
import ProFormGroup from "../index.vue";

type ProFormGroupPropsWithModel = ProFormGroupProps & { modelValue?: Recordable };

export const useProFormGroup = () => {
  // ProFromGroup 实例
  const proFormGroupInstance = ref<ProFormGroupInstance | null>();
  // ElForm 实例
  const elFormInstance = ref<FormInstance | null>();

  const ns = useNamespace();
  const currentInstance = getCurrentInstance();

  const layoutSize = computed(() => useLayoutStore().layoutSize);

  /**
   * @param ProFormGroup ProFormGroup 实例
   * @param elForm ElForm 实例
   */
  const register = (proFormGroup: ProFormGroupInstance | null) => {
    proFormGroupInstance.value = proFormGroup;
    elFormInstance.value = proFormGroup?.getElFormInstance();
  };

  const getProFormGroup = async () => {
    await nextTick();
    const form = proFormGroupInstance.value;
    if (!form) console.error("The form is not registered. Please use the register method to register");

    return form;
  };

  // 一些内置的方法
  const methods = {
    /**
     * 设置 ProFormGroup 组件的 props
     *
     * @param props ProFormGroup 组件的 props
     */
    setProps: async (props: ProFormGroupPropsWithModel = {}) => {
      const formGroup = await getProFormGroup();
      formGroup?.setProps(props);

      if (props.modelValue) formGroup?.setValues(props.modelValue);
    },
    /**
     * 设置 model 的值
     *
     * @param model 需要设置的数据
     */
    setValues: async (model: Recordable) => {
      const formGroup = await getProFormGroup();
      formGroup?.setValues(model);
    },
    /**
     * 设置 column
     *
     * @param columnProps 需要设置的 columnProps
     */
    setColumn: async (columnProps: { prop: string; field: string; value: unknown }[]) => {
      const formGroup = await getProFormGroup();
      formGroup?.setColumn(columnProps);
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
      const formGroup = await getProFormGroup();
      formGroup?.addColumn(column, propOrIndex, position);
    },
    /**
     * 删除 column
     *
     * @param field 删除哪个数据
     */
    delColumn: async (prop: FormColumn["prop"]) => {
      const formGroup = await getProFormGroup();
      formGroup?.delColumn(prop);
    },
    /**
     * 获取表单数据
     *
     * @returns form model
     */
    getFormModel: async <T extends Recordable>(filterEmptyVal = true): Promise<T> => {
      const formGroup = await getProFormGroup();
      const model = (formGroup?.model || {}) as T;

      if (filterEmptyVal) return filterEmpty<T>(model);
      return model;
    },
    /**
     * 提交表单
     *
     * @returns submit 结果：true | false
     */
    submitForm: async () => {
      const formGroup = await getProFormGroup();
      return formGroup?.submitForm();
    },
    /**
     * 重置表单
     */
    resetForm: async () => {
      const formGroup = await getProFormGroup();
      return formGroup?.resetForm();
    },
    /**
     * 获取字典枚举缓存 Map
     *
     * @returns optionsMap
     */
    getOptionsMap: async () => {
      const formGroup = await getProFormGroup();
      return formGroup?.getOptionsMap();
    },
    /**
     * 获取 ElForm 组件的实例
     *
     * @returns ElForm instance
     */
    getElFormInstance: async () => {
      const formGroup = await getProFormGroup();
      return formGroup?.getElFormInstance();
    },
    /**
     * 获取 ProFormGroup 组件的实例
     *
     * @returns ProFormGroup instance
     */
    getProFormGroupGroupInstance: async () => {
      await getProFormGroup();
      return proFormGroupInstance.value;
    },
    /**
     * 获取 ProFormMain 组件的实例
     *
     * @returns ProFormGroup instance
     */
    getProFormMainInstance: async () => {
      const formGroup = await getProFormGroup();
      return formGroup?.getProFormMainInstance();
    },
    /**
     * 获取 ElFormItem 组件的实例
     *
     * @param prop 表单项唯一标识
     * @returns formItem instance
     */
    getElFormItemInstance: async (prop: string) => {
      const formGroup = await getProFormGroup();
      return formGroup?.getElFormItemInstance(prop);
    },
    /**
     * 获取表单组件的实例
     *
     * @param prop 表单项唯一标识
     * @returns ElForm instance
     */
    getElInstance: async (prop: string) => {
      const formGroup = await getProFormGroup();
      return formGroup?.getElInstance(prop);
    },
  };

  const createMethods = {
    /**
     * 返回 ProFormGroup 组件的虚拟 DOM，直接在页面中渲染该虚拟 DOM 即可。可以理解为返回一个 Vue 组件
     */
    createFormGroupComponent: (
      proFormGroupProps?: ProFormGroupPropsWithModel & Partial<ProFormGroupOnEmits>,
      context: Recordable = {}
    ) => {
      const { attrs, slots } = context;
      const instance = createVNode(
        ProFormGroup,
        { ...attrs, ...proFormGroupProps, onRegister: register },
        { ...slots }
      );
      return instance;
    },

    /**
     * 动态创建表单。使用该函数，控制台会有 warning： Slot "XXX" invoked outside of the render function，可以忽略
     */
    createForm: async (
      el: MaybeRef<HTMLElement> | string,
      proFormGroupProps?: ProFormGroupPropsWithModel & Partial<ProFormGroupOnEmits>,
      slots?: { [slotName: string]: (scope?: any) => RenderTypes }
    ) => {
      const proFormGroupInstance = createVNode(
        ProFormGroup,
        { ...proFormGroupProps, onRegister: register },
        { ...slots }
      );
      const rootInstance = createVNode(
        ElConfigProvider,
        { namespace: ns.elNamespace, size: layoutSize.value },
        { default: () => proFormGroupInstance }
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
      proFormGroupInstance,
      elFormInstance,
    },
    formMethods: methods,
    formRegister: register,
    createMethods,
  };
};
