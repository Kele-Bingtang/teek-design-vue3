import type { FormColumn } from "@/components/pro/form";
import type { ProSearchProps } from "../types";
import { isString } from "@/utils";
import { setProp } from "@/components/pro/helper";

export const useSearchApi = (model: Ref<Recordable>, columnsProps: Ref<{ columns: FormColumn[] }>) => {
  const mergeProps = ref<ProSearchProps>({});

  /**
   * 设置 model 的值
   *
   * @param modelValue 设置的值
   */
  const setValues = async (modelValue: Record<string, any> = {}) => {
    model.value = Object.assign(model.value, modelValue);
  };

  /**
   * 设置 ProSearch 组件的 props
   *
   * @param props 要添加的 ProSearch props
   */
  const setProps = (props: ProSearchProps = {}) => {
    mergeProps.value = Object.assign(unref(mergeProps), props);
  };

  /**
   * 设置 column
   *
   * @param columnSet 设置内容
   */
  const setColumn = (columnProps: { prop: string; field: string; value: unknown }[]) => {
    const { columns } = columnsProps.value;

    for (const v of columns) {
      for (const item of columnProps) {
        if (v.prop === item.prop) {
          setProp(v, item.field, item.value);
        }
      }
    }
  };

  /**
   * 添加 column
   *
   * @param column 添加的 column
   * @param propOrIndex 参考对象，prop 或者 index
   * @param position 添加的位置，before 或者 after
   */
  const addColumn = (
    column: FormColumn,
    prop?: FormColumn["prop"] | number,
    position: "before" | "after" = "after"
  ) => {
    const { columns } = columnsProps.value;

    if (isString(prop)) {
      return columns.forEach((s, i) => {
        if (s.prop === prop) position === "after" ? column.splice(i + 1, 0, s) : column.splice(i, 0, s);
      });
    }
    if (prop !== undefined) return columns.splice(prop, 0, column);
    return columns.push(column);
  };

  /**
   * 删除 column
   *
   * @param prop prop
   */
  const delColumn = (prop: FormColumn["prop"]) => {
    const { columns } = columnsProps.value;

    const index = columns.findIndex(item => item.prop === prop);
    if (index > -1) columns.splice(index, 1);
  };

  return {
    mergeProps,
    setValues,
    setProps,
    setColumn,
    addColumn,
    delColumn,
  };
};
