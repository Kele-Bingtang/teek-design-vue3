<script setup lang="ts">
import type { TableInstance } from "element-plus";
import type { OperationNamespace, ProTableMainNamespace, TableScope, TableColumn, TableRow } from "./types";
import { toValue, ref, computed, watch, watchEffect, useTemplateRef, nextTick, unref } from "vue";
import { ElTable, ElMessage } from "element-plus";
import { isArray, isEmpty } from "@/common/utils";
import Pagination, { defaultPageInfo } from "@/components/pro/pagination";
import {
  getProp,
  setProp,
  filterOptions,
  filterOptionsValue,
  getObjectKeys,
  flatColumnsFn,
} from "@/components/pro/helper";
import { useOptions } from "@/components/pro/use-options";
import { useNamespace } from "@/composables";
import TableColumnData from "./table-column/table-column-data.vue";
import TableColumnOperation from "./table-column/table-column-operation.vue";
import TableColumnType from "./table-column/table-column-type.vue";
import { useSelection, useTableCellEdit, useTableFormInstance } from "./composables";
import { filterData, initModel, isServer } from "./helper";

defineOptions({ name: "TableMain" });

const props = withDefaults(defineProps<ProTableMainNamespace.Props>(), {
  data: () => [],
  columns: () => [],
  rowKey: "id",
  operationProp: "operation",
  operationProps: () => ({}),
  pageInfo: () => defaultPageInfo,
  pageScope: false,
  paginationProps: () => ({}),
  filterScope: false,
  headerCellStyle: () => ({}),
  editable: false,
  emptyText: "暂无数据",
  selectedRadio: "",
  radioProps: () => ({}),
});

const emits = defineEmits<ProTableMainNamespace.Emits>();

const ns = useNamespace("table-main");

const elTableInstance = useTemplateRef<TableInstance>("elTableInstance");

const pageInfo = ref({ ...defaultPageInfo, ...props.pageInfo });

watchEffect(() => (pageInfo.value = { ...defaultPageInfo, ...props.pageInfo }));

// 表格实际渲染的数据
const tableData = computed(() => tryPagination(filterTableData.value ?? props.data));
const tableDataTotal = computed(() => pageInfo.value.total || (filterTableData.value?.length ?? props.data.length));

// 数据发生改变，则清除过滤的数据
watch(
  () => props.data,
  () => (filterTableData.value = undefined)
);

const { optionsMap, initOptionsMap } = useOptions();
const { availableColumns } = useTableInit();
const { handleClickCell, handleDoubleClickCell, handleSelectionChange, handleRadioChange } = useTableEvent();
const { getOperationProps, handleButtonClick, handleButtonConfirm, handleButtonCancel } = useTableOperation();
const { filterTableData, handleFilter, handleFilterClear, handleFilterReset } = useTableFiler();

// 表格选择
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);
// 表格单元格编辑
const { handleCellEdit } = useTableCellEdit(
  availableColumns,
  computed(() => toValue(props.editable)),
  elTableInstance,
  {
    preventCellEdit: column => column.prop === props.operationProp,
    preventCellCloseClass: ["el-cion"],
    leaveCellEdit: (row, column) => emits("leaveCellEdit", row, column),
  }
);
// 表格编辑态的表单相关实例注册和获取
const { registerProFormInstance, getElFormInstance, getElFormItemInstance, getElInstance } = useTableFormInstance();

/**
 * 执行分页操作
 */
const tryPagination = (data: Recordable[] = []) => {
  if (!data.length) return [];

  // 如果服务端（后端）分页，则不执行分页，需要后端返回已分页的 data
  if (isServer(toValue(props.pageScope))) return data;

  // 客户端（前端）分页
  const { pageNum, pageSize } = pageInfo.value;
  return data.slice((pageNum - 1) * pageSize, pageNum * pageSize);
};

/**
 * 表格数据初始化相关逻辑
 */
