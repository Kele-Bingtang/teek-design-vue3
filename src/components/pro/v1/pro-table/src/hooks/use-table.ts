import type { PageInfo } from "@/components";
import type { TableColumnProps } from "../interface";
import { reactive, computed, toRefs } from "vue";
import { isEmpty } from "@/common/utils";

export namespace Table {
  export interface PageInfo {
    pageNum: number;
    pageSize: number;
    pageSizes?: number[];
    total: number;
  }

  export interface PaginationProps {
    enabled: boolean; // 是否开启分页
    fake: boolean; // 是否前端分页
  }

  export interface StateProps {
    tableData: any[];
    paging: PageInfo;
    searchParam: Record<string, any>;
    searchInitParam: Record<string, any>;
    totalParam: Record<string, any>;
    icon?: Record<string, any>;
  }
}

export namespace Theme {
  export type GreyOrWeakType = "grey" | "weak";
}

/**
 * @description table 页面操作方法封装
 * @param {Function} api 获取表格数据 api 方法 (必传)
 * @param {Object} initRequestParam 获取数据初始化参数 (非必传，默认为{})
 * @param {Boolean} openPage 是否有分页 (非必传，默认为true)
 * @param {Object} pageConfig 分页对象
 * @param {Function} beforeSearch 查询前的回调函数
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法 (非必传)
 * @param {Function} requestError 请求出错后的回调函数
 * @param {Object[]} columns 表格的列配置项
 * @param {Function} enumCallBack 字典设置的回调函数，ProTable 内置函数
 */
