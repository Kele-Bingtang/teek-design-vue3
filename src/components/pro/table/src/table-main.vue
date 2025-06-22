<script setup lang="ts">
import type { Component } from "vue";
import type { FormValidationResult, TableInstance } from "element-plus";
import type { ProFormInstance } from "@/components/pro/form";
import type { OperationNamespace, ProTableMainNamespace, TableScope, TableColumn, TableRow } from "./types";
import { toValue } from "vue";
import { ElTable, ElRadio, ElTableColumn } from "element-plus";
import { useNamespace } from "@/composables";
import { isEmpty, isFunction } from "@/utils";
import Pagination, { defaultPageInfo } from "@/components/pro/pagination";
import { getProp, filterOptions, filterOptionsValue, setProp, getObjectKeys } from "@/components/pro/helper";
import { useOptions } from "@/components/pro/use-options";
import TableColumnData from "./table-column/table-column-data.vue";
import TableColumnOperation from "./table-column/table-column-operation.vue";
import TableColumnDragSort from "./table-column/table-column-drag-sort.vue";
import { useSelection } from "./composables";
import { TableColumnTypeEnum, filterData, initModel, isServer } from "./helper";

defineOptions({ name: "TableMain" });

interface TableColumnType {
  el: Component; // 组件
  props?: Recordable; // 组件 props
  slots?: Recordable; // 组件插槽
  renderDefault?: (scope: TableScope) => VNode; // 自定义 el 组件的默认插槽渲染
}

const props = withDefaults(defineProps<ProTableMainNamespace.Props>(), {
  data: () => [],
  columns: () => [],
  operationProp: "operation",
  operationProps: () => ({}),
  pageInfo: () => defaultPageInfo,
  pageScope: false,
  paginationProps: () => ({}),
  radioProps: () => ({}),
  filterScope: false,
  headerCellStyle: () => ({}),
  editable: false,
  rowKey: "id",
  emptyText: "暂无数据",
});

const emits = defineEmits<ProTableMainNamespace.Emits>();

const ns = useNamespace("table-main");
const radio = ref("");
const elTableInstance = useTemplateRef<TableInstance>("elTableInstance");

const pageInfo = ref({ ...defaultPageInfo, ...props.pageInfo });

watchEffect(() => (pageInfo.value = { ...defaultPageInfo, ...props.pageInfo }));

// 功能列：多选列、单选列、序号列、展开列、拖拽排序列 等
const tableColumnTypeMap: Record<TableColumnTypeEnum, TableColumnType> = {
  [TableColumnTypeEnum.Selection]: { el: ElTableColumn, props: { reserveSelection: true } },
  [TableColumnTypeEnum.Radio]: {
    el: ElTableColumn,
    renderDefault: ({ row, $index }) =>
      h(ElRadio, {
        modelValue: radio.value,
        value: row[getRowKey(row)],
        onChange: () => handleRadioChange(row, $index),
        ...toValue(props.radioProps),
      }),
  },
  [TableColumnTypeEnum.Index]: { el: ElTableColumn },
  [TableColumnTypeEnum.Expand]: { el: ElTableColumn },
  [TableColumnTypeEnum.Sort]: {
    el: TableColumnDragSort,
    props: {
      tableInstance: elTableInstance,
      // 行拖拽排序结束事件
      onDragSortEnd: (newIndex: number, oldIndex: number) => {
        const [removedItem] = tableData.value.splice(oldIndex, 1);
        tableData.value.splice(newIndex, 0, removedItem);
        emits("dragSortEnd", newIndex, oldIndex);
      },
    },
    slots: ["drag-sort-icon"],
  },
};

const columnTypes = Object.keys(tableColumnTypeMap);

// 表格多选
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);
const { optionsMap, initOptionsMap } = useOptions();
const { availableColumns } = useTableInit();
const { handleClickCell, handleDoubleClickCell, handleSelectionChange, handleRadioChange } = useTableEvent();
const { getOperationColumn, handleButtonClick, handleConfirm, handleCancel } = useTableOperation();
const { handleCellEdit, handleFormChange } = useTableCellEdit();
const { filterTableData, handleFilter, handleFilterClear, handleFilterReset } = useTableFiler();
const { registerProFormInstance, getElFormInstance, getElFormItemInstance, getElInstance } = useTableInstanceGet();

// 表格实际渲染的数据
const tableData = computed(() => tryPagination(props.data));

// 数据发生改变，则清除过滤的数据
watch(
  () => props.data,
  () => (filterTableData.value = undefined)
);

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
 * 获取表格行的唯一标识
 */
const getRowKey = (row: Recordable) => {
  const { rowKey } = props;
  if (isFunction(rowKey)) return rowKey(row);
  return rowKey;
};

/**
 * 表格数据初始化相关逻辑
 */
