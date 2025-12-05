<script setup lang="ts">
import type { UnwrapRef } from "vue";
import type { TableInstance } from "element-plus";
import type { SearchColumn, ProSearchInstance } from "@/components/pro/search";
import type {
  ProTableInstance,
  OperationNamespace,
  SizeStyle,
  TableColumn,
  TableRow,
  TableScope,
  TableSizeEnum,
  UseSelectState,
  PageInfo,
} from "@/components/pro/table";
import type { ProPageEmits, ProPageProps } from "./types";
import { ref, computed, watchEffect, useTemplateRef, provide, toValue, unref, watch, useSlots } from "vue";
import { ElTooltip, ElButton } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { isEmpty, isFunction, isBoolean } from "@/common/utils";
import { useOptions, optionsMapKey } from "@/components/pro/use-options";
import { ProSearch } from "@/components/pro/search";
import { ProTable, defaultTooltipProps } from "@/components/pro/table";
import { filterEmpty, flatColumnsFn, setProp, lastProp } from "@/components/pro/helper";
import { useNamespace } from "@/composables";

defineOptions({ name: "ProPage" });

const props = withDefaults(defineProps<ProPageProps>(), {
  columns: () => [],
  searchProps: () => ({}),
  initShowSearch: true,
  defaultValues: () => ({}),

  // ProTable 组件的 Props
  card: true,
  requestImmediate: true,
  toolButton: true,
  headerBackground: true,
  highlightCurrentRow: true,
  showHeader: true,
  pageScope: true,
  tooltipProps: () => defaultTooltipProps,
});

const emits = defineEmits<ProPageEmits>();

const ns = useNamespace("pro-page");
const proSearchInstance = useTemplateRef<ProSearchInstance>("proSearchInstance");
const proTableInstance = useTemplateRef<ProTableInstance>("proTableInstance");

const slots = useSlots();

const searchSlots = computed(() =>
  Object.keys(slots)
    .filter(key => key.endsWith("-search"))
    .map(key => key.replace("-search", ""))
);

// 获取 ProTable 配置项
const proTableProps = computed(() => {
  const { columns, ...rest } = props;

  return {
    columns,
    ...filterEmpty(rest),
    searchProps: undefined,
    initShowSearch: undefined,
  };
});

const initShowSearch = ref(true);

watchEffect(() => (initShowSearch.value = toValue(props.initShowSearch)));

const { optionsMap, initOptionsMap } = useOptions();
const { flatColumns, searchParams, searchDefaultParams, searchColumns } = usePageSearchInit();

provide(optionsMapKey, optionsMap);

// 计算初始化查询参数
const initRequestParams = computed(() => ({ ...searchDefaultParams.value, ...props.initRequestParams }));

/**
 *  页面搜索数据初始化
 */
function usePageSearchInit() {
  const searchParams = ref<Recordable>({});
  const searchDefaultParams = ref<Recordable>({});

  // 定时器
  let timer: ReturnType<typeof setTimeout> | null = null;

  // 扁平化 columns，为了过滤搜索配置项
  const flatColumns = computed(() => flatColumnsFn(props.columns));

  // 组装 ProSearch 配置项
  const searchColumns = computed(() => {
    const filterColumns = flatColumns.value.filter(item => item.search);
    const searchColumns: SearchColumn[] = [];

    filterColumns.forEach(async column => {
      // Table 默认查询参数初始化
      const prop = lastProp(column.search?.prop ?? column.prop ?? "");
      const defaultValue = unref(column.search?.defaultValue) ?? props.defaultValues[prop];

      if (!isEmpty(defaultValue)) {
        if (!isFunction(defaultValue)) setSearchParams(prop, defaultValue);
        else {
          setSearchParams(prop, await defaultValue({ model: searchParams.value, optionsMap: optionsMap.value, prop }));
        }
      }

      // 组装搜索表单配置项
      const searchColumn: SearchColumn = {
        ...column.search,
        el: column.search?.el || ((column.search?.options ?? column.options) ? "ElSelect" : "ElInput"),
        grid: {
          offset: column.search?.offset,
          span: column.search?.span,
          xs: column.search?.xs,
          sm: column.search?.sm,
          md: column.search?.md,
          lg: column.search?.lg,
          xl: column.search?.xl,
          ...column.search?.grid,
        },
        prop,
        label: column.search?.label ?? column.label,
        beforeSearch: undefined,
        options: undefined, // proPage 已经处理 options，无需传给 ProForm 再次处理
        optionField: column.search?.optionField || column.optionField,
        optionsProp:
          column.search?.optionsProp ?? column.optionsProp ?? (column.search?.prop && lastProp(column.search.prop)),
      };
      searchColumns.push(searchColumn);
    });

    return searchColumns;
  });

  // 搜索表单初始化参数
  const setSearchParams = (prop: string, value: unknown) => {
    searchParams.value[prop] = value;
    searchDefaultParams.value[prop] = value;
  };

  watch(
    flatColumns,
    newValue => {
      // 防抖：防止初始化时连续执行
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      timer = setTimeout(async () => {
        for (const column of newValue)
          initOptionsMap(column.search?.options ?? column.options, column.search?.prop || column.prop || "");
      }, 1);
    },
    { deep: true, immediate: true }
  );

  return { flatColumns, searchParams, searchDefaultParams, searchColumns };
}

// ---------- ProSearch 事件监听 ----------