function useTableInit() {
  // 过滤有效的列配置项
  const availableColumns = computed(() => props.columns.filter(column => !toValue(column.hidden)));

  // 在表格的数据的每一个 row 配置 _options 相关字典信息（如果配置了 options）
  const initEnhanceFnInData = (data: TableRow[], column: TableColumn) => {
    // 获取当前列的配置项，！获取的配置无法直接作用在 row._xx 里
    const {
      prop = "",
      isFilterOptions = true,
      optionsProp,
      optionField,
      transformOption,
      ignoreOptionIfAbsent,
      editable,
    } = column;

    const options = unref(optionsMap.value.get(optionsProp || prop));

    // 如果字段有配置枚举信息，则存放到 _options[prop] 里
    data.forEach(row => {
      row._options ??= {};
      if (options && toValue(isFilterOptions)) row._options[prop] = options;

      row._optionProps ??= {};
      row._optionProps[prop] ??= { optionField, transformOption, ignoreOptionIfAbsent };

      /**
       * 根据 prop 获取 value
       */
      row._getValue ??= (prop: string) => {
        const options = row._options[prop];
        const value = getProp(row, prop);
        if (!options) return value;

        const { optionField, transformOption, ignoreOptionIfAbsent } = row._optionProps[prop] || {};

        const option = transformOption
          ? transformOption(value, options, row)
          : filterOptions(value, options, optionField);

        const label = option ? filterOptionsValue(option, optionField?.label || "label") : "";

        if ((!label || label === "--") && toValue(ignoreOptionIfAbsent)) return value;
        return label;
      };

      // 获取 row 的纯数据（过滤掉内置的加强方法）
      row._getData ??= () => {
        return Object.fromEntries(Object.entries(row).filter(([key]) => !key.startsWith("_")));
      };

      // 初始化 _editableCol
      row._editableCol ??= {};
      if (editable) setProp(row._editableCol, prop, true);

      // 开启多个单元格编辑状态
      row._openCellEdit ??= props => {
        row._oldData ??= {};

        if (props) {
          // 开启指定单元格的编辑状态
          const open = (prop: string) => {
            // 编辑前缓存旧数据
            setProp(row._oldData, prop, row._getValue(prop));

            setProp(row._editableCol, prop, true);
            nextTick(() => {
              // 焦点聚焦
              (row._proFormInstance?.[prop]?.getElInstance(prop) as HTMLElement)?.focus?.();
            });
          };

          if (isArray(props)) props.forEach(prop => open(prop));
          else open(props);
        } else {
          row._editable = true;
          row._oldData = { ...row._getData() };
        }
      };

      // 关闭开启单元格编辑状态
      row._closeCellEdit ??= (props, reset = false) => {
        if (props) {
          // 关闭指定单元格的编辑状态
          const close = (prop: string) => setProp(row._editableCol, prop, false);

          if (isArray(props)) props.forEach(prop => close(prop));
          else close(props);
        } else row._editable = false;

        reset && row._resetCellData(props);
      };

      // 还原编辑前的数据
      row._resetCellData ??= props => {
        row._oldData ??= {};
        if (props) {
          // 重置指定单元格数据
          const reset = (prop: string) => {
            const data = getProp(row._oldData, prop);
            data && setProp(row, prop, data);
          };

          if (isArray(props)) props.forEach(reset);
          else reset(props);
        } else {
          Object.entries(row._oldData).forEach(([prop, value]) => {
            setProp(row, prop, value);
          });
        }
        delete row._oldData;
      };

      // 判断当前单元格是否处于编辑状态
      row._isCellEdit ??= (props, mode = "and") => {
        if (props) {
          if (isArray(props)) {
            return mode === "and"
              ? props.every(prop => getProp(row._editableCol, prop) ?? false)
              : props.some(prop => getProp(row._editableCol, prop) ?? false);
          }
          return getProp(row._editableCol, prop) ?? false;
        }
        return row._editable ?? false;
      };

      // 编辑态行/单元格校验
      row._validateCellEdit ??= async (callback, prop) => {
        if (!row._proFormInstance) return true;

        try {
          // 校验失败会走 catch
          if (prop) await row._proFormInstance[prop].elFormInstance?.validate();
          else {
            const proFormInstances = Object.values(row._proFormInstance);
            await Promise.all(
              proFormInstances.map(async proFormInstance => {
                await proFormInstance.elFormInstance?.validate();
              })
            );
          }

          callback?.(true, undefined);
          return true;
        } catch (error) {
          // 如果校验失败且没有自定义 callback，则弹出内置错误信息
          if (!callback) {
            ElMessage.closeAll();
            ElMessage.warning(Object.values(error || { message: ["请完整填写表单然后再次提交！"] })[0][0].message);
          }

          callback?.(false, error as any);
          return false;
        }
      };
    });
  };

  // 当 columns 发生改变时，重新初始化
  watch(
    availableColumns,
    async newValue => {
      const flatColumns = flatColumnsFn(newValue);
      // 异步但有序执行
      for (const column of flatColumns) {
        await initOptionsMap(column.options, column.prop || "");
        initEnhanceFnInData(props.data as TableRow[], column);
      }
    },
    { deep: true, flush: "post" }
  );

  // 不对数据进行深度监听，当数据整体发生改变时，重新初始化
  watch(
    () => props.data,
    async newValue => {
      const flatColumns = flatColumnsFn(availableColumns.value);
      for (const column of flatColumns) {
        await initOptionsMap(column.options, column.prop || "");
        initEnhanceFnInData(newValue as TableRow[], column);
      }
    }
  );

  return { availableColumns };
}