export const useTable = (
  api?: (params: any) => Promise<any>,
  initRequestParam: object = {},
  openPage: boolean | Table.PaginationProps = true,
  pageConfig?: Partial<Table.PageInfo>,
  beforeSearch?: (searchParam: any) => any,
  dataCallBack?: (data: any) => any,
  requestError?: (error: any) => void,
  columns?: TableColumnProps[]
) => {
  const state = reactive<Table.StateProps>({
    // 表格数据
    tableData: [],
    // 分页数据
    paging: {
      // 当前页数
      pageNum: 1,
      // 每页显示条数
      pageSize: 20,
      // 一页显示多少条数据
      pageSizes: [10, 20, 50, 100, 200],
      // 总条数
      total: 0,
      ...pageConfig,
    },
    // 查询参数（只包括查询）
    searchParam: {},
    // 初始化默认的查询参数，重置时候用到
    searchInitParam: {},
    // 总参数（包含分页和查询参数)
    totalParam: {},
  });

  /**
   * @description 分页查询参数（只包括分页和表格字段排序，其他排序方式可自行配置）
   */
  const pageParam = computed({
    get: () => {
      return { pageNum: state.paging.pageNum, pageSize: state.paging.pageSize };
    },
    set: (newVal: any) => {
      console.log("我是分页更新之后的值", newVal);
    },
  });

  /**
   * @description 获取表格数据
   * @return void
   */
  const getTableList = async (requestParam: object = initRequestParam) => {
    if (!api) return;
    try {
      // 先把初始化参数和分页参数放到总参数里面
      Object.assign(state.totalParam, requestParam, isBackPage(openPage) ? pageParam.value : {});
      let searchParam = { ...state.searchInitParam, ...state.totalParam } as any;
      beforeSearch && (searchParam = beforeSearch(searchParam) ?? searchParam);

      // 返回 false 则不执行查询
      if (searchParam === false) return;

      // 触发每个配置项的 beforeSearch
      if (columns) {
        for (let i = 0; i < columns.length; i++) {
          const col = columns[i];
          if (col.search?.beforeSearch) {
            searchParam[col.prop!] =
              col.search?.beforeSearch(searchParam[col.search.key ?? col.prop!], searchParam, col) ??
              searchParam[col.prop!];

            if (searchParam[col.prop!] === false) return;
          }
        }
      }

      // 请求数据
      let { data } = await api(searchParam);

      dataCallBack && (data = dataCallBack(data) || data);
      if (data) state.tableData = isBackPage(openPage) ? data.list : data;

      // 解构后台返回的分页数据 (如果有分页更新分页信息)
      if (isBackPage(openPage)) {
        const { pageNum, pageSize, pageSizes, total } = data;
        if (pageNum) updatePageInfo({ pageNum });
        if (pageSize) updatePageInfo({ pageSize });
        if (pageSizes) updatePageInfo({ pageSizes });
        if (total) updatePageInfo({ total });
        else updatePageInfo({ total: data.length });
      }
    } catch (error) {
      console.error(error);
      requestError && requestError(error);
    }
  };

  /**
   * @description 更新查询参数
   * @param {Object} model 查询参数对象
   * @param {Boolean} removeNoValue 是否去除空值项，true 去除，false 不去除。默认为 true
   * @return void
   */
  const updatedTotalParam = (model?: Record<string, any>, removeNoValue = true) => {
    state.totalParam = {};

    // 如果 model 存在且不清除空值项
    if (model && !removeNoValue) return Object.assign(state.totalParam, model, isBackPage() ? pageParam.value : {});

    // 如果去除空值项
    if (removeNoValue) {
      const nowSearchParam: Table.StateProps["searchParam"] = model || state.searchParam;
      // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
      for (const key in state.searchParam) {
        const val = state.searchParam[key];
        // 过滤空值
        if (!isEmpty(val)) nowSearchParam[key] = val;
      }

      return Object.assign(state.totalParam, nowSearchParam, isBackPage() ? pageParam.value : {});
    }

    return Object.assign(state.totalParam, model || state.searchParam, isBackPage() ? pageParam.value : {});
  };

  /**
   * @description 更新分页信息
   * @param {Object} paging 后台返回的分页数据
   * @return void
   */
  const updatePageInfo = (paging: Partial<Table.PageInfo>) => {
    Object.assign(state.paging, paging);
  };

  /**
   * @description 表格数据查询
   * @param {Object} model 查询参数对象
   * @param {Boolean} removeNoValue 是否去除空值项，true 去除，false 不去除。默认为 true
   * @return void
   */
  const search = (model?: Record<string, any>, removeNoValue = true) => {
    state.paging.pageNum = 1;
    // 更新查询参数
    updatedTotalParam(model, removeNoValue);
    getTableList();
  };

  /**
   * @description 表格数据重置
   * @param {Object} model 查询参数对象
   * @param {Boolean} removeNoValue 是否去除空值项，true 去除，false 不去除。默认为 true
   * @return void
   */
  const reset = (model?: Record<string, any>, removeNoValue = true) => {
    state.paging.pageNum = 1;
    state.searchParam = {};
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    state.searchParam = { ...state.searchInitParam };
    // 更新查询参数
    updatedTotalParam(model, removeNoValue);
    getTableList();
  };

  /**
   * @description 每页条数改变
   * @param {Number} paging 当前分页信息
   * @return void
   */
  const handlePagination = (paging: Partial<PageInfo>) => {
    if (paging.pageNum) state.paging.pageNum = paging.pageNum;
    if (paging.pageSize) state.paging.pageSize = paging.pageSize;
    if (paging.pageSizes) state.paging.pageSizes = paging.pageSizes;
    if (isBackPage()) getTableList();
  };

  /**
   * @description 是否开启分页功能
   * @param open 分页配置项
   * @returns Boolean。true 开启，false 不开启
   */
  const isOpenPage = (open: boolean | Table.PaginationProps = openPage) => {
    if (open === true) return true;
    if ((open as Table.PaginationProps)?.enabled) return true;
    return false;
  };

  /**
   * @description 是否开启后端分页
   * @param open 分页配置项
   * @returns Boolean。true 开启，false 不开启
   */
  const isBackPage = (open: boolean | Table.PaginationProps = openPage) => {
    if (open === true) return true;
    if (open === false) return false;
    if ((open as Table.PaginationProps)?.enabled && (open as Table.PaginationProps)?.fake !== true) return true;
    return false;
  };

  /**
   * @description 是否开启前端分页
   * @param open 分页配置项
   * @returns Boolean。true 开启，false 不开启
   */
  const isFrontPage = (open: boolean | Table.PaginationProps = openPage) => {
    if (open === true || open === false) return false;
    if ((open as Table.PaginationProps)?.enabled && (open as Table.PaginationProps)?.fake) return true;
    return false;
  };

  return {
    ...toRefs(state),
    getTableList,
    search,
    reset,
    handlePagination,
    updatedTotalParam,
    isOpenPage,
    isBackPage,
    isFrontPage,
  };
};