function useTableInit() {
  let timer: ReturnType<typeof setTimeout> | null = null;

  // 过滤有效的列配置项
  const availableColumns = computed(() => props.columns.filter(column => !toValue(column.hide)));

  // 在表格的数据的每一个 row 配置 _options 相关字典信息（如果配置了 options）
  const initOptionsInData = async (data: Recordable[], columns: TableColumn[]) => {
    for (const column of columns) {
      const { prop = "", isFilterOptions = true, optionField, transformOption, optionsProp } = column;

      const options = unref(optionsMap.value.get(optionsProp || prop));
      // 如果字段有配置枚举信息，则存放到 _options[col.prop] 里
      if (options && toValue(isFilterOptions)) {
        data.map(row => {
          const option = transformOption
            ? transformOption(getProp(row, prop), options, row)
            : filterOptions(getProp(row, prop), options, optionField);

          const formatLabel = filterOptionsValue(option, optionField?.label || "label");

          if (!row._options) row._options = {};
          if (!row._option) row._option = {};
          if (!row._label) row._label = {};

          row._options[prop] = options;
          row._option[prop] = option;
          row._label[prop] = formatLabel;
          return row;
        });
      }
    }
  };

  // 扁平化 columns，为了过滤搜索配置项
  const flatColumnsFn = (columns: TableColumn[], flatArr: TableColumn[] = []) => {
    columns.forEach(col => {
      if (col.children?.length) flatArr.push(...flatColumnsFn(col.children));
      flatArr.push(col);
    });
    return flatArr.filter(item => !item.children?.length);
  };

  watch(
    availableColumns,
    newValue => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      // 防抖：防止初始化时连续执行
      timer = setTimeout(async () => {
        const flatColumns = flatColumnsFn(newValue);
        // 异步但有序执行
        for (const column of flatColumns) await initOptionsMap(column.options, column.prop || "");
        initOptionsInData(props.data, flatColumns);
      }, 10);
    },
    { deep: true, flush: "post" }
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
    radio.value = row[getRowKey(row)];
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
  const getOperationColumn = (column: TableColumn, index: number) => {
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
        label: toValue(column.label || operationProps.label),
      };
    }

    return {};
  };

  const handleButtonClick = (params: OperationNamespace.ButtonsCallBackParams) => {
    emits("buttonClick", params);
  };

  const handleConfirm = (params: OperationNamespace.ButtonsCallBackParams) => {
    emits("confirm", params);
  };

  const handleCancel = (params: OperationNamespace.ButtonsCallBackParams) => {
    emits("cancel", params);
  };

  return { getOperationColumn, handleButtonClick, handleConfirm, handleCancel };
}

/**
 * 表格单元格编辑相关方法
 */
function useTableCellEdit() {
  // 缓存关闭当前单元格的编辑态方法
  let closeCurrentCellEdit: (() => void) | null = null;
  // 缓存当前单元格的校验方法
  let validateCurrentCellEdit: (() => FormValidationResult | undefined) | null = () => Promise.resolve(true);
  // 缓存当前的 stopCurrentEditCell 函数
  let currentStopEditHandler: ((e: MouseEvent) => void) | null = null;

  /**
   * 点击单元格进入编辑态
   */
  const handleCellEdit = async (row: TableRow, column: TableColumn, type: "click" | "dblclick") => {
    const columnIndex = column.getColumnIndex!();
    const currentColumn = availableColumns.value[columnIndex];

    // 不是可编辑行，如功能列，操作列
    if (!currentColumn || currentColumn.type || currentColumn.prop === props.operationProp) return;

    // 没有开启点击编辑功能
    if (props.editable !== type) return;

    // 原先的单元格校验失败
    if (!(await validateCurrentCellEdit?.())) return;

    // 清理之前的监听器
    if (currentStopEditHandler) document.removeEventListener("click", currentStopEditHandler);

    // 定义停止编辑的函数
    currentStopEditHandler = (e: MouseEvent) => {
      handleStopEditClick(e, row, { ...column, ...currentColumn });
    };

    // 添加退出单元格编辑事件监听
    document.addEventListener("click", currentStopEditHandler);

    // 停止上一个单元格的编辑状态
    closeCurrentCellEdit?.();
    // 缓存当前单元格的退出编辑状态函数和校验函数
    closeCurrentCellEdit = () => row._closeCellEdit(currentColumn.prop);
    validateCurrentCellEdit = () => row._validateCellEdit(undefined, currentColumn.prop);

    // 开启当前点击的单元格的编辑
    row._openCellEdit(currentColumn.prop);
  };

  /**
   * 点击非表格的区域，停止当前单元格的编辑
   */
  const handleStopEditClick = async (e: MouseEvent, row: TableRow, column: TableColumn) => {
    if (!(await row._validateCellEdit(undefined, column.prop))) return;

    if (closeCurrentCellEdit && elTableInstance.value) {
      const target = e?.target as HTMLElement;

      if (target.classList.contains("el-icon")) return;

      const contains = elTableInstance.value.$el?.contains(target);

      if (!contains) {
        closeCurrentCellEdit();
        emits("leaveCellEdit", row, column);
        if (currentStopEditHandler) document.removeEventListener("click", currentStopEditHandler);
      }
    }
  };

  /**
   * 编辑态的表单值改变事件
   */
  const handleFormChange = (fromValue: unknown, prop: TableColumn["prop"], scope: TableScope) =>
    emits("formChange", fromValue, prop || "", scope);

  return { handleCellEdit, handleFormChange };
}

