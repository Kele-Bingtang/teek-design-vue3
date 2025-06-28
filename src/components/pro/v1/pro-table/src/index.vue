<script setup lang="ts">
import {
  ref,
  watch,
  provide,
  onMounted,
  computed,
  useAttrs,
  unref,
  type CSSProperties,
  type ComponentPublicInstance,
  isReactive,
  reactive,
} from "vue";
import { useTable, type Table } from "./hooks/use-table";
import { useSelection } from "./hooks/use-selection";
import { Pagination } from "@/components/pro/pagination";
import { type BreakPoint } from "@/components/pro/grid";
import { type ProFormInstance, setProp } from "@/components/pro/v1/pro-form";
import {
  ProSearch,
  type ProSearchInstance,
  type ProSearchExpose,
  type ProSearchProps,
  type ProSearchSchemaProps,
} from "@/components/pro/v1/pro-search";
import {
  type TableColumnProps,
  type DialogFormInstance,
  type TypeProps,
  TableSizeEnum,
  type ToolButton,
  type TableSetProps,
  proTablePrefixClassKey,
  tableEnumMapKey,
  dialogFormInstanceKey,
  filterKey,
  type FilterRule,
  editKey,
} from "./interface";
import { filterEnum, filterEnumLabel, handleRowAccordingToProp, lastProp, frontFilter, exportExcel } from "./helper";
import ColSetting from "./components/col-setting.vue";
import TableMain from "./components/table-main.vue";
import TableMainHeader, { type CustomTableSize, type ElTableSize } from "./components/table-main-header.vue";
import DialogFormComponent, { type DialogFormProps } from "./components/dialog-form.vue";
import Sortable from "sortablejs";
import { useNamespace } from "@/composables";
import { type FormInstance, type TableInstance, type TableProps } from "element-plus";

defineOptions({ name: "ProTable" });

const ns = useNamespace("pro-table");
const prefixClass = ns.b();

provide(proTablePrefixClassKey, prefixClass);

export type DialogForm = DialogFormProps;

export interface ProTableProps extends /* @vue-ignore */ Partial<Omit<TableProps<any>, "data" | "size">> {
  columns?: TableColumnProps[]; // 列配置项 ==> 必传
  data?: any[]; // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
  requestApi?: (params: any) => Promise<any>; // 请求表格数据的 api ==> 非必传
  requestAuto?: boolean; // 是否自动执行请求 api ==> 非必传（默认为 true）
  requestError?: (params: any) => void; // 表格 api 请求错误监听 ==> 非必传
  beforeSearch?: (data: any) => any; // 查询数据前的回调函数，可以对查询参数进行处理或禁止查询 ==> 非必传
  dataCallback?: (data: any) => any; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  exportFile?: (data: Record<string, any>[], searchParam: Record<string, any>) => void;
  initRequestParam?: any; // 初始化请求参数 ==> 非必传（默认为{}）
  title?: string; // 表格标题，目前只在打印的时候用到 ==> 非必传
  pagination?: boolean | Table.PaginationProps; // 是否需要分页组件 ==> 非必传（默认为 true）
  border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为 true）
  useToolButton?: ToolButton[] | boolean; // 是否显示表格功能按钮 ==> 非必传（默认为 true）
  disabledButton?: ToolButton[]; // 指定禁用的表格功能按钮 ==> 非必传
  rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  size?: CustomTableSize; // 表格密度
  pageConfig?: Partial<Table.PageInfo>; // 分页信息
  exportKey?: "label" | "prop" | "dataKey"; // 导出时的表头配置（prop 为使用  columns 的 prop，label 为使用 columns 的 label，dataKey 为使用 data 的 key），默认为 dataKey
  initShowSearch?: boolean; // 初始化时是否显示搜索模块
  searchCols?: number | Record<BreakPoint, number>; // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
  searchProps?: Omit<ProSearchProps, "schema" | "searchCols" | "modeValue">; // ProSearch 配置项
  // 搜索模式，search 使用 ProSearch 组件，filter 开启表格筛选功能，useFilter 启用所有表格筛选功能，不管也没有配置 search。all 两个都使用。allAndUseFilter 两个都使用的同时，默认启用所有表格筛选功能
  searchModel?: "search" | "filter" | "useFilter" | "all" | "allAndUseFilter";
  filterRule?: "front" | "back"; // 过滤规则：前端筛选还是后端筛选，默认后端筛选
  filterAllData?: boolean; // 是否基于全部数据还是当前表格数据过滤（如分页），true 则基于全部数据，false 则基于当前表格数据
  editRow?: number; // 允许最大编辑的行数，默认 undefined，没有限制
  rowClickEdit?: boolean; // 单击行激活行内编辑
  dialogForm?: DialogFormProps; // 新增、编辑、删除表单配置
  useCardStyle?: boolean; // 是否使用卡片样式
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  requestAuto: true,
  pagination: true,
  initRequestParam: {},
  border: true,
  useToolButton: true,
  rowKey: "id",
  size: "default",
  initShowSearch: true,
  exportKey: "label",
  searchCols: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
  searchModel: "search",
  filterRule: "front",
  rowClickEdit: false,
  filterAllData: true,
  useCardStyle: true,
});

