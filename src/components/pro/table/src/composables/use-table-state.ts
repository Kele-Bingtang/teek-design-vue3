import type { ApiResponse, PageInfo, UseTableStateData, UseTableStateOptions } from "../types";
import { reactive, computed, toRefs, toValue, watch, unref, readonly, ref, onMounted } from "vue";
import { defaultPaginationInfo } from "@/components/pro/pagination";
import { isArray, isEmpty, isNumber, isObject } from "@/common/utils";

export const defaultTablePageInfo = { ...defaultPaginationInfo, total: 0 } as PageInfo;

/**
 * table 页面操作方法封装
 *
 * @param options 配置项
 */
export const useTableState = <T extends Recordable = Recordable, P extends Recordable = Recordable, R = any>(
  options: UseTableStateOptions<T, P, R>
) => {
  const {
    api,
    apiParams,
    pageInfo,
    isServerPage,
    beforeSearch,
    transformData,
    requestError,
    pageField,
    immediate = true,
  } = options;

  const state = reactive<UseTableStateData>({
    // 表格数据
    tableData: [],
    // 分页数据
    pageInfo: { ...defaultTablePageInfo, ...unref(pageInfo) },
    // 查询参数（只包括查询）
    searchParams: {},
    // 初始化默认的查询参数，重置时候用到
    searchInitParams: {},
    // 总参数（包含分页和查询参数)
    totalParams: {},
  });

  const loading = ref(false);

  const pageFieldState = computed(() => {
    return {
      pageNum: pageField?.pageNum ?? "pageNum",
      pageSize: pageField?.pageSize ?? "pageSize",
      pageSizes: pageField?.pageSizes ?? "pageSizes",
      total: pageField?.total ?? "total",
    };
  });

  // 分页查询参数（只包括分页和表格字段排序，其他排序方式可自行配置）
  const pageParams = computed(() => {
    return {
      [pageFieldState.value.pageNum]: state.pageInfo.pageNum,
      [pageFieldState.value.pageSize]: state.pageInfo.pageSize,
      // 如果服务端（后端）需要排序字段，则在这里添加
    };
  });

  // 外界分页参数发送改变后，内部分页信息也需要改变
  watch(
    () => pageInfo,
    () => (state.pageInfo = { ...defaultTablePageInfo, ...unref(pageInfo) }),
    { deep: true }
  );

  /**
   * 获取表格数据
   */
  const requestData = async (requestParams = apiParams) => {
    if (!api) return;

    const isServerPageValue = toValue(isServerPage);
    loading.value = true;

    try {
      // 初始化参数和分页参数放到总参数里面
      Object.assign(state.totalParams, toValue(requestParams), isServerPageValue ? pageParams.value : {});
      const searchParams = { ...state.searchInitParams, ...state.totalParams } as P;
      const newSearchParams = beforeSearch?.(searchParams) ?? searchParams;

      // beforeSearch 返回 false 则不执行查询
      if (newSearchParams === false) return;

      // 请求数据
      const response = await api(newSearchParams);
      const result = responseAdapter<T>(response);

      let data = result.data;

      data = transformData?.(data, response) ?? data;
      if (data) state.tableData = data;

      loading.value = false;

      // 如果服务器（后端）返回分页信息，则解构获取（如果你的接口返回的不是如下格式，则进行修改）
      if (isServerPageValue) {
        const { pageNum, pageSize, total } = result;

        handlePagination({ pageNum, pageSize }, false);

        state.pageInfo.total = total ?? data.length;
      }
    } catch (error) {
      requestError?.(error);
    }
  };

  /**
   * 更新查询参数
   *
   * @param searchParams 查询数据
   * @param removeNoValue 是否去除空值项，true 去除，false 不去除。默认为 true
   */
  const updatedTotalParam = (searchParams?: Recordable, removeNoValue = true) => {
    state.totalParams = {};

    const mergeParams = (params: Recordable) => {
      return Object.assign(state.totalParams, params, toValue(isServerPage) ? pageParams.value : {});
    };

    // 如果 searchParams 存在且不清除空值项
    if (searchParams && !removeNoValue) return mergeParams(searchParams);

    // 如果去除空值项
    if (removeNoValue) {
      const nowSearchParam: Recordable = searchParams || state.searchParams;
      // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
      for (const key in state.searchParams) {
        const val = state.searchParams[key];
        // 过滤空值
        if (!isEmpty(val)) nowSearchParam[key] = val;
      }
      return mergeParams(nowSearchParam);
    }
    return mergeParams(state.searchParams);
  };

  /**
   * 表格数据查询
   *
   * @param searchParams 查询数据
   * @param removeNoValue 是否去除空值项，true 去除，false 不去除。默认为 true
   */
  const search = (searchParams?: Recordable, removeNoValue = true) => {
    state.pageInfo.pageNum = 1;
    // 更新查询参数
    updatedTotalParam(searchParams, removeNoValue);
    requestData();
  };

  /**
   * 查询参数重置
   *
   * @param searchParams 查询数据
   * @param removeNoValue 是否去除空值项，true 去除，false 不去除。默认为 true
   */
  const reset = (searchParams?: Recordable, removeNoValue = true) => {
    state.pageInfo.pageNum = 1;
    state.searchParams = {};
    // 重置搜索条件，如果有默认搜索参数，则重置为默认的搜索参数
    state.searchParams = { ...state.searchInitParams };

    // 更新查询参数
    updatedTotalParam(searchParams, removeNoValue);
    requestData();
  };

  /**
   * 每页条数改变
   *
   * @param pageInfo 当前分页信息
   * @param request 是否发起请求
   */
  const handlePagination = (pageInfo: Partial<PageInfo>, request = true) => {
    const { pageNum, pageSize, pageSizes } = pageInfo;

    if (pageNum !== undefined) state.pageInfo.pageNum = pageNum <= 0 ? defaultTablePageInfo.pageNum : pageNum;
    if (pageSize !== undefined) state.pageInfo.pageSize = pageSize <= 0 ? defaultTablePageInfo.pageSize : pageSize;
    if (pageSizes) state.pageInfo.pageSizes = pageSizes;

    if (request && toValue(isServerPage)) requestData();
  };

  onMounted(() => {
    if (immediate) requestData();
  });

  return {
    ...toRefs(state),
    loading: readonly(loading),
    fetch: requestData,
    search,
    reset,
    handlePagination,
    updatedTotalParam,
  };
};

