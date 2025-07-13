<script setup lang="ts">
import type { UnwrapRef } from "vue";
import type { PageInfo } from "@/components/pro/pagination";
import type {
  OperationNamespace,
  ProTableHeadInstance,
  ProTableMainInstance,
  ProTableNamespace,
  TableColumn,
  SizeStyle,
  TableScope,
  TableRow,
} from "./types";
import type { UseSelectState } from "./composables";
import { ref, computed, watchEffect, onMounted, useTemplateRef, isRef, isReactive, reactive, unref } from "vue";
import { ElTableColumn, ElButton } from "element-plus";
import { Tools } from "@element-plus/icons-vue";
import { defaultPageInfo } from "@/components/pro/pagination";
import { filterEmpty, setProp } from "@/components/pro/helper";
import { useNamespace } from "@/composables";
import { useTableApi, useTableState } from "./composables";
import { Environment, TableSizeEnum } from "./helper";
import TableMain from "./table-main.vue";
import TableHead from "./table-head.vue";

import "./styles/index.scss";

defineOptions({ name: "ProTable" });

const props = withDefaults(defineProps<ProTableNamespace.Props>(), {
  columns: () => [],
  data: () => [],
  requestApi: undefined,
  defaultRequestParams: () => ({}),
  requestParams: () => ({}),
  initRequestParams: () => ({}),
  requestImmediate: true,
  beforeSearch: undefined,
  requestError: undefined,
  transformData: undefined,
  hideHead: false,
  controlHeadColumn: false,
  controlHeadColumnProps: () => ({}),
  card: false,
  rowStyle: () => ({}),
  cellStyle: () => ({}),
  headerCellStyle: () => ({}),
  border: false,
  stripe: false,
  headerBackground: true,
  highlightCurrentRow: true,
  showHeader: true,

  // TableHead 组件的 props（透传下去）
  toolButton: () => ["size", "export", "columnSetting", "baseSetting"],
  disabledToolButton: () => [],
  size: () => TableSizeEnum.Default,
  title: "",
  exportProps: undefined,
  tooltipProps: () => ({ placement: "top", effect: "light" }),
  sizeStyle: () => ({}),
  columnSetting: () => ({}),
  baseSetting: () => ({}),
  isSelected: undefined,
  selectedList: undefined,
  selectedListIds: undefined,

  // TableMain 组件的 props（透传下去）
  rowKey: "id",
  operationProp: "operation",
  operationProps: () => ({}),
  pageInfo: () => defaultPageInfo,
  pageScope: false,
  paginationProps: () => ({}),
  filterScope: false,
  editable: false,
  emptyText: "暂无数据",
  radioProps: () => ({}),
  selectedRadio: "",
});

const emits = defineEmits<ProTableNamespace.Emits>();

const ns = useNamespace("pro-table");

const hideHead = ref(false);
watchEffect(() => (hideHead.value = props.hideHead));

// 最终的 props
const finalProps = computed(() => {
  const propsObj = {
    ...props,
    columns:
      isRef(props.columns) || isReactive(props.columns)
        ? props.columns
        : (reactive(unref(props.columns)) as TableColumn[]),
  };
  Object.assign(propsObj, mergeProps.value);
  return propsObj;
});

const { mergeProps, setProps, setColumn, addColumn, delColumn } = useTableApi(finalProps);

const tableMainProps = computed(() => {
  // 过滤掉为 undefined 的配置项
  return filterEmpty({
    ...finalProps.value,
    // 去掉 TableHead 的配置项，确保所有的非 TableHead 的 props 都透传到 ElTable
    requestApi: undefined,
    initRequestParams: undefined,
    defaultRequestParams: undefined,
    requestImmediate: undefined,
    hideHead: undefined,
    card: undefined,
    toolButton: undefined,
    disabledToolButton: undefined,
    size: undefined,
    title: undefined,
    exportProps: undefined,
    tooltipProps: undefined,
    sizeStyle: undefined,
    columnSetting: undefined,
    baseSetting: undefined,
    isSelected: undefined,
    selectedList: undefined,
    selectedListIds: undefined,
  });
});

// 是否为服务器（后端）分页
const isServerPage = computed(() => {
  const { pageScope } = finalProps.value;
  // 如果传入 true，则为前端分页，返回 false
  if (!pageScope || pageScope === true) return false;
  return pageScope === Environment.Server;
});