// 表格 DOM 元素
const tableMainInstance = useTemplateRef<InstanceType<typeof TableMain>>("tableMainInstance");
const proSearchInstance = useTemplateRef<ProSearchInstance>("proSearchInstance");

// column 列类型
const columnTypes: TypeProps[] = ["selection", "radio", "index", "expand", "sort"];

const mergeProps = ref<ProTableProps>({});

const getProps = computed(() => {
  // 将 columns 转为响应式对象
  const propsObj = { ...props, columns: isReactive(props.columns) ? props.columns : reactive(props.columns) };
  Object.assign(propsObj, mergeProps.value);
  return propsObj;
});

// 表格多选 Hooks
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(getProps.value.rowKey);

// 表格操作 Hooks
const {
  tableData,
  paging,
  searchParam,
  searchInitParam,
  getTableList,
  search,
  reset,
  handlePagination,
  isOpenPage,
  isBackPage,
  isFrontPage,
} = useTable(
  getProps.value.requestApi,
  getProps.value.initRequestParam,
  getProps.value.pagination,
  getProps.value.pageConfig,
  getProps.value.beforeSearch,
  data => {
    if (!data) return;
    // 配置 _enum 字典信息
    if (isBackPage()) data.list = enumCallback(data.list) || data.list;
    else data = enumCallback(data) || data;
    const { dataCallback } = getProps.value;
    dataCallback && (data = dataCallback(data) || data);
    return data;
  },
  getProps.value.requestError,
  getProps.value.columns
);

// 配置 _enum 字典信息
const enumCallback = (data: Record<string, any>[]) => {
  getProps.value.columns.forEach(async col => {
    const enumObj = enumMap.value.get(col.prop!);
    // 如果字段有配置枚举信息，则存放到 _enum[col.prop] 里
    if (enumObj && col.isFilterEnum) {
      data = data?.map(row => {
        const d = filterEnumLabel(
          filterEnum(handleRowAccordingToProp(row, col.prop!), enumObj, col.fieldNames),
          col.fieldNames
        );
        if (!row._enum) row._enum = {};
        row._enum[col.prop!] = d;
        return row;
      });
    }
  });
  return data;
};

// 表格所有数据
const allTableData = computed(() => {
  const { data } = getProps.value;
  if (data?.length) return data;
  return tableData.value;
});

// 表格实际渲染的数据
const currentTableData = computed(() => {
  const { pagination } = getProps.value;
  const { pageNum, pageSize } = paging.value;

  const tableDataConst = allTableData.value;
  if (!isFrontPage(pagination)) return tableDataConst;

  return tableDataConst?.slice((pageNum - 1) * pageSize, pageNum * pageSize);
});

const pageTotal = computed(() => {
  const { data, pagination } = getProps.value;

  if (data?.length) return data?.length;
  if (isFrontPage(pagination)) return data?.length || tableData.value?.length;
  if (isBackPage(pagination)) return paging.value?.total || tableData.value?.length;
  return 0;
});

// 初始化请求
onMounted(() => {
  dragSort();
  getProps.value.requestAuto && getTableList();
});

// 监听页面 initRequestParam 改化，重新获取表格数据
watch(
  () => [mergeProps.value.initRequestParam, props.initRequestParam],
  () => getTableList(getProps.value.initRequestParam),
  { deep: true }
);

