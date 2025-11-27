<script setup lang="ts">
import type { TableColumnTypeInfo, TableColumnTypeNamespace } from "../types/table-column-type";
import type { TableRenderParams, TableColumn, TableScope } from "../types";
import { ref, watch, toValue, h } from "vue";
import { ElRadio, ElTableColumn } from "element-plus";
import { isFunction } from "@/common/utils";
import { lastProp } from "@/components/pro/helper";
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
 * 获取 column.prop（解决 undefined 报错）
 */
const prop = (column: TableColumn) => column.prop || "";

/**
 * 获取 Render/插槽 的参数
 */
const getRenderParams = (scope: TableScope, column: TableColumn) => {
  return {
    ...scope,
    rowIndex: scope.$index,
    column: { ...scope.column, ...column },
    label: toValue(column.label),
    value: "",
    displayValue: "",
    options: [],
  } as TableRenderParams;
};

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
      <!-- 自定义表头的 Render 函数 -->
      <component v-if="column.renderHeader" :is="column.renderHeader(getRenderParams(scope, column))" />
      <!-- 自定义 renderHeaderHTML 函数渲染，返回 HTML 格式 -->
      <span v-else-if="column.renderHeaderHTML" v-html="column.renderHeaderHTML(getRenderParams(scope, column))" />
      <!-- 自定义表头插槽 -->
      <slot
        v-else-if="$slots[`${lastProp(prop(column))}-header`]"
        :name="`${lastProp(prop(column))}-header`"
        v-bind="getRenderParams(scope, column)"
      />
      <!-- 自定义表头内容渲染 -->
      <template v-else-if="column.formatLabel">
        {{ column.formatLabel(toValue(column.label), getRenderParams(scope, column)) }}
      </template>
      <!-- 默认表头内容渲染 -->
      <template v-else>{{ toValue(column.label) }}</template>
    </template>

    <!-- 功能列 - 默认插槽 -->
    <template #default="scope">
      <component v-if="column.render" :is="column.render(getRenderParams(scope, column))" />
      <component
        v-else-if="tableColumnTypeMap[column.type].render"
        :is="tableColumnTypeMap[column.type].render?.(getRenderParams(scope, column))"
      />
      <slot v-else-if="$slots[column.type]" :name="column.type" v-bind="getRenderParams(scope, column)" />
    </template>

    <!-- 功能列 - 自定义插槽 -->
    <template v-for="slot in tableColumnTypeMap[column.type].slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </component>
</template>
