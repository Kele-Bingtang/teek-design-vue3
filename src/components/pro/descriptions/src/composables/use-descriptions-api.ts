import type { Ref } from "vue";
import type { DescriptionColumn, ProDescriptionsProp } from "../types";
import { ref, unref } from "vue";
import { isString } from "@/common/utils";
import { setProp } from "@/components/pro/helper";

/**
 * 使用 ProDescriptions 的 API
 *
 * @param model 表单数据
 * @param columnsProps 表单列配置
 */
export const useDescriptionsApi = (model: Ref<Recordable>, columnsProps: Ref<{ columns: DescriptionColumn[] }>) => {
  const mergeProps = ref<ProDescriptionsProp>({});

  /**
   * 设置 model 的值
   *
   * @param modelValue 设置的值
   */
  const setValues = (modelValue: Recordable = {}) => {
    model.value = Object.assign(model.value, modelValue);
  };

  /**
   * 设置 ProDescriptions 组件的 props
   *
   * @param props 要添加的 ProDescriptions props
   */
  const setProps = (props: ProDescriptionsProp = {}) => {
    mergeProps.value = Object.assign(unref(mergeProps), props);
  };

  /**
   * 设置 column
   *
   * @param columnSet 设置内容
   */
  const setColumn = (columnSet: { prop: string; field: string; value: any }[]) => {
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
    column: DescriptionColumn,
    propOrIndex?: DescriptionColumn["prop"] | number,
    position: "before" | "after" = "after"
  ) => {
    const { columns } = columnsProps.value;

    if (isString(propOrIndex)) {
      const index = columns.findIndex(item => item.prop === propOrIndex);
      if (index !== -1) position === "after" ? columns.splice(index + 1, 0, column) : columns.splice(index, 0, column);
      return;
    }
    if (propOrIndex !== undefined) return columns.splice(propOrIndex, 0, column);
    return columns.push(column);
  };

  /**
   * 删除 column
   *
   * @param prop prop
   */
  const delColumn = (prop: DescriptionColumn["prop"]) => {
    const { columns } = columnsProps.value;

    const index = columns.findIndex(item => item.prop === prop);
    if (index > -1) columns.splice(index, 1);
  };

  return {
    mergeProps: readonly(mergeProps),
    setValues,
    setProps,
    setColumn,
    addColumn,
    delColumn,
  };
};
