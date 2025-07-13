<script setup lang="ts">
import type { TableColumnTypeInfo, TableColumnTypeNamespace } from "../types/table-column-type";
import { ref, watch, toValue, h } from "vue";
import { ElRadio, ElTableColumn } from "element-plus";
import { isFunction } from "@/common/utils";
import { TableColumnTypeEnum } from "../helper";
import TableColumnDragSort from "./table-column-drag-sort.vue";

defineOptions({ name: "TableColumnType" });

const props = withDefaults(defineProps<TableColumnTypeNamespace.Props>(), {
  column: () => ({}),
  radioProps: () => ({}),
  selectedRadio: "",
  rowKey: "id",
  elTableInstance: undefined,
});

const emits = defineEmits<TableColumnTypeNamespace.Emits>();

const radio = ref("");

watch(
  () => props.selectedRadio,
  newValue => (radio.value = toValue(newValue)),
  { immediate: true }
);

// 功能列：多选列、单选列、序号列、展开列、拖拽排序列 等
const tableColumnTypeMap: Record<TableColumnTypeEnum, TableColumnTypeInfo> = {
  [TableColumnTypeEnum.Selection]: { el: ElTableColumn, props: { reserveSelection: true } },
  [TableColumnTypeEnum.Radio]: {
    el: ElTableColumn,
    render: ({ row, $index }) =>
      h(ElRadio, {
        modelValue: radio.value,
        value: row[getRowKey(row)],
        onChange: () => handleRadioChange(row, $index),
        ...toValue(props.radioProps),
      }),
  },
  [TableColumnTypeEnum.Index]: { el: ElTableColumn },
  [TableColumnTypeEnum.Expand]: { el: ElTableColumn },
  [TableColumnTypeEnum.Sort]: {
    el: TableColumnDragSort,
    props: {
      // 行拖拽排序结束事件
      onDragSortEnd: (newIndex: number, oldIndex: number) => {
        emits("dragSortEnd", newIndex, oldIndex);
      },
    },
    slots: ["drag-sort-icon"],
  },
};

const columnTypes = Object.keys(tableColumnTypeMap);

/**
 * 获取表格行的唯一标识
 */
const getRowKey = (row: Recordable) => {
  const { rowKey } = props;
  if (isFunction(rowKey)) return rowKey(row);
  return rowKey;
};

const handleRadioChange = (row: Recordable, index: number) => {
  radio.value = row[getRowKey(row)];
  emits("radioChange", row, index);
};
</script>

<template>
  <component
    v-if="column.type && columnTypes.includes(column.type)"
    :is="tableColumnTypeMap[column.type].el"
    v-bind="{
      ...column,
      ...tableColumnTypeMap[column.type].props,
      ...(column.type === TableColumnTypeEnum.Sort ? { tableInstance: elTableInstance } : {}),
    }"
    :align="column.align ?? 'center'"
  >
    <!-- 功能列 - 表头插槽 -->
    <template #header="scope">
      <component v-if="column.headerRender" :is="column.headerRender" v-bind="scope"></component>
      <slot v-else :name="`${column.type}-header`" v-bind="scope">{{ scope.column.label }}</slot>
    </template>

    <!-- 功能列 - 默认插槽 -->
    <template #default="scope">
      <component v-if="tableColumnTypeMap[column.type].render" :is="tableColumnTypeMap[column.type].render?.(scope)" />
      <component v-else-if="column.render" :is="column.render" v-bind="scope" />
      <slot v-else-if="$slots[column.type]" :name="column.type" v-bind="scope" />
    </template>

    <!-- 功能列 - 自定义插槽 -->
    <template v-for="slot in tableColumnTypeMap[column.type].slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </component>
</template>