/**
 * 响应适配器，处理响应数据
 */
const responseAdapter = <T>(response: unknown): ApiResponse<T> => {
  if (!response) return { data: [], total: 0 };
  if (isArray(response)) return { data: response, total: response.length };
  if (!isObject(response)) return { data: [], total: 0 };

  let res = response as Recordable;
  // 数据
  let data: T[] | undefined;

  const dataFields = ["records", "data", "list", "items", "result"];
  const pageNumFields = ["current", "page", "pageNum"];
  const pageSizeFields = ["size", "pageSize", "limit"];

  data = extractField(res, dataFields, undefined, value => isArray(value));
  // 如果响应体里没有数组，那么可能是类似 {code: 200, data: { list: [], total: 0, pageNum: 1, pageSize: 10 } } 的结构，其中 list 是数据
  if (!data) {
    res = res?.data || res?.list;
    data = extractField<T[] | undefined>(res, dataFields, undefined, value => isArray(value));
  }

  // 总数
  const total = extractField(res, dataFields, data?.length ?? 0, value => isNumber(value));
  // 当前页码
  const pageNum = extractField(res, pageNumFields, undefined, value => isNumber(value));
  // 当前页数
  const pageSize = extractField(res, pageSizeFields, undefined, value => isNumber(value));

  return { data: data ?? [], total, pageNum, pageSize };
};

/**
 * 从对象中提取数据
 * @param obj 对象
 * @param fields 属性 key
 * @param defaultValue 如果提取失败，返回默认值
 * @param condition 比对条件
 */
function extractField<T>(
  obj: Recordable,
  fields: string[],
  defaultValue: T,
  condition?: (field: unknown) => boolean
): T {
  for (const field of fields) if (field in obj && condition?.(obj[field])) return obj[field] as T;
  return defaultValue;
}