const handleSearch = (searchModel: Recordable) => {
  const newSearchModel = { ...searchModel };

  // 触发每个配置项的 beforeSearch
  for (const column of flatColumns.value) {
    if (!column.search?.beforeSearch) continue;

    const prop = lastProp(column.search?.prop ?? column.prop ?? "");
    const newSearchValue = column.search?.beforeSearch(newSearchModel[prop], newSearchModel, column);

    // 如果返回 false，则不执行查询
    if (newSearchValue === false) return;

    newSearchValue && setProp(newSearchModel, prop, newSearchValue);
  }

  // ProSearch 已经自动清除空值，因此传入 false
  proTableInstance.value?.search(newSearchModel, false);
  emits("search", newSearchModel);
};
const handleReset = (searchModel: Recordable) => {
  proTableInstance.value?.reset(searchModel, false);
  emits("reset", searchModel);
};

const handleSearchRegister = (proSearchInstance: ProSearchInstance | null) => {
  emits("searchRegister", proSearchInstance);
};

// ---------- ProTable 事件监听 ----------

const handleTableRegister = (proTableInstance: ProTableInstance | null, elTableInstance: TableInstance | null) => {
  emits("tableRegister", proTableInstance, elTableInstance);
};

const handleSelectionChange = (useSelectReturn: UnwrapRef<UseSelectState>, index?: number) => {
  emits("selectionChange", useSelectReturn, index);
};

const handleSizeChange = (size: TableSizeEnum, style: SizeStyle) => {
  emits("sizeChange", size, style);
};

const handlePaginationChange = (pageInfo: PageInfo) => {
  emits("paginationChange", pageInfo);
};

const handleDragSortEnd = (newIndex: number, oldIndex: number) => {
  emits("dragSortEnd", newIndex, oldIndex);
};

/**
 * 执行过滤搜索
 */
const handleFilter = (filterModel: Recordable, filterValue: unknown, prop: string) => {
  emits("filter", filterModel, filterValue, prop);
};
/**
 * 执行过滤清除
 */
const handleFilterClear = (prop: string) => {
  emits("filterClear", prop);
};
/**
 * 执行过滤重置
 */
const handleFilterReset = () => {
  emits("filterReset");
};

const handleFormChange = (fromValue: unknown, prop: TableColumn["prop"], scope: TableScope) => {
  emits("formChange", fromValue, prop || "", scope);
};

const handleButtonClick = (params: OperationNamespace.ButtonsCallBackParams) => {
  emits("buttonClick", params);
};

const handleConfirm = (params: OperationNamespace.ButtonsCallBackParams) => {
  emits("buttonConfirm", params);
};

const handleCancel = (params: OperationNamespace.ButtonsCallBackParams) => {
  emits("buttonCancel", params);
};

const handleLeaveCellEdit = (row: TableRow, column: TableColumn) => {
  emits("leaveCellEdit", row, column);
};

const expose = {
  searchParams,
  searchDefaultParams,
  proSearchInstance,
  proTableInstance,

  // 在这里添加暴露常用方法，也可以直接通过 proSearchInstance、proTableInstance 获取实例对象调用方法
  search: () => proSearchInstance.value?.search(),
  reset: () => proSearchInstance.value?.reset(),
  toggleCollapse: () => proSearchInstance.value?.toggleCollapse(),
  getTableData: () => proTableInstance.value?.tableData,
  getPageInfo: () => proTableInstance.value?.pageInfo,
  setSearchParams: (params: Recordable) => {
    Object.entries(params).forEach(([key, value]) => {
      setProp(searchParams.value, key, value);
    });
  },
  clearSearchParams: () => (searchParams.value = {}),
  clearSelection: () => proTableInstance.value?.tableMainInstance?.clearSelection(),
};

defineExpose(expose);
</script>

<template>
  <div :class="ns.b()">
    <ProSearch
      ref="proSearchInstance"
      v-show="initShowSearch"
      v-model="searchParams"
      :columns="searchColumns"
      :card
      v-bind="searchProps"
      @search="handleSearch"
      @reset="handleReset"
      @register="handleSearchRegister"
    >
      <template v-if="$slots['action']" #action="scope">
        <slot name="action" v-bind="scope" />
      </template>

      <template v-for="slot in searchSlots" #[slot]="scope">
        <slot :name="`${slot}-search`" v-bind="scope" />
      </template>
    </ProSearch>

    <ProTable
      ref="proTableInstance"
      v-bind="{ ...$attrs, ...proTableProps }"
      :request-params="searchParams"
      :init-request-params="initRequestParams"
      @selection-change="handleSelectionChange"
      @size-change="handleSizeChange"
      @pagination-change="handlePaginationChange"
      @drag-sort-end="handleDragSortEnd"
      @filter="handleFilter"
      @filter-clear="handleFilterClear"
      @filter-reset="handleFilterReset"
      @form-change="handleFormChange"
      @button-click="handleButtonClick"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @leave-cell-edit="handleLeaveCellEdit"
      @register="handleTableRegister"
    >
      <template #head-tool-after>
        <el-tooltip
          v-if="(toolButton === true || (!isBoolean(toolButton) && toolButton?.includes('search'))) && columns.length"
          content="隐藏/展开搜索"
          v-bind="tooltipProps"
        >
          <el-button
            :disabled="disabledToolButton?.includes('search')"
            :icon="Search"
            @click="initShowSearch = !initShowSearch"
            class="head__tool-button"
          />
        </el-tooltip>

        <slot name="head-tool-after" />
      </template>

      <template v-for="slot in Object.keys($slots).filter(key => !['head-tool-after'].includes(key))" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </ProTable>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
