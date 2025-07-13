import type { Ref } from "vue";
import type { FormColumn, ProFormNamespace } from "../types";
import { ref, unref } from "vue";
import { isString } from "@/common/utils";
import { setProp } from "@/components/pro/helper";

/**
 * 使用 ProForm 的 API
 *
 * @param model 表单数据
 * @param columnsProps 表单列配置
 */
export const useFormApi = (model: Ref<Recordable>, columnsProps: Ref<{ columns: FormColumn[] }>) => {
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
    const { columns } = columnsProps.value;

    for (const v of columns) {
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
    const { columns } = columnsProps.value;

    if (isString(propOrIndex)) {
      return columns.forEach((s, i) => {
        if (s.prop === propOrIndex) position === "after" ? column.splice(i + 1, 0, s) : column.splice(i, 0, s);
      });
    }
    if (propOrIndex !== undefined) return columns.splice(propOrIndex, 0, column);
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
