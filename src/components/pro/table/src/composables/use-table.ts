import type { MaybeRef } from "vue";
import type { TableInstance } from "element-plus";
import type { ProTableInstance, ProTableNamespace, TableColumn } from "../types";
import type { PageInfo } from "@/components/pro/pagination";
import type { RenderTypes } from "@/components/pro/form-item";
import { createVNode, getCurrentInstance, nextTick, ref, render, toValue } from "vue";
import { storeToRefs } from "pinia";
import { ElConfigProvider } from "element-plus";
import { isString } from "@/common/utils";
import { useNamespace } from "@/composables";
import { useLayoutStore } from "@/pinia";
import ProTable from "../index.vue";

export const useProTable = () => {
  // ProTable 实例
  const proTableInstance = ref<ProTableInstance | null>();

  // ElTable 实例
  const elTableInstance = ref<TableInstance | null>();

  const ns = useNamespace();

  const { layoutSize } = storeToRefs(useLayoutStore());

  const currentInstance = getCurrentInstance();

  /**
   * @param proTable ProTable 实例
   * @param elTable ElTable 实例
   */
  const register = (proTable: ProTableInstance | null, elTable: TableInstance | null) => {
    proTableInstance.value = proTable;
    elTableInstance.value = elTable;
  };

  const tableState = {
    tableData: proTableInstance.value?.tableData, // 表格数据
    pageInfo: proTableInstance.value?.pageInfo, // 分页信息
    optionsMap: proTableInstance.value?.tableMainInstance?.optionsMap, // 字典枚举
  };

  const selectState = {
    isSelected: proTableInstance.value?.tableMainInstance?.isSelected, // 是否选中至少一行表格数据
    selectedList: proTableInstance.value?.tableMainInstance?.selectedList, // 选中的表格数据
    selectedListIds: proTableInstance.value?.tableMainInstance?.selectedListIds, // 选中的表格数据 ID 列表
  };

  const getTable = async () => {
    await nextTick();
    const table = proTableInstance.value;
    if (!table) console.error("The proTable is not registered. Please use the register method to register");
    return table;
  };

  const methods = {
    /**
     * 设置 proTable 组件的 props
     *
     * @param props table组件的props
     */
    setProps: async (props: ProTableNamespace.Props = {}) => {
      const table = await getTable();
      table?.setProps(props);
    },
    /**
     * 设置 column
     *
     * @param columnProps 需要设置的列
     */
    setColumn: async (columnProps: { prop: string; field: string; value: unknown }[]) => {
      const table = await getTable();
      table?.setColumn(columnProps);
    },
    /**
     * 新增 column
     *
     * @param column 需要新增数据
     * @param prop 在哪里新增，number 为下标，字符串为指定的 prop
     * @param position 如果 prop 为字符串，则指定新增到 prop 前还是后
     */
    addColumn: async (
      column: TableColumn,
      prop?: TableColumn["prop"] | number,
      position: "before" | "after" = "after"
    ) => {
      const table = await getTable();
      table?.addColumn(column, prop, position);
    },
    /**
     * 删除 column
     *
     * @param prop 删除哪个数据
     */
    delColumn: async (prop: TableColumn["prop"]) => {
      const table = await getTable();
      table?.delColumn(prop);
    },
    /**
     * 获取表格数据（调用接口）
     */
    getTableList: async () => {
      const table = await getTable();
      return table?.getTableList();
    },
    /**
     * 更新表格分页信息，从而更新表格数据
     */
    changePagination: async (paging: Partial<PageInfo>) => {
      const table = await getTable();
      return table?.handlePagination(paging);
    },
    /**
     * 执行查询（调用接口）
     */
    search: async () => {
      const table = await getTable();
      table?.search();
    },
    /**
     * 重置查询条件
     */
    reset: async () => {
      const table = await getTable();
      table?.reset();
    },
    /**
     * 打开/隐藏列设置
     */
    toggleColSetting: async () => {
      const table = await getTable();
      table?.tableHeadInstance?.toggleColumnSetting();
    },
    /**
     * 清除所有选择项
     */
    clearSelection: async () => {
      const table = await getTable();
      return table?.tableMainInstance?.clearSelection();
    },
    /**
     * 获取 ElTable 组件的实例
     * @returns ElTable instance
     */
    getElTableExpose: async () => {
      await getTable();
      return elTableInstance.value;
    },
    /**
     * 获取 ProTable 组件的实例
     * @returns ProTable instance
     */
    getTableExpose: async () => {
      await getTable();
      return proTableInstance.value;
    },
    /**
     * 获取编辑态的 ElForm 组件的实例
     * @param index 下标
     * @param prop 属性
     * @returns ElFormItem instance
     */
    getElFormInstance: async () => {
      const table = await getTable();
      return table?.tableMainInstance?.elTableInstance;
    },
    /**
     * 获取编辑态的 ElFormItem 组件的实例
     * @param index 下标
     * @param prop 属性
     * @returns ElFormItem instance
     */
    getElFormItemInstance: async (index: number, prop?: TableColumn["prop"]) => {
      const table = await getTable();
      return table?.tableMainInstance?.getElFormItemInstance(index, prop);
    },
    /**
     * 获取编辑态的表单组件的实例
     * @param index 下标
     * @param prop 属性
     * @returns 表单组件 instance
     */
    getElInstance: async (index: number, prop?: TableColumn["prop"]) => {
      const table = await getTable();
      return table?.tableMainInstance?.getElInstance(index, prop);
    },
  };

  const createMethods = {
    /**
     * 返回 ProTable 组件的虚拟 DOM，直接在页面中渲染该虚拟 DOM 即可。可以理解为返回一个 Vue 组件
     */
    createTableComponent: (
      proTableProps?: ProTableNamespace.Props & Partial<ProTableNamespace.OnEmits>,
      context: Recordable = {}
    ) => {
      const { attrs, slots } = context;
      const instance = createVNode(ProTable, { ...attrs, ...proTableProps, onRegister: register }, { ...slots });
      return instance;
    },

    /**
     * 动态创建表格
     */
    createTable: async (
      el: MaybeRef<HTMLElement> | string,
      proTableProps?: ProTableNamespace.Props & Partial<ProTableNamespace.OnEmits>,
      slots?: { [slotName: string]: (scope?: any) => RenderTypes }
    ) => {
      const proTableInstance = createVNode(ProTable, { ...proTableProps, onRegister: register }, { ...slots });
      const rootInstance = createVNode(
        ElConfigProvider,
        { namespace: ns.elNamespace, size: layoutSize.value },
        { default: () => proTableInstance }
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
    tableRegister: register,
    proTableInstanceState: {
      proTableInstance: proTableInstance.value,
      elTableInstance: elTableInstance.value,
    },
    tableState,
    selectState,
    tableMethods: methods,
    createMethods,
  };

  return returnValue;
};