/**
 * 表格自身事件相关方法
 */
function useTableEvent() {
  /**
   * 单元格点击编辑
   */
  const handleClickCell = (row: TableRow, column: TableColumn, cell: HTMLTableCellElement, event: Event) => {
    handleCellEdit(row, column, "click");
    emits("cellClick", row, column, cell, event);
  };

  /**
   * 单元格双击编辑
   */
  const handleDoubleClickCell = (row: TableRow, column: TableColumn, cell: HTMLTableCellElement, event: Event) => {
    handleCellEdit(row, column, "dblclick");
    emits("cellDblClick", row, column, cell, event);
  };

  /**
   * 多选触发事件
   */
  const handleSelectionChange = (newSelection: Recordable[]) => {
    selectionChange(newSelection);
    emits("selectionChange", {
      isSelected: isSelected.value,
      selectedList: selectedList.value,
      selectedListIds: selectedListIds.value,
    });
  };

  /**
   * 单选触发事件
   */
  const handleRadioChange = (row: Recordable, index: number) => {
    selectionChange([row]);
    emits(
      "selectionChange",
      { isSelected: isSelected.value, selectedList: selectedList.value, selectedListIds: selectedListIds.value },
      index
    );
  };

  return { handleClickCell, handleDoubleClickCell, handleSelectionChange, handleRadioChange };
}

/**
 * 表格操作列相关方法
 */
function useTableOperation() {
  /**
   * 获取操作列的配置项
   */
  const getOperationProps = (column: TableColumn, index: number) => {
    const { operationProps, operationProp } = props;
    if (column.prop === operationProp) {
      return {
        ...column,
        ...operationProps,
        width: toValue(column.width || operationProps.width),
        label: toValue(column.label || operationProps.label),
      };
    }

    if (operationProps && index === availableColumns.value.length - 1) {
      return {
        ...operationProps,
        width: toValue(column.width || operationProps.width),
        label: toValue(operationProps.label),
      };
    }

    return {};
  };

  const handleButtonClick = (params: OperationNamespace.ButtonsCallBackParams) => {
    emits("buttonClick", params);
  };

  const handleButtonConfirm = (params: OperationNamespace.ButtonsCallBackParams) => {
    emits("buttonConfirm", params);
  };

  const handleButtonCancel = (params: OperationNamespace.ButtonsCallBackParams) => {
    emits("buttonCancel", params);
  };

  return { getOperationProps, handleButtonClick, handleButtonConfirm, handleButtonCancel };
}

/**
 * 表格列过滤相关逻辑
 */
function useTableFiler() {
  // 过滤后的表格数据
  const filterTableData = ref<Recordable[]>();
  // 过滤数据表单
  const filterModel = ref<Recordable>({});

  /**
   * 执行过滤搜索
   */
  const handleFilter = (filterValue: unknown, prop: string | undefined) => {
    if (prop) setProp(filterModel.value, prop, filterValue);

    // 后端过滤
    if (isServer(toValue(props.filterScope))) return emits("filter", filterModel.value, filterValue, prop);

    const keys = getObjectKeys(filterModel.value);

    const filterRule: Recordable = {};
    keys.forEach(key => {
      const column = availableColumns.value.find(item => item.prop === key);
      // 可以返回新的过滤值，如去掉 %、转换为小写等
      const formatFilterValue = column?.beforeFilter?.(filterValue, filterModel.value, prop);
      if (formatFilterValue === false) return;

      formatFilterValue && setProp(filterModel.value, key, formatFilterValue);
      initModel(filterRule, key, column?.filterProps?.rule || "eq");
    });

    // 前端过滤
    filterTableData.value = filterData(props.data, filterModel.value, filterRule);

    emits("filter", filterModel.value, filterValue, prop);
  };
  /**
   * 执行过滤清除
   */
  const handleFilterClear = (prop: string | undefined) => {
    emits("filterClear", prop);
  };
  /**
   * 执行过滤重置
   */
  const handleFilterReset = () => {
    filterTableData.value = undefined;
    emits("filterReset");
  };

  return { filterTableData, handleFilter, handleFilterClear, handleFilterReset };
}