// ------- 字典处理 -------
// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, Record<string, any>[]>());
const setEnumMap = async ({ enum: enumValue, prop, search: { key } = {} }: TableColumnProps) => {
  if (!enumValue) return;

  const enumMapConst = enumMap.value;

  // 如果当前 enumMap 存在相同的值 return & 开启缓存功能
  if (enumMapConst.has(prop!) && (typeof enumValue === "function" || enumMapConst.get(prop!) === enumValue)) return;

  // 当前 enum 为静态数据，则直接存储到 enumMap
  if (typeof enumValue !== "function") {
    key && enumMapConst.set(key, unref(enumValue!));
    return enumMapConst.set(prop!, unref(enumValue!));
  }

  // 为了防止接口执行慢，而存储慢，导致重复请求，所以预先存储为[]，接口返回后再二次存储
  enumMapConst.set(prop!, []);

  // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  const { data } = await enumValue(enumMapConst);

  key && enumMapConst.set(key, data);
  enumMapConst.set(prop!, data);
};
provide(tableEnumMapKey, enumMap);

// ------- 初始化搜索配置项 -------
// 扁平化 columns，为了过滤需要搜索的配置项
const flatColumnsFunc = (columns: TableColumnProps[], flatArr: TableColumnProps[] = []) => {
  columns.forEach(async col => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children));
    flatArr.push(col);

    // 给每一项 column 添加 isShow && isFilterEnum 默认属性
    col.isShow = col.isShow ?? true;
    col.isFilterEnum = col.isFilterEnum ?? true;

    // 设置 enumMap
    setEnumMap(col);
  });
  return flatArr.filter(item => !item._children?.length);
};

const flatColumns = computed<TableColumnProps[]>(() => flatColumnsFunc(getProps.value.columns));

// 过滤需要搜索的配置项 & 组装搜索表单配置项
const searchColumns = computed(() => {
  const column = flatColumns.value?.filter(item => item.search?.el || item.search?.render);

  const searchColumns: ProSearchSchemaProps[] = [];

  column?.forEach(async item => {
    // Table 默认查询参数初始化
    const key = item.search?.key ?? lastProp(item.prop!);
    const defaultValue = unref(item.search?.defaultValue);
    if (defaultValue !== undefined && defaultValue !== null) {
      if (typeof defaultValue !== "function") searchInitParam.value[key] = defaultValue;
      else searchInitParam.value[key] = await defaultValue(searchParam.value, enumMap.value);
    }

    // 组装搜索表单配置项
    const searchColumn: any = {
      ...item.search,
      key: undefined,
      beforeSearch: undefined,
      grid: {
        offset: item.search?.offset,
        span: item.search?.span,
        xs: item.search?.xs,
        sm: item.search?.sm,
        md: item.search?.md,
        lg: item.search?.lg,
        xl: item.search?.xl,
      },
      label: item.label || "",
      prop: key,
      enum: item.enum as any,
      useEnumMap: item.useEnumMap,
      enumKey: item.enumKey,
      fieldNames: item.fieldNames,
    };
    searchColumns.push(searchColumn);
  });

  return searchColumns;
});

// ------- 表格过滤器功能 -------
const filterTableData = ref<any[]>();

// 原始数据发生改变，则清除过滤数据
watch(currentTableData, () => (filterTableData.value = undefined));

// 统计过滤规则
const columnFilterRule = computed(() => {
  // key 为 prop，value 为过滤规则
  const filterRule: Record<string, FilterRule> = {};
  getProps.value.columns.forEach(item => {
    if (item.renderUseProp?.length) {
      item.renderUseProp.forEach(prop => {
        filterRule[prop] = item.filterConfig?.rule;
      });
    } else filterRule[item.prop!] = item.filterConfig?.rule;
  });
  return filterRule;
});

