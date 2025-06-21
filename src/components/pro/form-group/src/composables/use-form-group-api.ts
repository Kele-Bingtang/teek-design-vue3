import type { FormColumn } from "@/components/pro/form";
import type { ProFormGroupProps } from "../types";
import { setProp } from "@/components/pro/helper";
import { isString } from "@/utils";

export const useFormGroupApi = (model: Ref<Recordable>, columns: MaybeRef<FormColumn[]> = []) => {
  const mergeProps = ref<ProFormGroupProps>({});

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
  const setProps = (props: ProFormGroupProps = {}) => {
    mergeProps.value = Object.assign(unref(mergeProps), props);
  };

  /**
   * 设置 column
   *
   * @param columnSet 设置内容
   */
  const setColumn = (columnProps: { prop: string; field: string; value: unknown }[]) => {
    const columnsValue = unref(columns);
    for (const v of columnsValue) {
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
    const columnsValue = unref(columns);

    if (isString(prop)) {
      return columnsValue.forEach((s, i) => {
        if (s.prop === prop) position === "after" ? column.splice(i + 1, 0, s) : column.splice(i, 0, s);
      });
    }
    if (prop !== undefined) return columnsValue.splice(prop, 0, column);
    return columnsValue.push(column);
  };

  /**
   * 删除 column
   *
   * @param prop prop
   */
  const delColumn = (prop: FormColumn["prop"]) => {
    const columnsValue = unref(columns);

    const index = columnsValue.findIndex(item => item.prop === prop);
    if (index > -1) columnsValue.splice(index, 1);
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
