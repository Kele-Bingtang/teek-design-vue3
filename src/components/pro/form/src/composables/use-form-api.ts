import type { FormColumn, ProFormNamespace } from "../types";
import { isString } from "@/utils";
import { setProp } from "@/components/pro/helper";

export const useFormApi = (model: Ref<Recordable>, columns: MaybeRef<FormColumn[]> = []) => {
  const mergeProps = ref<ProFormNamespace.Props>({});

  /**
   * 设置 model 的值
   *
   * @param modelValue 设置的值
   */
  const setValues = (modelValue: Recordable = {}) => {
    model.value = Object.assign(model.value, modelValue);
  };

  /**
   * 设置 ProForm 组件的 props
   *
   * @param props 要添加的 ProForm props
   */
  const setProps = (props: ProFormNamespace.Props = {}) => {
    mergeProps.value = Object.assign(unref(mergeProps), props);
  };

  /**
   * 设置 column
   *
   * @param columnSet 设置内容
   */
  const setColumn = (columnSet: { prop: string; field: string; value: unknown }[]) => {
    const columnsValue = unref(columns);
    for (const v of columnsValue) {
      for (const item of columnSet) {
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
   * @param propOrIndex 参考对象，prop 或者 index 下标，不传则插入到最后
   * @param position 添加的位置，before 或者 after
   */
  const addColumn = (
    column: FormColumn,
    propOrIndex?: FormColumn["prop"] | number,
    position: "before" | "after" = "after"
  ) => {
    const columnsValue = unref(columns);

    if (isString(propOrIndex)) {
      return columnsValue.forEach((s, i) => {
        if (s.prop === propOrIndex) position === "after" ? column.splice(i + 1, 0, s) : column.splice(i, 0, s);
      });
    }
    if (propOrIndex !== undefined) return columnsValue.splice(propOrIndex, 0, column);
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