const filterProps = reactive({
  searchParam,
  filter: ["filter", "useFilter", "all", "allAndUseFilter"].includes(getProps.value.searchModel!),
  useFilter: ["useFilter", "allAndUseFilter"].includes(getProps.value.searchModel!),
  search: (searchParam: Record<string, any>) => {
    // 后端过滤
    if (getProps.value.filterRule === "back") return search(searchParam, getProps.value.searchProps?.removeNoValue);

    // 前端过滤
    const data = getProps.value.filterAllData ? allTableData.value : currentTableData.value;
    const filterData = frontFilter(searchParam, data, columnFilterRule.value);
    const { pageNum, pageSize } = paging.value;

    filterTableData.value = filterData.slice((pageNum - 1) * pageSize, pageNum * pageSize);
  },
  reset: () => {
    filterTableData.value = undefined;
    reset();
  },
});
// TableColumn 使用
provide(filterKey, filterProps);

// ------- 行内编辑功能 -------
const editModelList = ref(new Map<string | number, Record<string, any>>());
provide(editKey, {
  editModelList,
  rowKey: getProps.value.rowKey,
  editRow: getProps.value.editRow,
});

// 获取行内编辑指定的 model
const getEditModel = (key: string | number) => {
  return editModelList.value.get(key);
};

// 获取行内编辑所有的 model
const getEditModelValues = () => {
  return [...editModelList.value.values()];
};

// 获取行内编辑所有 model 对应的 key
const getEditModelKeys = () => {
  return [...editModelList.value.keys()];
};

// 设置行内编辑的 model
const setEditModel = (key: string | number, model: Record<string, any>) => {
  editModelList.value.set(key, model);
};

// 清除行内编辑的 model
const clearEditModel = () => {
  editModelList.value = new Map<string, Record<string, any>>();
};

// 删除行内编辑指定 key 的 model
const removeEditModel = (key: string | number | string[] | number[]) => {
  if (Array.isArray(key)) {
    return key.forEach(i => {
      editModelList.value.delete(i);
    });
  }
  return editModelList.value.delete(key);
};

// ------- 列设置 ==> 过滤掉不需要设置的列 -------
const colSettingVisible = ref(false);
const colSetting = computed(() =>
  getProps.value.columns
    ?.filter(item => !columnTypes.includes(item.type!) && item.prop !== "operation")
    .map(item => {
      // 初始化 filter 过滤器
      !item.filterConfig ? (item.filterConfig = {}) : undefined;
      if (filterProps.filter && filterProps.useFilter && item.filterConfig.enabled !== false) {
        item.filterConfig.enabled = true;
      }
      return item;
    })
);

const toggleColSetting = (show = !colSettingVisible.value) => (colSettingVisible.value = show);

// 导出事件
const handleExport = () => {
  const { data, exportFile, columns, exportKey } = getProps.value;

  const d = data ?? tableData.value;
  if (exportFile) return exportFile(d, searchParam.value);

  exportExcel(columns, d, "export", exportKey, "确认导出数据?");
};

// ------- 按钮点击事件 -------
const dialogFormInstance = useTemplateRef<DialogFormInstance>("dialogFormInstance");
provide(dialogFormInstanceKey, dialogFormInstance);

// 编辑事件
const handleEdit = (scope: any, item: TableColumnProps) => {
  if (item.handleEdit) return item.handleEdit(scope, expose);

  dialogFormInstance.value?.handleEdit(scope.row);
};

// 删除事件
const handleRemove = (scope: any, item: TableColumnProps) => {
  if (item.handleRemove) item.handleRemove(scope, expose);
  dialogFormInstance.value?.handleRemove(scope.row);
};

// 批量删除事件
const handleRemoveBatch = () => {
  dialogFormInstance.value?.handleRemoveBatch(selectedListIds.value, selectedList.value, () => {
    clearSelection();
    getTableList();
  });
};

// ------- 表格样式 -------
// 如果是 mini，则取 ElTableSize 为 default，反之默认
const elTableSize = computed(() => (getProps.value.size === TableSizeEnum.Mini ? "default" : getProps.value.size));
const rowStyle = ref<CSSProperties>({});
const cellStyle = ref<CSSProperties>({});
const headerCellStyle = ref<CSSProperties>({});
const attrs = useAttrs();

const handleSizeCommand = (size: ElTableSize, row: CSSProperties, cell: CSSProperties, headerCell: CSSProperties) => {
  setProps({ size });
  rowStyle.value = row;
  cellStyle.value = cell;
  headerCellStyle.value = headerCell;
};