const handleDragSortEnd = (newIndex: number, oldIndex: number) => {
  const [removedItem] = tableData.value.splice(oldIndex, 1);
  tableData.value.splice(newIndex, 0, removedItem);
  emits("dragSortEnd", newIndex, oldIndex);
};

/**
 * 编辑态的表单值改变事件
 */
const handleFormChange = (fromValue: unknown, prop: TableColumn["prop"], scope: TableScope) =>
  emits("formChange", fromValue, prop || "", scope);

/**
 * 分页改变事件
 */
const handlePaginationChange = () => emits("paginationChange", pageInfo.value);

/**
 * 清空选中数据列表
 */
const clearSelection = () => elTableInstance.value?.clearSelection();

const expose = {
  optionsMap,
  elTableInstance,
  isSelected,
  selectedList,
  selectedListIds,
  clearSelection,
  getElFormInstance,
  getElFormItemInstance,
  getElInstance,
};

defineExpose(expose);
</script>

<template>
  <el-table
    ref="elTableInstance"
    show-overflow-tooltip
    v-bind="$attrs"
    :header-cell-style="{ backgroundColor: `rgb(${ns.cssVar('gray-200-rgb')}, 0.6)`, ...headerCellStyle }"
    :data="tableData"
    :row-key
    :class="ns.b()"
    @selection-change="handleSelectionChange"
    @cell-click="handleClickCell"
    @cell-dblclick="handleDoubleClickCell"
  >
    <!-- 默认插槽 -->
    <slot name="default">
      <template v-for="(column, index) in availableColumns" :key="column">
        <!-- 功能列 -->
        <TableColumnType
          v-if="column.type"
          :column
          :row-key
          :selected-radio
          :radio-props
          :el-table-instance
          @radio-change="handleRadioChange"
          @drag-sort-end="handleDragSortEnd"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </TableColumnType>

        <!-- 数据列 -->
        <TableColumnData
          v-else-if="column.prop !== operationProp"
          :column
          :width="toValue(column.width)"
          :label="toValue(column.label)"
          :align="column.align || 'center'"
          :editable
          @register-pro-form-instance="registerProFormInstance"
          @form-change="handleFormChange"
          @filter="handleFilter"
          @filter-clear="handleFilterClear"
          @filter-reset="handleFilterReset"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </TableColumnData>

        <!-- 操作列 -->
        <TableColumnOperation
          v-if="column.prop === operationProp || (!isEmpty(operationProps) && index === columns.length - 1)"
          v-bind="getOperationProps(column, index)"
          :align="column.align || 'center'"
          :prop="operationProp"
          @button-click="handleButtonClick"
          @button-confirm="handleButtonConfirm"
          @button-cancel="handleButtonCancel"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </TableColumnOperation>
      </template>

      <!-- 插入表格最后一列之后的插槽 -->
      <slot name="append-column" />
    </slot>

    <!-- 插入表格最后一行之后的插槽 -->
    <template #append><slot name="append"></slot></template>

    <!-- 无数据 -->
    <template #empty>
      <div :class="ns.e('empty')">
        <slot name="empty">
          <img src="@/common/assets/images/notData.png" alt="notData" />
          <div>{{ emptyText }}</div>
        </slot>
      </div>
    </template>
  </el-table>

  <!-- 表格分页 -->
  <slot name="pagination">
    <Pagination
      v-if="pageScope"
      v-model="pageInfo"
      @change="handlePaginationChange"
      :total="tableDataTotal"
      v-bind="paginationProps"
    >
      <template v-if="$slots['pagination-left']" #pagination-left>
        <slot name="pagination-left" />
      </template>
      <template v-if="$slots['pagination-right']" #pagination-right>
        <slot name="pagination-right" />
      </template>
    </Pagination>
  </slot>
</template>
