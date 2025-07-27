import type { Ref, MaybeRef } from "vue";
import type { ElOption } from "@/components/pro/form-item";
import type { TableRow, TableColumn } from "../types/table-column";
import { unref, toValue, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { isArray } from "@/common/utils";
import { getProp, setProp, filterOptions, filterOptionsValue } from "@/components/pro/helper";

export const initDataRowField = (
  data: TableRow[],
  column: TableColumn,
  optionsMap: Ref<Map<string, MaybeRef<ElOption[]>>>
) => {
  // 获取当前列的配置项，！获取的配置无法直接作用在 row._xx 里
  const {
    prop = "",
    isFilterOptions = true,
    optionsProp,
    optionField,
    transformOption,
    ignoreOptionIfAbsent,
    editable,
  } = column;

  const options = unref(optionsMap.value.get(optionsProp ?? prop));

  // 初始化内置属性
  data.forEach(initEnhanceField);

  function initEnhanceField(row: TableRow) {
    // 递归处理 children
    if (row.children && isArray(row.children)) row.children.forEach(initEnhanceField);

    row._options ??= {};
    if (options && toValue(isFilterOptions)) row._options[prop] = options;

    row._optionProps ??= {};
    row._optionProps[prop] ??= { optionField, transformOption, ignoreOptionIfAbsent };

    /**
     * 根据 prop 获取 value
     */
    row._getValue ??= (prop: string) => {
      const options = row._options[prop];
      const value = getProp(row, prop);
      if (!options) return value;

      const { optionField, transformOption, ignoreOptionIfAbsent } = row._optionProps[prop] || {};

      const option = transformOption
        ? transformOption(value, options, row)
        : filterOptions(value, options, optionField);

      const label = option ? filterOptionsValue(option, optionField?.label || "label") : "";

      if ((!label || label === "--") && toValue(ignoreOptionIfAbsent)) return value;
      return label;
    };

    // 获取 row 的纯数据（过滤掉内置的加强方法）
    row._getData ??= () => {
      return Object.fromEntries(Object.entries(row).filter(([key]) => !key.startsWith("_")));
    };

    // 初始化 _editableCol
    row._editableCol ??= {};
    if (editable) setProp(row._editableCol, prop, true);

    // 开启多个单元格编辑状态
    row._openCellEdit ??= props => {
      row._oldData ??= {};

      if (props) {
        // 开启指定单元格的编辑状态
        const open = (prop: string) => {
          // 编辑前缓存旧数据
          setProp(row._oldData, prop, row._getValue(prop));

          setProp(row._editableCol, prop, true);
          nextTick(() => {
            // 焦点聚焦
            (row._proFormInstance?.[prop]?.getElInstance(prop) as HTMLElement)?.focus?.();
          });
        };

        if (isArray(props)) props.forEach(prop => open(prop));
        else open(props);
      } else {
        row._editable = true;
        row._oldData = { ...row._getData() };
      }
    };

    // 关闭开启单元格编辑状态
    row._closeCellEdit ??= (props, reset = false) => {
      if (props) {
        // 关闭指定单元格的编辑状态
        const close = (prop: string) => setProp(row._editableCol, prop, false);

        if (isArray(props)) props.forEach(prop => close(prop));
        else close(props);
      } else row._editable = false;

      reset && row._resetCellData(props);
    };

    // 还原编辑前的数据
    row._resetCellData ??= props => {
      row._oldData ??= {};
      if (props) {
        // 重置指定单元格数据
        const reset = (prop: string) => {
          const data = getProp(row._oldData, prop);
          data && setProp(row, prop, data);
        };

        if (isArray(props)) props.forEach(reset);
        else reset(props);
      } else {
        Object.entries(row._oldData).forEach(([prop, value]) => {
          setProp(row, prop, value);
        });
      }
      delete row._oldData;
    };

    // 判断当前单元格是否处于编辑状态
    row._isCellEdit ??= (props, mode = "and") => {
      if (props) {
        if (isArray(props)) {
          return mode === "and"
            ? props.every(prop => getProp(row._editableCol, prop) ?? false)
            : props.some(prop => getProp(row._editableCol, prop) ?? false);
        }
        return getProp(row._editableCol, prop) ?? false;
      }
      return row._editable ?? false;
    };

    // 编辑态行/单元格校验
    row._validateCellEdit ??= async (callback, prop) => {
      if (!row._proFormInstance) return true;

      try {
        // 校验失败会走 catch
        if (prop) await row._proFormInstance[prop].elFormInstance?.validate();
        else {
          const proFormInstances = Object.values(row._proFormInstance);
          await Promise.all(
            proFormInstances.map(async proFormInstance => {
              await proFormInstance.elFormInstance?.validate();
            })
          );
        }

        callback?.(true, undefined);
        return true;
      } catch (error) {
        // 如果校验失败且没有自定义 callback，则弹出内置错误信息
        if (!callback) {
          ElMessage.closeAll();
          ElMessage.warning(Object.values(error || { message: ["请完整填写表单然后再次提交！"] })[0][0].message);
        }

        callback?.(false, error as any);
        return false;
      }
    };
  }
};
