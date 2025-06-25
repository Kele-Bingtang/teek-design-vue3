import { ElMessageBox } from "element-plus";
import { ElCheckboxGroup, ElCheckbox } from "element-plus";
import { exportJsonToExcel, formatJsonToArray } from "@/common/utils";
import { ref, unref } from "vue";

/**
 * 导出为 Excel
 */
export const exportExcel = async (
  columns: Record<string, any>[],
  data: any[],
  fileName: string,
  exportKey: "label" | "prop" | "dataKey" = "label",
  message = "确认导出数据?"
) => {
  if (exportKey === "label") return exportExcelByLabel(columns, data, fileName);
  if (exportKey === "prop") return exportExcelByProp(columns, data, fileName, message);
  if (exportKey === "dataKey") return exportExcelByDataKey(data, fileName, message);
};

/**
 * 导出为 Excel，表头为 Label
 */
export const exportExcelByLabel = async (columns: Record<string, any>[], data: any[], fileName: string) => {
  const exportColumns = columns.filter(item => !item.type && item.prop !== "operation");
  const exportLabel = ref(exportColumns.map(item => item.label));

  await ElMessageBox({
    message: () => (
      <ElCheckboxGroup v-model={exportLabel.value}>
        {exportColumns.map((item: any) => (
          <ElCheckbox label={item.label} value={item.label} />
        ))}
      </ElCheckboxGroup>
    ),
    title: "请选择导出列",
  });

  const tHeader = [] as string[];
  const propName = [] as string[];

  // 扁平化 data，data 可能有 children 属性和 _enum 属性
  const flatData = filterFlatData(data);

  exportColumns.forEach((item: any) => {
    if (exportLabel.value.includes(item.label)) {
      propName.push(item.prop!);
      tHeader.push(item.label!);
    }
  });

  const d = formatJsonToArray(flatData, propName);
  exportJsonToExcel(tHeader, d, fileName, undefined, undefined, true, "xlsx");
};

/**
 * 导出为 Excel，表头为 Prop
 */
export const exportExcelByProp = async (
  columns: Record<string, any>[],
  data: any[],
  fileName: string,
  message = "确认导出数据?"
) => {
  await ElMessageBox.confirm(message, "温馨提示", { type: "warning" });

  const tHeader = [] as string[];
  const propName = [] as string[];
  // 扁平化 data，data 可能有 children 属性和 _enum 属性
  const flatData = filterFlatData(data);

  columns.forEach((item: any) => {
    if (!item.type && item.prop !== "operation") {
      propName.push(item.prop!);
      tHeader.push(item.prop!);
    }
  });

  const d = formatJsonToArray(flatData, propName);
  exportJsonToExcel(tHeader, d, fileName, undefined, undefined, true, "xlsx");
};

/**
 * 导出为 Excel，表头为 DataKey
 */
export const exportExcelByDataKey = async (data: any[], fileName: string, message = "确认导出数据?") => {
  await ElMessageBox.confirm(message, "温馨提示", { type: "warning" });

  const tHeader = [] as string[];
  const propName = [] as string[];
  // 扁平化 data，data 可能有 children 属性和 _enum 属性
  const flatData = filterFlatData(data);

  Object.keys(flatData[0]).forEach((item: any) => {
    propName.push(item);
    tHeader.push(item);
  });

  const d = formatJsonToArray(flatData, propName);
  exportJsonToExcel(tHeader, d, fileName, undefined, undefined, true, "xlsx");
};

/**
 * @description 扁平化 data，data 可能有 children 属性和 _enum 属性
 */
const filterFlatData = (data: any[]) => {
  return data.reduce((pre: any[], current: any) => {
    // 针对枚举类的导出
    if (current._enum) {
      Object.keys(current._enum).forEach(key => (current[key] = unref(current._enum[key])));
      delete current._enum;
    }
    let flatArr = [...pre, current];
    if (current.children) flatArr = [...flatArr, ...filterFlatData(current.children)];
    return flatArr;
  }, []);
};
