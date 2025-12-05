import type { TableColumnCtx } from "element-plus";
import type { FilterRule, TableColumn } from "../types";
import { toRaw, toValue } from "vue";
import { isArray, isEmpty, isFunction } from "@/common/utils";
import { getProp, getObjectKeys } from "@/components/pro/helper";
import { Environment } from "./enums";

/**
 * 处理值无数据情况
 *
 * @param callValue 需要处理的值
 */
export const formatCellValue = (callValue: any) => {
  // 如果当前值为数组，使用 / 分隔符拼接（根据需求自定义分隔符）
  if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
  return callValue ?? "--";
};

export const isServer = (value: unknown) => {
  // 如果传入 true，则为客户端
  if (!value || value === true) return false;
  return value === Environment.Server;
};

/**
 * 初始化 model
 *
 * @param model 模型
 * @param prop 属性
 * @param value 初始化的值
 * @param initIfEmpty 值为空时是否依然初始化
 */
export const initModel = (model: Recordable, prop: string | string[], value: unknown, initIfEmpty = false) => {
  const init = (propArr: string[]) => {
    let currentLevel = model;
    propArr.forEach((prop, index) => {
      if (index === propArr.length - 1 && (!isEmpty(value) || (isEmpty(value) && initIfEmpty))) {
        currentLevel[prop] = value;
      } else {
        if (!currentLevel[prop]) currentLevel[prop] = {};
        currentLevel = currentLevel[prop];
      }
    });

    return currentLevel;
  };

  if (isArray(prop)) return init(prop);
  if (prop?.includes(".")) return init(prop.split("."));

  if (!isEmpty(value) || (isEmpty(value) && initIfEmpty)) model[prop] = value;

  return model;
};

/**
 * 将 data 转换为日期，如果转换失败，则返回 undefined
 */
export const strToDate = (data: string | number) => {
  if (isNaN(data as number) && !isNaN(Date.parse(data as string))) return new Date(data);
};

/**
 * 过滤数据
 *
 * @param data 数据
 * @param model 过滤条件
 * @param filterRule 过滤规则
 */
export const filterData = (data: Recordable[], model: Recordable, filterRule: Record<string, FilterRule>) => {
  if (isEmpty(model)) return data;

  const modelKeys = getObjectKeys(model);

  return data.filter(item => {
    // model 全部满足查询条件才算匹配成功
    return modelKeys.every(key => {
      // 匹配规则
      const rule = getProp(filterRule, key) || "eq";
      // 自定义规则函数
      if (isFunction(rule)) return rule(model, item, key);

      // 输入的值
      const value = getProp(model, key);
      // 表格的值
      const rowValue = getProp(item, key);

      // 空值默认不查询
      if (isEmpty(value)) return true;

      const rowDate = strToDate(rowValue);
      // 日期类型
      if (rowDate) {
        // 日期范围查询，仅支持 between、notBetween 规则
        if (isArray(value)) {
          if (value.length === 2) {
            const startDate = strToDate(value[0]);
            const endDate = strToDate(value[1]);

            if (startDate && endDate && rowDate) {
              if (rule === "between") return startDate <= rowDate && rowDate <= endDate;
              if (rule === "notBetween") return startDate > rowDate || endDate < rowDate;
              // 默认 between 规则
              return startDate <= rowDate && rowDate <= endDate;
            }
          }
        } else {
          // 单个日期查询，仅支持 lt、le、gt、ge 规则
          const date = strToDate(value);
          if (date) {
            if (rule === "eq") return value === rowValue;
            if (rule === "lt") return date < strToDate(rowValue)!;
            if (rule === "le") return date <= strToDate(rowValue)!;
            if (rule === "gt") return date > strToDate(rowValue)!;
            if (rule === "ge") return date >= strToDate(rowValue)!;
            // 默认 gt 规则
            return date >= strToDate(rowValue)!;
          }
        }
      }

      // 数组类型，仅支持 in、between、notBetween 规则
      if (isArray(value)) {
        if (value.length === 2 && !rowDate) {
          if (rule === "between") return value[0] <= rowValue && rowValue <= value[1];
          if (rule === "notBetween") return value[0] > rowValue || value[1] < rowValue;
        }
        if (rule === "in") return value.includes(rowValue);
        if (rule === "notIn") return !value.includes(rowValue);
        // 默认 in 规则
        return value.includes(rowValue);
      }

      // 基础类型：Number、String、Boolean，仅支持 eq、ne、lt、le、gt、ge、like、noLike 规则
      if (rule === "eq") return value === rowValue;
      if (rule === "ne") return value !== rowValue;
      if (rule === "lt") return value < rowValue;
      if (rule === "le") return value <= rowValue;
      if (rule === "gt") return value > rowValue;
      if (rule === "ge") return value >= rowValue;
      if (rule === "like") return rowValue.includes(value);
      if (rule === "notLike") return !rowValue.includes(value);

      // 默认 eq
      return rowValue === value;
    });
  });
};

/**
 * 初始化 column 部分配置项，并移出不需要的配置项
 */
export const initTableColumn = (column: TableColumn) => {
  column.filter = toValue(column.filter);
  column.editable = toValue(column.editable);
  column.hidden = toValue(column.hidden);
  column.disabledHidden = toValue(column.disabledHidden);
  column.disabledFilter = toValue(column.disabledFilter);
  column.disabledSortable = toValue(column.disabledSortable);
  column.isFilterOptions = toValue(column.isFilterOptions);
  column.width = toValue(column.width);
  column.label = toValue(column.label);

  // 使用解构并排除 children, renderHeader 属性
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, renderHeader, ...rest } = toRaw(column);

  return rest as unknown as TableColumnCtx<any>;
};
