import type { CheckboxGroupValueType } from "element-plus";
import type { OptionsMapType } from "@/components/pro/use-options";
import type { ElOption } from "@/components/pro/form-item";
import type { ExportProps, TableColumn } from "../types";
import { ref, unref, defineComponent, watch, h, toValue } from "vue";
import { ElMessageBox, ElMessage, ElCheckboxGroup, ElCheckbox } from "element-plus";
import { exportJsonToExcel, formatJsonToArray, isArray } from "@/common/utils";
import { filterOptions, filterOptionsValue, getObjectKeys, getProp, setProp } from "@/components/pro/helper";

interface ExportExcelOptions {
  /** 列配置 */
  columns?: TableColumn[];
  /** 导出数据 */
  data?: Recordable[];
  /** 字典枚举 */
  optionsMap?: OptionsMapType;
  /** 导出额外配置 */
  exportProps?: ExportProps;
}

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
export const exportExcel = async (options: ExportExcelOptions = {}) => {
  const { exportProps = {} } = options;

  const { mode = "label" } = exportProps;
  if (mode === "label") return exportExcelByLabel(options);
  if (mode === "prop") return exportExcelByProp(options);
  if (mode === "dataKey") return exportExcelByDataKey(options);

  ElMessage.error("exportKey 格式错误或不能为空");
};

/**
 * 导出为 Excel，表头为 Label
 */
export const exportExcelByLabel = async (options: ExportExcelOptions = {}) => {
  const { columns = [], data = [], exportProps = {} } = options;
  const {
    fileName = `${defaultFileName}-${new Date().getTime()}`,
    title = defaultConfirmTitle,
    options: elMessageBoxOptions,
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
    elMessageBoxOptions,
    appContext
  );

  const tHeader = [] as string[];
  const propName = [] as string[];

  const flatData = filterFlatData(data, options);

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
export const exportExcelByProp = async (options: ExportExcelOptions = {}) => {
  const { columns = [], data = [], exportProps = {} } = options;
  const {
    fileName = `${defaultFileName}-${new Date().getTime()}`,
    title = defaultConfirmTitle,
    options: elMessageBoxOptions,
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
    elMessageBoxOptions,
    appContext
  );

  const tHeader = [] as string[];
  const propName = [] as string[];

  const flatData = filterFlatData(data, options);

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
export const exportExcelByDataKey = async (options: ExportExcelOptions = {}) => {
  const { data = [], exportProps = {} } = options;
  const {
    fileName = `${defaultFileName}-${new Date().getTime()}`,
    title = defaultConfirmTitle,
    options: elMessageBoxOptions,
    appContext,
  } = exportProps;
  const flatData = filterFlatData(data, options);
  const keys = getObjectKeys(flatData[0]).filter(key => !key.startsWith("_"));
  const exportItem = ref<CheckboxGroupValueType>(keys);

  await ElMessageBox.confirm(
    h(CheckboxGroupModal, {
      initialValue: exportItem.value,
      columns: keys,
      onChange: (value: CheckboxGroupValueType) => (exportItem.value = value),
    }),
    title,
    elMessageBoxOptions,
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
 * 扁平化 data，data 可能有 children 属性
 */
const filterFlatData = (data: Recordable[], options: ExportExcelOptions = {}) => {
  const { columns = [], optionsMap } = options;

  return data.reduce((pre: Recordable[], current) => {
    if (optionsMap?.keys) {
      columns.forEach(column => {
        const prop = column.prop || "";
        const options = unref(optionsMap?.get(prop));

        if (!options) return;

        const targetValue = getValue(current, column, options);
        setProp(current, column.prop || "", targetValue);
      });
    }

    let result = [...pre, current];
    if (current.children) result = [...result, ...filterFlatData(current.children)];

    return result;
  }, [] as Recordable[]);
};

/**
 * 获取当前列的字典 label 值（通过 value 找 label）
 */
const getValue = (row: Recordable, column: TableColumn, options?: ElOption[]) => {
  const { optionField, transformOption } = column;
  const value = getProp(row, column.prop || "");

  if (!options) return value;

  const option = transformOption ? transformOption(value, options, row) : filterOptions(value, options, optionField);
  const label = option ? filterOptionsValue(option, optionField?.label || "label", "") : "";

  if (!label) return "";
  return isArray(label) ? label.join(" / ") : label;
};