// 获取父组件的样式 & ProTable 内置表格样式
const getStyle = (tableInfo: any, styleName: string[], styleRef: any) => {
  const style = attrs[styleName[0]] || (attrs[styleName[1]] as CSSProperties | ((tableInfo: any) => CSSProperties));

  // 判断父组件也没有传入 ElTable 的自定义样式
  if (!style) return styleRef;
  if (typeof style === "function") return { ...styleRef, ...style(tableInfo) };
  else return { ...style, ...styleRef };
};

// 获取行样式
const getRowStyle = (tableInfo: any) => {
  return getStyle(tableInfo, ["rowStyle", "row-style"], rowStyle.value);
};

// 获取单元格样式
const getCellStyle = (tableInfo: any) => {
  return getStyle(tableInfo, ["cellStyle", "cell-style"], cellStyle.value);
};

// 获取表头样式
const getHeaderCellStyle = (tableInfo: any) => {
  return getStyle(tableInfo, ["headerCellStyle", "header-cell-style"], headerCellStyle.value);
};

// 清空选中数据列表
const clearSelection = () => tableMainInstance.value?.table?.clearSelection();

// ------- Emits 事件 -------
type ProTableEmits = {
  register: [
    proTableRef: ComponentPublicInstance | null | any,
    elTableRef: TableInstance | null,
    proSearch: ProSearchInstance | null,
  ];
  formRegister: [proFormRef?: ComponentPublicInstance | null | any, elFormRef?: FormInstance];
  searchRegister: [proFormRef?: ProSearchExpose];
  search: [model: Record<string, any>];
  reset: [model: Record<string, any>];
  dargSort: [{ newIndex?: number; oldIndex?: number }];
};

/**
 * 将 ProTableEmits 类型的 key 变为 on{key} 的形式
 * @example 返回 ['onRegister', 'onFormRegister' ...]
 */
export type ProTableOnEmits = keyOnPrefix<ProTableEmits>;

// 定义 emit 事件
const emits = defineEmits<ProTableEmits>();

const formRegister = (ref?: ProFormInstance, elRef?: FormInstance) => {
  emits("formRegister", ref, elRef);
};

const searchRegister = (ref?: ProSearchExpose) => {
  emits("searchRegister", ref);
};

onMounted(() => {
  // 注册实例
  emits("register", tableMainInstance.value?.$parent, tableMainInstance.value?.table || null, proSearchInstance.value);
});

const _search = (model: Record<string, any>) => {
  // ProSearch 已经自动清除空值，因此传入 false
  search(model, false);
  emits("search", model);
};

const _reset = (model: Record<string, any>) => {
  reset(model, false);
  emits("reset", model);
};

// 拖拽排序
const dragSort = () => {
  const tbody = document.querySelector(`.${ns.elNamespace}-table__body-wrapper tbody`) as HTMLElement;
  tbody &&
    Sortable.create(tbody, {
      handle: ".move",
      animation: 300,
      onEnd({ newIndex, oldIndex }) {
        if (typeof oldIndex !== "undefined" && typeof newIndex !== "undefined") {
          const [removedItem] = currentTableData.value.splice(oldIndex!, 1);
          currentTableData.value.splice(newIndex!, 0, removedItem);
          emits("dargSort", { newIndex, oldIndex });
        }
      },
    });
};

// ------- 动态操作 ProTable 函数 -------
// 设置 proTable 组件的 props
const setProps = (props: ProTableProps = {}) => {
  mergeProps.value = Object.assign(unref(mergeProps), props);
};

// 修改 Column
const setColumn = (columnSet: TableSetProps[], columnsChildren?: TableColumnProps[]) => {
  const { columns } = getProps.value;
  for (const column of columnsChildren || columns) {
    for (const item of columnSet) {
      if (column.prop === item.prop) {
        setProp(column, item.field, item.value);
      } else if (column._children?.length) {
        setColumn(columnSet, column._children);
      }
    }
  }
};

// 添加 Column
const addColumn = (column: TableColumnProps, prop?: number | string, position: "before" | "after" = "after") => {
  const { columns } = getProps.value;
  if (Object.prototype.toString.call(prop) === "[object String]") {
    return columns.forEach((column, i) => {
      if (column.prop === prop) position === "after" ? columns.splice(i + 1, 0, column) : columns.splice(i, 0, column);
    });
  }
  if (prop !== undefined) return columns.splice(prop as number, 0, column);
  return columns.push(column);
};

