<script setup lang="ts">
import type { UnwrapRef } from "vue";
import type { TableInstance } from "element-plus";
import type { ProSearchColumnProps, ProSearchExpose } from "@/components/pro/search";
import type {
  ProTableInstance,
  OperationNamespace,
  SizeStyle,
  TableColumn,
  TableRow,
  TableScope,
  TableSizeEnum,
  UseSelectState,
} from "@/components/pro/table";
import type { PageColumn, ProPageEmits, ProPageProps } from "./types";
import type { PageInfo } from "../../pagination";
import { Search } from "@element-plus/icons-vue";
import { formatValue, type ElOption, type FormItemColumnProps } from "@/components/pro/form-item";
import { useNamespace } from "@/composables";
import { isEmpty, isFunction } from "@/utils";
import { ProSearch } from "@/components/pro/search";
import { filterEmpty, proFormOptionsMapKey } from "@/components/pro/form";
import { ProTable, lastProp, proTableOptionsMapKey } from "@/components/pro/table";

defineOptions({ name: "ProPage" });

const props = withDefaults(defineProps<ProPageProps>(), {
  columns: () => [],
  searchProps: () => ({}),
  initShowSearch: true,
  card: true,
  requestImmediate: true,
  toolButton: true,
  tooltipProps: () => ({ placement: "top", effect: "light" }),
  headerBackground: true,
  highlightCurrentRow: true,
  showHeader: true,
});

const emits = defineEmits<ProPageEmits>();

const ns = useNamespace("pro-page");
const proSearchInstance = useTemplateRef<ProSearchExpose>("proSearchInstance");
const proTableInstance = useTemplateRef<ProTableInstance>("proTableInstance");

// 定义 optionsMap 存储枚举值
const optionsMap = ref(new Map<string, MaybeRef<ElOption[]>>());

provide(proFormOptionsMapKey, optionsMap);
provide(proTableOptionsMapKey, optionsMap);

const searchParams = ref<Recordable>({});
const searchDefaultParams = ref<Recordable>({});

const initShowSearch = ref(true);

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

// 扁平化 columns，为了过滤搜索配置项
const flatColumnsFn = (columns: PageColumn[], flatArr: PageColumn[] = []) => {
  columns.forEach(col => {
    if (col.children?.length) flatArr.push(...flatColumnsFn(col.children));
    flatArr.push(col);
  });
  return flatArr.filter(item => !item.children?.length);
};

const flatColumns = computed(() => flatColumnsFn(props.columns));

// 组装 ProSearch 配置项
const searchColumns = computed(() => {
  const filterColumns = flatColumns.value.filter(item => item.search?.el || item.search?.renderEl);
  const searchColumns: ProSearchColumnProps[] = [];
  console.log(1);

  filterColumns.forEach(async column => {
    // Table 默认查询参数初始化
    const prop = lastProp(column.search?.prop ?? column.prop!);
    const defaultValue = unref(column.search?.defaultValue);

    if (!isEmpty(defaultValue)) {
      if (!isFunction(defaultValue)) setSearchParams(prop, defaultValue);
      else setSearchParams(prop, await defaultValue(searchParams.value, optionsMap.value));
    }

    // 组装搜索表单配置项
    const searchColumn = {
      ...column.search,
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
      optionField: column.optionField,
      optionsProp: column.optionsProp,
    };
    searchColumns.push(searchColumn);
  });

  return searchColumns;
});

watchEffect(() => (initShowSearch.value = toValue(props.initShowSearch)));

let timer: ReturnType<typeof setTimeout> | null = null;

watch(
  flatColumns,
  newValue => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    // 防抖：防止初始化时连续执行
    timer = setTimeout(() => {
      for (const column of newValue) initOptionsMap(column);
    }, 10);
  },
  { deep: true, immediate: true }
);

const setSearchParams = (prop: string, value: unknown) => {
  searchParams.value[prop] = value;
  searchDefaultParams.value[prop] = value;
};

/**
 * 初始化枚举字典数据
 */
const initOptionsMap = async (column: TableColumn) => {
  const { options, prop = "" } = column;
  if (!options) return;

  const optionsMapConst = optionsMap.value;

  // 如果当前 enumMap 存在相同的值则 return
  if (optionsMapConst.has(prop) && (isFunction(options) || optionsMapConst.get(prop) === options)) return;

  optionsMapConst.set(prop, []);

  // 处理 options 并存储到 optionsMap
  const value = await formatValue<FormItemColumnProps["options"]>(options, [optionsMapConst, prop], false);

  optionsMapConst.set(prop, (value as any)?.data || value);
};

// ---------- ProSearch 事件监听 ----------
const handleSearch = (model: Recordable) => {
  // ProSearch 已经自动清除空值，因此传入 false
  proTableInstance.value?.search(model, false);
  emits("search", model);
};
const handleReset = (model: Recordable) => {
  proTableInstance.value?.reset(model, false);
  emits("reset", model);
};

const searchRegister = (proSearchInstance?: ProSearchExpose) => {
  emits("searchRegister", proSearchInstance);
};

// ---------- ProTable 事件监听 ----------

const tableRegister = (proTableInstance: ProTableInstance, elTableInstance: TableInstance | null) => {
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
const handleFilter = (filterModel: Recordable, filterValue: unknown, prop: string | undefined) => {
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
  emits("filterReset");
};

const handleFormChange = (fromValue: unknown, prop: TableColumn["prop"], scope: TableScope) => {
  emits("formChange", fromValue, prop || "", scope);
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

const handleLeaveCellEdit = (row: TableRow, column: TableColumn) => {
  emits("leaveCellEdit", row, column);
};

const expose = {
  searchParams,
  searchDefaultParams,
  proSearchInstance,
  proTableInstance,
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
      v-bind="searchProps"
      @search="handleSearch"
      @reset="handleReset"
      @register="searchRegister"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </ProSearch>

    <ProTable
      ref="proTableInstance"
      v-bind="{ ...$attrs, ...proTableProps }"
      :request-params="searchParams"
      :init-request-params="searchDefaultParams"
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
      @register="tableRegister"
    >
      <template #head-right-after>
        <el-tooltip
          v-if="(toolButton === true || toolButton?.includes('search')) && columns.length"
          content="隐藏/展开搜索"
          v-bind="tooltipProps"
        >
          <el-button
            :disabled="disabledToolButton?.includes('search')"
            :icon="Search"
            @click="initShowSearch = !initShowSearch"
          />
        </el-tooltip>

        <slot name="head-right-after" />
      </template>

      <template v-for="slot in Object.keys($slots).filter(key => !key.includes('head-right-after'))" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </ProTable>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