/**
 * 表格列过滤相关逻辑
 */
function useTableFiler() {
  const filterTableData = ref<Recordable[]>();

  /**
   * 执行过滤搜索
   */
  const handleFilter = (filterModel: Recordable, filterValue: unknown, prop: string | undefined) => {
    // 后端过滤
    if (isServer(toValue(props.filterScope))) return emits("filter", filterModel, filterValue, prop);

    const keys = getObjectKeys(filterModel);

    const filterRule: Recordable = {};
    keys.forEach(key => {
      const column = availableColumns.value.find(item => item.prop === key);
      initModel(filterRule, key, column?.filterProps?.rule || "eq");
    });

    // 前端过滤
    const finalFilterData = filterData(tableData.value, filterModel, filterRule);
    filterTableData.value = tryPagination(finalFilterData);

    emits("filter", filterModel, filterValue, prop);
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

/**
 * 表格使用的多个组件实例获取
 */
function useTableInstanceGet() {
  const proFormItemInstances = ref<Record<string, ProFormInstance>[]>([]);

  const registerProFormInstance = (index: number, prop: string, instance: ProFormInstance | null) => {
    proFormItemInstances.value[index] ??= {};
    setProp(proFormItemInstances.value[index], prop, instance);
  };

  // 获取指定行的指定 prop 的 ElForm 实例
  const getElFormInstance = (index: number, prop?: TableColumn["prop"]) => {
    const proFormItemInstance = proFormItemInstances.value?.[index];
    return proFormItemInstance?.[prop!].elFormInstance;
  };

  // 获取指定行的指定 prop 的 ElFormItem 实例
  const getElFormItemInstance = (index: number, prop?: TableColumn["prop"]) => {
    const proFormItemInstance = proFormItemInstances.value?.[index];
    return proFormItemInstance?.[prop!].getElFormItemInstance(prop!);
  };

  // 获取指定行的指定 prop 的表单组件实例
  const getElInstance = (index: number, prop: TableColumn["prop"]) => {
    const proFormItemInstance = proFormItemInstances.value?.[index];
    return proFormItemInstance?.[prop!].getElInstance(prop!);
  };

  return { registerProFormInstance, getElFormInstance, getElFormItemInstance, getElInstance };
}

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
    :header-cell-style="{ backgroundColor: ns.cssVar('gray-200'), ...headerCellStyle }"
    :data="filterTableData ? filterTableData : tableData"
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
        <component
          v-if="column.type && columnTypes.includes(column.type)"
          :is="tableColumnTypeMap[column.type].el"
          v-bind="{ ...column, ...tableColumnTypeMap[column.type].props }"
          :align="column.align ?? 'center'"
        >
          <!-- 功能列 - 表头插槽 -->
          <template #header="scope">
            <component v-if="column.headerRender" :is="column.headerRender" v-bind="scope"></component>
            <slot v-else :name="`${column.type}-header`" v-bind="scope">{{ scope.column.label }}</slot>
          </template>

          <!-- 功能列 - 默认插槽 -->
          <template #default="scope">
            <component
              v-if="tableColumnTypeMap[column.type].renderDefault"
              :is="tableColumnTypeMap[column.type].renderDefault?.(scope)"
            />
            <component v-else-if="column.render" :is="column.render" v-bind="scope" />
            <slot v-else-if="$slots[column.type]" :name="column.type" v-bind="scope" />
          </template>

          <!-- 功能列 - 自定义插槽 -->
          <template v-for="slot in tableColumnTypeMap[column.type].slots" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </component>

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
          v-bind="getOperationColumn(column, index)"
          :align="column.align || 'center'"
          :prop="operationProp"
          @button-click="handleButtonClick"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </TableColumnOperation>
      </template>
    </slot>

    <!-- 插入表格最后一行之后的插槽 -->
    <template #append><slot name="append"></slot></template>

    <!-- 无数据 -->
    <template #empty>
      <div :class="ns.e('empty')">
        <slot name="empty">
          <img src="@/assets/images/notData.png" alt="notData" />
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
      :total="data.length"
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