const { tableData, pageInfo, searchParams, searchInitParams, getTableList, search, reset, handlePagination } =
  useTableState(
    finalProps.value.requestApi,
    computed(() => unref(finalProps.value.defaultRequestParams)),
    finalProps.value.pageInfo,
    isServerPage,
    finalProps.value.beforeSearch,
    finalProps.value.transformData,
    finalProps.value.requestError
  );

// 表格数据，传来的 data 大于 api 获取的数据
const finalTableData = computed(() => {
  const { data } = finalProps.value;

  if (data.length) return data;
  return tableData.value;
});

const { baseSetting } = useTableBaseSetting();
const { tableSize, finalSizeStyle, handleSizeChange } = useTableSize();
const {
  handleSelectionChange,
  handleRefresh,
  handlePaginationChange,
  handleDragSortEnd,
  handleFilter,
  handleFilterClear,
  handleFilterReset,
  handleFormChange,
  handleButtonClick,
  handleConfirm,
  handleCancel,
  handleLeaveCellEdit,
} = useTableEmits();

watchEffect(() => (searchParams.value = finalProps.value.requestParams));
watchEffect(() => (searchInitParams.value = finalProps.value.initRequestParams));

/**
 * 表格密度和样式初始化和获取
 */
function useTableSize() {
  // 表格密度
  const tableSize = ref<TableSizeEnum>((props.size as TableSizeEnum) || TableSizeEnum.Default);
  // 表格密度样式
  const currentSizeStyle = ref<SizeStyle>();

  // 最终的 sizeStyle，即将 ProTable 内置的 sizeStyle 和传入的 sizeStyle 合并
  const finalSizeStyle = computed(() => {
    const { rowStyle, cellStyle, headerCellStyle } = finalProps.value;
    return {
      rowStyle: { ...rowStyle, ...currentSizeStyle.value?.rowStyle },
      cellStyle: { ...cellStyle, ...currentSizeStyle.value?.cellStyle },
      headerCellStyle: {
        ...headerCellStyle,
        ...currentSizeStyle.value?.headerCellStyle,
        ...(!baseSetting.headerBackground && { backgroundColor: undefined }),
      },
    };
  });

  const handleSizeChange = (size: TableSizeEnum, style: SizeStyle) => {
    tableSize.value = size === TableSizeEnum.Mini ? TableSizeEnum.Default : size;
    currentSizeStyle.value = style;
    emits("sizeChange", size, style);
  };

  return { tableSize, finalSizeStyle, handleSizeChange };
}

/**
 * 表格基础设置初始化和获取
 */
function useTableBaseSetting() {
  // 表格全局设置
  const baseSetting = reactive({
    border: finalProps.value.border,
    stripe: finalProps.value.stripe,
    showHeader: finalProps.value.showHeader,
    headerBackground: finalProps.value.headerBackground,
    highlightCurrentRow: finalProps.value.highlightCurrentRow,
    ...finalProps.value.baseSetting,
  });

  watchEffect(() => (baseSetting.border = finalProps.value.border));
  watchEffect(() => (baseSetting.stripe = finalProps.value.stripe));

  return { baseSetting };
}

/**
 * 表格 emits 事件相关逻辑
 */
function useTableEmits() {
  /**
   * 单选或者多选框变化事件
   */
  const handleSelectionChange = (useSelectReturn: UnwrapRef<UseSelectState>, index?: number) => {
    emits("selectionChange", useSelectReturn, index);
  };

  /**
   * 点击刷新按钮事件
   */
  const handleRefresh = () => {
    getTableList();
    emits("refresh");
  };

  /**
   * 分页信息变化事件
   */
  const handlePaginationChange = (pageInfo: PageInfo) => {
    handlePagination(pageInfo);
    emits("paginationChange", pageInfo);
  };

  /**
   * 表格拖拽排序结束事件
   */
  const handleDragSortEnd = (newIndex: number, oldIndex: number) => {
    emits("dragSortEnd", newIndex, oldIndex);
  };

  /**
   * 执行列过滤搜索事件
   */
  const handleFilter = (filterModel: Recordable, filterValue: unknown, prop: string | undefined) => {
    emits("filter", filterModel, filterValue, prop);
  };
  /**
   * 执行列过滤清除事件
   */
  const handleFilterClear = (prop: string | undefined) => {
    emits("filterClear", prop);
  };
  /**
   * 执行列过滤重置事件
   */
  const handleFilterReset = () => {
    emits("filterReset");
  };

  /**
   * 表单值发生改变事件
   */
  const handleFormChange = (fromValue: unknown, prop: TableColumn["prop"] = "", scope: TableScope) => {
    const { data, requestApi } = props;
    // 如果是请求方式获取数据，则自动更新值
    if (!data.length && requestApi) setProp(tableData.value[scope.$index], prop, fromValue);

    emits("formChange", fromValue, prop, scope);
  };

  /**
   * 操作栏按钮点击事件
   */
  const handleButtonClick = (params: OperationNamespace.ButtonsCallBackParams) => {
    emits("buttonClick", params);
  };

  /**
   * 操作栏二次确认确定按钮触发事件
   */
  const handleConfirm = (params: OperationNamespace.ButtonsCallBackParams) => {
    emits("confirm", params);
  };

  /**
   * 操作栏二次确认取消按钮触发事件
   */
  const handleCancel = (params: OperationNamespace.ButtonsCallBackParams) => {
    emits("cancel", params);
  };

  /**
   * 单元格编辑态下点击非表格区域事件
   */
  const handleLeaveCellEdit = (row: TableRow, column: TableColumn) => {
    emits("leaveCellEdit", row, column);
  };

  return {
    handleSelectionChange,
    handleRefresh,
    handlePaginationChange,
    handleDragSortEnd,
    handleFilter,
    handleFilterClear,
    handleFilterReset,
    handleFormChange,
    handleButtonClick,
    handleConfirm,
    handleCancel,
    handleLeaveCellEdit,
  };
}

