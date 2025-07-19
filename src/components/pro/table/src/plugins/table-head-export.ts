import type { ExportProps, ProTableNamespace } from "../types";
import type { CheckboxGroupValueType } from "element-plus";
import { ref, unref, defineComponent, watch, h, toValue } from "vue";
import { ElMessageBox, ElMessage, ElCheckboxGroup, ElCheckbox } from "element-plus";
import { exportJsonToExcel, formatJsonToArray } from "@/common/utils";
import { getObjectKeys } from "@/components/pro/helper";

const defaultFileName = "export-table";
const defaultConfirmTitle = "请选择导出列";

// ElCheckboxGroup 使用组件
const CheckboxGroupModal = defineComponent({
  name: "CheckboxGroupModal",
  props: {
    initialValue: {
      type: Array as () => CheckboxGroupValueType,
      default: () => [],
    },
    columns: {
      type: Array as () => any[],
      required: true,
    },
    valueKey: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const selectedLabels = ref<CheckboxGroupValueType>(props.initialValue || []);
    const valueKey = ref<string>(props.valueKey);

    watch(
      () => selectedLabels,
      val => emit("change", val)
    );
    return { selectedLabels, valueKey };
  },
  render() {
    return h(
      ElCheckboxGroup,
      {
        modelValue: this.selectedLabels,
        "onUpdate:modelValue": (val: CheckboxGroupValueType) => {
          this.selectedLabels = val;
        },
      },
      () =>
        this.columns?.map(item =>
          h(ElCheckbox, {
            label: this.valueKey ? item[this.valueKey] : item,
            value: this.valueKey ? item[this.valueKey] : item,
          })
        )
    );
  },
});

/**
 * 导出为 Excel
 */
export const exportExcel = async (
  columns: ProTableNamespace.Props["columns"],
  data: ProTableNamespace.Props["data"],
  exportProps: ExportProps = {}
) => {
  const { mode = "dataKey" } = exportProps;
  if (mode === "label") return exportExcelByLabel(columns, data, exportProps);
  if (mode === "prop") return exportExcelByProp(columns, data, exportProps);
  if (mode === "dataKey") return exportExcelByDataKey(data, exportProps);

  ElMessage.error("exportKey 格式错误或不能为空");
};

/**
 * 导出为 Excel，表头为 Label
 */
export const exportExcelByLabel = async (
  columns: ProTableNamespace.Props["columns"] = [],
  data: ProTableNamespace.Props["data"] = [],
  exportProps: ExportProps = {}
) => {
  const {
    fileName = `${defaultFileName}-${new Date().getTime()}`,
    title = defaultConfirmTitle,
    options,
    appContext,
  } = exportProps;
  const exportColumns = columns.filter(item => !item.type && item.prop !== "operation");
  const exportLabel = ref<CheckboxGroupValueType>(exportColumns.map(item => toValue(item.label) || ""));

  await ElMessageBox.confirm(
    h(CheckboxGroupModal, {
      initialValue: exportLabel.value,
      columns: exportColumns,
      valueKey: "label",
      onChange: (value: CheckboxGroupValueType) => (exportLabel.value = value),
    }),
    title,
    options,
    appContext
  );

  const tHeader = [] as string[];
  const propName = [] as string[];

  const flatData = filterFlatData(data);

  exportColumns.forEach(item => {
    if (exportLabel.value.includes(toValue(item.label)!)) {
      propName.push(item.prop!);
      tHeader.push(toValue(item.label)!);
    }
  });

  const jsonArray = formatJsonToArray(flatData, propName);
  exportJsonToExcel(tHeader, jsonArray, fileName, undefined, undefined, true, "xlsx");
};

/**
 * 导出为 Excel，表头为 prop
 */
export const exportExcelByProp = async (
  columns: ProTableNamespace.Props["columns"] = [],
  data: ProTableNamespace.Props["data"] = [],
  exportProps: ExportProps = {}
) => {
  const {
    fileName = `${defaultFileName}-${new Date().getTime()}`,
    title = defaultConfirmTitle,
    options,
    appContext,
  } = exportProps;
  const exportColumns = columns.filter(item => !item.type && item.prop !== "operation");
  const exportProp = ref<CheckboxGroupValueType>(exportColumns.map(item => item.prop || ""));

  await ElMessageBox.confirm(
    h(CheckboxGroupModal, {
      initialValue: exportProp.value,
      columns: exportColumns,
      valueKey: "prop",
      onChange: (value: CheckboxGroupValueType) => (exportProp.value = value),
    }),
    title,
    options,
    appContext
  );

  const tHeader = [] as string[];
  const propName = [] as string[];

  const flatData = filterFlatData(data);

  exportColumns.forEach((item: any) => {
    if (exportProp.value.includes(item.prop)) {
      propName.push(item.prop);
      tHeader.push(item.prop);
    }
  });

  const jsonArray = formatJsonToArray(flatData, propName);
  exportJsonToExcel(tHeader, jsonArray, fileName, undefined, undefined, true, "xlsx");
};

/**
 * 导出为 Excel，表头为 dataKey
 */
export const exportExcelByDataKey = async (
  data: ProTableNamespace.Props["data"] = [],
  exportProps: ExportProps = {}
) => {
  const {
    fileName = `${defaultFileName}-${new Date().getTime()}`,
    title = defaultConfirmTitle,
    options,
    appContext,
  } = exportProps;
  const flatData = filterFlatData(data);
  const keys = getObjectKeys(flatData[0]).filter(key => !key.startsWith("_"));
  const exportItem = ref<CheckboxGroupValueType>(keys);

  await ElMessageBox.confirm(
    h(CheckboxGroupModal, {
      initialValue: exportItem.value,
      columns: keys,
      onChange: (value: CheckboxGroupValueType) => (exportItem.value = value),
    }),
    title,
    options,
    appContext
  );

  const tHeader = [] as string[];
  const propName = [] as string[];

  keys.forEach(item => {
    if (exportItem.value.includes(item)) {
      propName.push(item);
      tHeader.push(item);
    }
  });

  const jsonArray = formatJsonToArray(flatData, propName);
  exportJsonToExcel(tHeader, jsonArray, fileName, undefined, undefined, true, "xlsx");
};

/**
 * 扁平化 data，data 可能有 children 属性和 _options 属性
 */
const filterFlatData = (data: Recordable[]): Recordable[] => {
  return data.reduce((pre: Recordable[], current) => {
    if (current._label) {
      const leafKeys = getObjectKeys(current._label);
      leafKeys.forEach(key => (current[key] = unref(current._getValue(key))));
    }
    let result = [...pre, current];
    if (current.children) result = [...result, ...filterFlatData(current.children)];

    return result;
  }, [] as Recordable[]);
};
