import type { PageInfo } from "@/components/pro/pagination";
import type { UseTableStateData, UseTableStateOptions } from "../types/table-state";
import { reactive, computed, toRefs, toValue, watch, unref } from "vue";
import { defaultPageInfo } from "@/components/pro/pagination";
import { isEmpty } from "@/common/utils";

/**
 * table 页面操作方法封装
 *
 * @param options 配置项
 */
export const useTableState = (options: UseTableStateOptions) => {
  const { api, apiParams, pageInfo, isServerPage, beforeSearch, transformData, requestError, pageField } = options;

  const state = reactive<UseTableStateData>({
    // 表格数据
    tableData: [],
    // 分页数据
    pageInfo: { ...defaultPageInfo, total: 0, ...unref(pageInfo) },
    // 查询参数（只包括查询）
    searchParams: {},
    // 初始化默认的查询参数，重置时候用到
    searchInitParams: {},
    // 总参数（包含分页和查询参数)
    totalParams: {},
  });

  const pageFieldSate = computed(() => {
    return {
      pageNum: pageField?.pageNum ?? "pageNum",
      pageSize: pageField?.pageSize ?? "pageSize",
      pageSizes: pageField?.pageSizes ?? "pageSizes",
      total: pageField?.pageSize ?? "total",
    };
  });

  // 分页查询参数（只包括分页和表格字段排序，其他排序方式可自行配置）
  const pageParams = computed(() => {
    return {
      [pageFieldSate.value.pageNum]: state.pageInfo.pageNum,
      [pageFieldSate.value.pageSize]: state.pageInfo.pageSize,
      // 如果服务端（后端）需要排序字段，则在这里添加
    };
  });

  // 外界分页参数发送改变后，内部分页信息也需要改变
  watch(
    () => pageInfo,
    () => (state.pageInfo = { ...defaultPageInfo, total: 0, ...unref(pageInfo) }),
    { deep: true }
  );

  /**
   * 获取表格数据
   */
  const getTableList = async (requestParams = apiParams) => {
    if (!api) return;

    const isServerPageValue = toValue(isServerPage);

    try {
      // 先把初始化参数和分页参数放到总参数里面
      Object.assign(state.totalParams, toValue(requestParams), isServerPageValue ? pageParams.value : {});
      let searchParams = { ...state.searchInitParams, ...state.totalParams } as any;
      searchParams = beforeSearch?.(searchParams) ?? searchParams;

      // beforeSearch 返回 false 则不执行查询
      if (searchParams === false) return;

      // 请求数据
      const result = await api(searchParams);
      // 兼容 { code: xx, data/list: xx, message: xxx, ... } 等常用数据格式
      let data = result?.data || result?.list || result?.data?.list || result;

      data = transformData?.(data, result) || data;
      if (data) state.tableData = data;

      // 如果服务器（后端）返回分页信息，则解构获取（如果你的接口返回的不是如下格式，则进行修改）
      if (isServerPageValue) {
        const {
          [pageFieldSate.value.pageNum]: pageNum,
          [pageFieldSate.value.pageSize]: pageSize,
          [pageFieldSate.value.pageSizes]: pageSizes,
          [pageFieldSate.value.total]: total,
        } = data;
        handlePagination({ pageNum, pageSize, pageSizes }, false);

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
    getTableList();
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
    getTableList();
  };

  /**
   * 每页条数改变
   *
   * @param pageInfo 当前分页信息
   * @param request 是否发起请求
   */
  const handlePagination = (pageInfo: Partial<PageInfo>, request = true) => {
    if (pageInfo.pageNum) state.pageInfo.pageNum = pageInfo.pageNum;
    if (pageInfo.pageSize) state.pageInfo.pageSize = pageInfo.pageSize;
    if (pageInfo.pageSizes) state.pageInfo.pageSizes = pageInfo.pageSizes;
    if (request && toValue(isServerPage)) getTableList();
  };

  return {
    ...toRefs(state),
    getTableList,
    search,
    reset,
    handlePagination,
    updatedTotalParam,
  };
};
