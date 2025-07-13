import type { TableColumnProps } from "../../interface";
import { computed, inject, withModifiers } from "vue";
import { ElPopover, ElIcon, ElButton } from "element-plus";
import { Filter } from "@element-plus/icons-vue";
import { isEmpty } from "@/common/utils";
import ProForm from "@/components/pro/v1/pro-form";
import { hyphenToCamelCase } from "@/components/pro/v1/pro-form";
import { useNamespace } from "@/composables";
import { filterKey } from "../../interface";
import { lastProp } from "../../helper";

export const useHeaderFilter = (column: TableColumnProps) => {
  const filterProps = inject(filterKey);

  /**
   * 是否使用自定义表头过滤器功能
   */
  const useFilter = computed(() => {
    // item.filterConfig.enabled 优先级最高
    if (column.filterConfig?.enabled === false || column.prop === "operation") return false;
    // 全部的可过滤表头启用过滤器
    if (filterProps?.useFilter) return true;
    // 启用过滤器且开启 search
    if (filterProps?.filter && (column.search?.el || column.search?.render)) return true;

    return column.filterConfig?.enabled;
  });

  /**
   * 渲染表头自定义过滤器
   */
  const renderHeaderFilter = () => {
    const { searchParam = {}, search, reset } = filterProps || {};

    // 存在多级 prop 时，要么自定义 key，要么取 prop 的最有一级（表单不使用多级 prop 当 key）
    const prop = column.search?.key || lastProp(column.prop!);

    const schema = {
      ...column.search,
      el: hyphenToCamelCase(column.search?.el) === "ElSelect" ? "CheckBoxSelect" : column.search?.el || "ElInput", // 如果指定 el 为 ElSelect，则走自定义 Select。如果不指定 el，则默认使用 ElInput 来过滤
      label: "",
      prop: prop,
      enum: column.enum as any,
      useEnumMap: column.useEnumMap,
      enumKey: column.enumKey,
      fieldNames: column.fieldNames,
      props: {
        ...column.search?.props,
        teleported: false, // 解决 ElSelect 的 Option 选中后，自动关闭 Popover 问题
      },
    };

    // 筛选点击事件
    const handleSearch = () => {
      search && search(searchParam);
    };

    // 清除点击事件
    const handleClear = async () => {
      // 如果配置了 renderUseProp，代表自定义 render，则清空对应的 prop
      if (column.renderUseProp?.length) column.renderUseProp.forEach(prop => delete searchParam[prop]);
      else delete searchParam[column.prop!];
      // 清除后重新搜索
      handleSearch();
    };

    // 重置点击事件
    const handleReset = async () => {
      reset && reset();
    };

    const propIsEmpty = () => {
      if (column.renderUseProp?.length) return !column.renderUseProp.some(prop => !isEmpty(searchParam[prop]));

      return isEmpty(searchParam[prop]);
    };

    const { filterConfig = {} } = column;
    const { width, trigger } = filterConfig;
    const ns = useNamespace();

    return (
      <ElPopover {...filterConfig} width={width || 230} trigger={trigger || "click"}>
        {{
          reference: () => (
            <ElIcon
              style="vertical-align: -2px; margin-left: 2px; cursor: pointer;"
              class="theme-color-hover"
              color={!propIsEmpty() ? ns.cssVarEl("color-primary") : "inherit"}
              onClick={withModifiers(() => {}, ["stop"])}
            >
              <Filter />
            </ElIcon>
          ),
          default: () => (
            <>
              <ProForm v-model={searchParam} dynamicModel={false} onlyRenderComponent schema={[schema]}></ProForm>
              <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                <ElButton onClick={handleReset}>重置</ElButton>
                <div>
                  <ElButton onClick={handleClear}>清除</ElButton>
                  <ElButton onClick={handleSearch}>筛选</ElButton>
                </div>
              </div>
            </>
          ),
        }}
      </ElPopover>
    );
  };

  return {
    renderHeaderFilter,
    useFilter,
  };
};