const tableHeadInstance = useTemplateRef<ProTableHeadInstance>("tableHeadInstance");
const tableMainInstance = useTemplateRef<ProTableMainInstance>("tableMainInstance");

onMounted(() => {
  // 初始化请求
  finalProps.value.requestImmediate && getTableList();
  // 注册实例
  emits("register", tableMainInstance.value?.$parent || null, tableMainInstance.value?.elTableInstance || null);
});

const getElTableInstance = () => tableMainInstance.value?.elTableInstance;
const getElFormInstance = () => tableMainInstance.value?.getElFormInstance;
const getElFormItemInstance = () => tableMainInstance.value?.getElFormItemInstance;
const getElInstance = () => tableMainInstance.value?.getElInstance;

const expose = {
  tableData: finalTableData,
  pageInfo,
  searchParams,
  searchInitParams,
  getTableList,
  search,
  reset,
  handlePagination,
  setProps,
  setColumn,
  addColumn,
  delColumn,

  tableHeadInstance,
  tableMainInstance,
  getElTableInstance,
  getElFormInstance,
  getElFormItemInstance,
  getElInstance,
};

defineExpose(expose);
</script>

<template>
  <div :class="[ns.b(), { [ns.join('card-minimal')]: card }]">
    <!-- 表格头部 -->
    <TableHead
      v-if="!hideHead"
      ref="tableHeadInstance"
      :columns="finalProps.columns"
      :data="finalTableData"
      :tool-button="finalProps.toolButton"
      :disabled-tool-button="finalProps.disabledToolButton"
      :size="finalProps.size"
      :title="finalProps.title"
      :export-props="finalProps.exportProps"
      :tooltip-props="finalProps.tooltipProps"
      :size-style="finalProps.sizeStyle"
      :column-setting="finalProps.columnSetting"
      :base-setting
      :is-selected="tableMainInstance?.isSelected"
      :selected-list="tableMainInstance?.selectedList"
      :selected-list-ids="tableMainInstance?.selectedListIds"
      :operation-prop="finalProps.operationProp"
      @refresh="handleRefresh"
      @size-change="handleSizeChange"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </TableHead>

    <!-- 表格主体 -->
    <TableMain
      ref="tableMainInstance"
      v-bind="{ ...$attrs, ...tableMainProps, ...finalSizeStyle, ...baseSetting }"
      :data="finalTableData"
      :page-info
      :size="tableSize"
      @button-click="handleButtonClick"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @selection-change="handleSelectionChange"
      @pagination-change="handlePaginationChange"
      @drag-sort-end="handleDragSortEnd"
      @form-change="handleFormChange"
      @filter="handleFilter"
      @filter-clear="handleFilterClear"
      @filter-reset="handleFilterReset"
      @leave-cell-edit="handleLeaveCellEdit"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>

      <template #append-column>
        <el-table-column v-if="controlHeadColumn" :width="45" v-bind="controlHeadColumnProps">
          <template #header>
            <el-button size="large" link :icon="Tools" @click="hideHead = !hideHead" />
          </template>
        </el-table-column>

        <slot name="append-column" />
      </template>
    </TableMain>
  </div>
</template>