// 删除 Column
const delColumn = (prop: string) => {
  const { columns } = getProps.value;
  const index = columns.findIndex(item => item.prop === prop);
  if (index > -1) columns.splice(index, 1);
};

// 暴露给父组件的参数和方法(外部需要什么，都可以从这里暴露出去)
const expose = {
  element: tableMainInstance.value?.table,
  searchEl: proSearchInstance,
  dialogFormEl: dialogFormInstance,
  tableData,
  paging,
  searchParam,
  searchInitParam,
  enumMap,
  isSelected,
  selectedList,
  selectedListIds,
  editModelList,
  toggleColSetting,
  getTableList,
  search,
  reset,
  handlePagination,
  clearSelection,
  getEditModel,
  getEditModelValues,
  getEditModelKeys,
  setEditModel,
  clearEditModel,
  removeEditModel,
  setProps,
  setColumn,
  addColumn,
  delColumn,
};

defineExpose(expose);
</script>

<template>
  <div :class="prefixClass">
    <!-- 查询表单 card -->
    <ProSearch
      ref="proSearchInstance"
      v-if="['search', 'all', 'allAndUseFilter'].includes(getProps.searchModel!)"
      v-show="getProps.initShowSearch"
      v-model="searchParam"
      :schema="searchColumns"
      :search-cols="getProps.searchCols"
      v-bind="{ ...getProps.searchProps }"
      @search="_search"
      @reset="_reset"
      @register="searchRegister"
      :enum-map-props="enumMap"
    />

    <div :class="[{ 'tk-card': useCardStyle }, `${prefixClass}__main`]">
      <!-- 表格头部 操作按钮 -->
      <TableMainHeader
        :columns="getProps.columns"
        :useToolButton="getProps.useToolButton"
        :disabledButton="getProps.disabledButton"
        :size="getProps.size"
        :showSearch="searchColumns ? searchColumns.length > 0 : false"
        :selectedList="selectedList"
        :selectedListIds="selectedListIds"
        :isSelected="isSelected"
        :dialogForm="getProps.dialogForm"
        @add="dialogFormInstance?.handleAdd"
        @removeBatch="handleRemoveBatch"
        @refresh="getTableList"
        @size="handleSizeCommand"
        @colSetting="toggleColSetting"
        @export="handleExport"
        @search="() => setProps({ initShowSearch: !getProps.initShowSearch })"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </TableMainHeader>

      <!-- 表格主体 -->
      <TableMain
        ref="tableMainInstance"
        v-bind="$attrs"
        :data="filterTableData ? filterTableData : currentTableData"
        :size="elTableSize"
        :border="getProps.border"
        :row-key="getProps.rowKey"
        @selection-change="selectionChange"
        :row-style="getRowStyle"
        :cell-style="getCellStyle"
        :header-cell-style="getHeaderCellStyle"
        :columns="getProps.columns"
        :columnTypes="columnTypes"
        :rowClickEdit="rowClickEdit"
        :dialogForm="getProps.dialogForm"
        @edit="handleEdit"
        @remove="handleRemove"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </TableMain>

      <!-- Dialog 表单 -->
      <DialogFormComponent
        ref="dialogFormInstance"
        v-if="getProps.dialogForm"
        v-bind="{
          ...(getProps.dialogForm || { formProps: {}, dialog: {} }),
          afterConfirm: (status, result) => {
            getTableList();
            getProps.dialogForm?.afterConfirm && getProps.dialogForm.afterConfirm(status, result);
          },
        }"
        @register="formRegister"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </DialogFormComponent>

      <!-- 表格分页 -->
      <slot name="pagination" :total="pageTotal">
        <Pagination
          v-if="isOpenPage(pagination) && pageTotal"
          v-model="paging"
          :total="pageTotal"
          @change="handlePagination"
        />
      </slot>
    </div>
    <!-- 列设置 -->
    <ColSetting v-if="getProps.useToolButton" v-model="colSettingVisible" v-model:col-setting="colSetting" />
  </div>
</template>

<style lang="scss">
@use "./index";
</style>
