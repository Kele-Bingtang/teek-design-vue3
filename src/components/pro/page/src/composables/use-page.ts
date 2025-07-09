import type { RenderTypes } from "@/components/pro/form-item";
import type { ProPageEmits, ProPageProps } from "../types";
import { createVNode, getCurrentInstance, nextTick, render } from "vue";
import { useNamespace } from "@/composables";
import { useLayoutStore } from "@/pinia";
import { ElConfigProvider } from "element-plus";
import { isString } from "@/common/utils";
import { useProTable } from "@/components/pro/table";
import { useProSearch } from "@/components/pro/search";
import ProPage from "../index.vue";

export const useProPage = () => {
  const ns = useNamespace();
  const { layoutSize } = storeToRefs(useLayoutStore());

  const currentInstance = getCurrentInstance();

  const proTable = useProTable();
  const proSearch = useProSearch();

  const createMethods = {
    /**
     * 返回 ProPage 组件的虚拟 DOM，直接在页面中渲染该虚拟 DOM 即可。可以理解为返回一个 Vue 组件
     */
    createPageComponent: (proPageProps?: ProPageProps & Partial<ProPageEmits>, context: Recordable = {}) => {
      const { attrs, slots } = context;
      const instance = createVNode(
        ProPage,
        {
          ...attrs,
          ...proPageProps,
          onTableRegister: proTable.tableRegister,
          onSearchRegister: proSearch.searchElState,
        },
        { ...slots }
      );
      return instance;
    },

    /**
     * 动态创建表格。使用该函数，控制台会有 warning： Slot "XXX" invoked outside of the render function，可以忽略
     */
    createPage: async (
      el: MaybeRef<HTMLElement> | string,
      proPageProps?: ProPageProps & Partial<ProPageEmits>,
      slots?: { [slotName: string]: (scope?: any) => RenderTypes }
    ) => {
      const proPageInstance = createVNode(
        ProPage,
        { ...proPageProps, onTableRegister: proTable.tableRegister, onSearchRegister: proSearch.searchElState },
        { ...slots }
      );
      const rootInstance = createVNode(
        ElConfigProvider,
        { namespace: ns.elNamespace, size: layoutSize.value },
        { default: () => proPageInstance }
      );
      await nextTick();

      if (isString(el)) {
        const rootEl = currentInstance?.refs[el as string] as HTMLElement;
        rootEl && render(rootInstance, rootEl);
      } else render(rootInstance, toValue(el));

      return returnValue;
    },
  };

  const returnValue = {
    createMethods,
    proTable,
    proSearch,
  };

  return returnValue;
};
