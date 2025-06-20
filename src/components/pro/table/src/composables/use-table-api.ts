import type { BaseValueType } from "@/components/pro/form-item";
import type { ProTableNamespace, TableColumn } from "../types";
import { setProp } from "@/components/pro/form-item";
import { isString } from "@/utils";

/**
 * setColumn 函数的参数类型
 */
export interface TableSetProps {
  prop: string;
  field: string;
  value: BaseValueType;
}

export const useTableApi = (columns: MaybeRef<TableColumn[]> = []) => {
  const mergeProps = ref<ProTableNamespace.Props>({});

  /**
   * 设置 ProTable 组件的 props
   *
   * @param props 要添加的 ProTable props
   */
  const setProps = (props: ProTableNamespace.Props = {}) => {
    mergeProps.value = Object.assign(unref(mergeProps), props);
  };

  /**
   * 设置 column
   *
   * @param columnSet 设置内容
   * @param children 设置合并列（合并表头）
   */
  const setColumn = (columnSet: TableSetProps[], children?: TableColumn[]) => {
    const columnsValue = unref(columns);
    for (const column of children || columnsValue) {
      for (const item of columnSet) {
        if (column.prop === item.prop) setProp(column, item.field, item.value);
        else if (column.children?.length) setColumn(columnSet, column.children);
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
    column: TableColumn,
    propOrIndex?: TableColumn["prop"] | number,
    position: "before" | "after" = "after"
  ) => {
    const columnsValue = unref(columns);
    if (isString(propOrIndex)) {
      return columnsValue.forEach((column, i) => {
        if (column.prop === propOrIndex) {
          position === "after" ? columnsValue.splice(i + 1, 0, column) : columnsValue.splice(i, 0, column);
        }
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
  const delColumn = (prop: TableColumn["prop"]) => {
    const columnsValue = unref(columns);
    const index = columnsValue.findIndex(item => item.prop === prop);
    if (index > -1) columnsValue.splice(index, 1);
  };

  return { mergeProps, setProps, setColumn, addColumn, delColumn };
};
