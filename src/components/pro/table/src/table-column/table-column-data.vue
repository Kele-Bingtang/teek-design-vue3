<script setup lang="ts">
import type { TableScope, TableColumn, TableColumnDataNamespace, TableRenderParams } from "../types";
import type { ProFormInstance } from "@/components/pro/form";
import { toValue, computed, unref } from "vue";
import { ElTableColumn, ElTooltip, ElIcon } from "element-plus";
import { QuestionFilled } from "@element-plus/icons-vue";
import { isArray, isBoolean, isString, isFunction } from "@/common/utils";
import { filterOptions, filterOptionsValue, getProp, lastProp } from "@/components/pro/helper";
import { useNamespace } from "@/composables";
import { formatCellValue, initTableColumn } from "../helper";
import TableFilter from "../plugins/table-filter.vue";
import TableEdit from "../plugins/table-edit.vue";
import ElDisplay from "../plugins/el-display.vue";

import "../styles/table-column-data.scss";

defineOptions({ name: "TableColumnData" });

const props = withDefaults(defineProps<TableColumnDataNamespace.Props>(), {
  editable: false,
  optionsMap: undefined,
});

const emits = defineEmits<
  TableColumnDataNamespace.Emits & {
    registerProFormInstance: [index: number, prop: string, instance: ProFormInstance | null];
  }
>();

const ns = useNamespace("pro-table-column-data");

const tooltipValue = computed(() => toValue(props.column.tooltip));

const useEditable = computed(() => {
  const editableValue = toValue(props.editable);

  return !isBoolean(editableValue) && ["click", "dblclick"].includes(editableValue);
});

/**
 * 获取 ProFormItem 的实例
 */
const registerProFormInstance = (el: InstanceType<typeof TableEdit>, scope: Recordable, prop: string) => {
  if (!el) return;

  handleRegisterProFormInstance(scope.$index, prop, el.proFormInstance);

  scope.row._proFormInstance ??= {};
  if (!scope.row._proFormInstance[prop]?.elFormInstance) scope.row._proFormInstance[prop] = el.proFormInstance;
};

/**
 * 获取 column.prop（解决 undefined 报错）
 */
const prop = (column: TableColumn) => column.prop || "";

/**
 *获取列的字典数据
 */
const getOptions = (column: TableColumn) => {
  const { optionsProp } = column;
  const p = prop(column);

  return unref(props.optionsMap?.get(optionsProp ?? p));
};

/**
 * 获取当前列的字典 label 值（通过 value 找 label）
 */
const getValue = (row: TableScope["row"], column: TableColumn) => {
  const { optionField, transformOption, ignoreOptionIfAbsent, isFilterOptions = true } = column;
  const p = prop(column);
  const options = getOptions(column);
  const value = getProp(row, p);

  if (!options || !toValue(isFilterOptions)) return value;

  const option = transformOption ? transformOption(value, options, row) : filterOptions(value, options, optionField);
  const label = option ? filterOptionsValue(option, optionField?.label || "label") : "--";

  if ((!label || label === "--") && toValue(ignoreOptionIfAbsent)) return value;
  return isArray(label) ? label.join(" / ") : label;
};

/**
 * 获取单元格值（原始值）
 */
const getOriginValue = (scope: TableScope, column: TableColumn) => getProp(scope.row, prop(column));
/**
 * 获取单元格值（如果存在 options，则返回根据 label 找对应的 value，如果不存在 options，则返回原始值）
 */
const getDisplayValue = (scope: TableScope, column: TableColumn) =>
  getValue(scope.row, column) ?? getOriginValue(scope, column);
/**
 * 获取 Render/插槽 的参数
 */
const getRenderParams = (scope: TableScope, column: TableColumn) => {
  return {
    ...scope,
    rowIndex: scope.$index,
    column: { ...scope.column, ...column },
    label: column.label,
    value: getOriginValue(scope, column), // 如果是 renderHeader 函数，则不存在 row，因此为 undefined
    displayValue: getDisplayValue(scope, column),
    options: getOptions(column),
  } as TableRenderParams;
};
/**
 * 格式化单元格值
 */
const formatValue = (value: unknown, scope: TableScope, column: TableColumn) => {
  const { formatValue } = column;

  return formatCellValue(formatValue?.(value, getRenderParams(scope, column)) ?? value);
};

/**
 * emits 事件相关逻辑
 */
const handleRegisterProFormInstance = (index: number, prop: string, instance: ProFormInstance | null) => {
  emits("registerProFormInstance", index, prop, instance);
};

/**
 * 执行过滤搜索
 */
const handleFilter = (filterValue: unknown, prop: string) => {
  emits("filter", filterValue, prop);
};

/**
 * 执行过滤清除
 */
const handleFilterClear = (prop: string) => {
  emits("filterClear", prop);
};

/**
 * 执行过滤重置
 */
const handleFilterReset = () => {
  emits("filterReset");
};

/**
 * 表单值发生改变事件
 */
const handleChange = (value: unknown, scope: Recordable, column: TableColumn) => {
  emits("formChange", value, prop(column), {
    ...scope,
    rowIndex: scope.$index,
    column: { ...scope.column, column },
  } as TableScope);
};

/**
 * 表单值发生改变事件（多级表头调用当前组件 handleChange 事件）
 */
const handleFormChange = (model: unknown, props: TableColumn["prop"], scope: TableScope) => {
  emits("formChange", model, props || "", scope);
};
</script>

<template>
  <el-table-column
    v-bind="{ ...$attrs, ...initTableColumn(column), sortable: column.sortable }"
    :class-name="`${ns.b()}${' ' + ns.is('cell-edit', useEditable)}${column.className ? ' ' + column.className : ''}`"
  >
    <!-- 表头插槽 - 表头内容 -->
    <template #header="scope">
      <slot name="header-before" />

      <!-- 自定义表头的 Render 函数 -->
      <component v-if="column.renderHeader" :is="column.renderHeader(getRenderParams(scope, column))" />
      <!-- 自定义 renderHeaderHTML 函数渲染，返回 HTML 格式 -->
      <span v-else-if="column.renderHeaderHTML" v-html="column.renderHeaderHTML(getRenderParams(scope, column))" />
      <!-- 自定义表头插槽 -->
      <slot
        v-else-if="$slots[`${lastProp(prop(column))}-header`]"
        :name="`${lastProp(prop(column))}-header`"
        v-bind="getRenderParams(scope, column)"
        :label="toValue(column.label)"
      />
      <!-- 自定义表头内容渲染 -->
      <template v-else-if="column.formatLabel">
        {{ column.formatLabel(toValue(column.label), getRenderParams(scope, column)) }}
      </template>
      <!-- 默认表头内容渲染 -->
      <template v-else>{{ toValue(column.label) }}</template>

      <el-tooltip v-if="isString(tooltipValue)" placement="top" effect="dark" :content="tooltipValue">
        <slot name="tooltip-icon">
          <el-icon><QuestionFilled /></el-icon>
        </slot>
      </el-tooltip>

      <el-tooltip
        v-else-if="tooltipValue"
        placement="top"
        effect="dark"
        v-bind="{ ...tooltipValue, render: undefined, contentRender: undefined }"
      >
        <!-- ElToolTip 默认插槽 -->
        <component v-if="tooltipValue.render" :is="tooltipValue.render()" />
        <!-- ElToolTip content 插槽 -->
        <template v-if="tooltipValue.contentRender" #content>
          <component v-if="tooltipValue.contentRender" :is="tooltipValue.contentRender()" />
        </template>
        <!-- ElToolTip icon -->
        <slot name="tooltip-icon">
          <el-icon><QuestionFilled /></el-icon>
        </slot>
      </el-tooltip>

      <!-- 表头筛选 -->
      <TableFilter
        v-if="column.filter"
        v-bind="column.filterProps"
        :prop="column.filterProps?.prop || column.prop"
        :options="optionsMap?.get(prop(column))"
        :option-field="column.optionField"
        @filter="handleFilter"
        @clear="handleFilterClear"
        @reset="handleFilterReset"
      >
        <template v-if="$slots['filter-icon']" #filter-icon>
          <slot name="filter-icon" />
        </template>
        <template v-if="$slots['filter-button']" #filter-button="scope">
          <slot name="filter-button" v-bind="scope" />
        </template>
      </TableFilter>

      <slot name="header-after" />
    </template>

    <!-- 默认插槽 - 单元格内容 -->
    <template #default="scope">
      <!-- 合并表头 -->
      <template v-if="column.children">
        <TableColumnData
          v-for="child in column.children"
          :key="child.prop"
          :column="child"
          :width="toValue(column.width)"
          :label="toValue(column.label)"
          :align="column.align || 'center'"
          :editable
          @register-pro-form-instance="handleRegisterProFormInstance"
          @form-change="handleFormChange"
          @filter="handleFilter"
          @filter-clear="handleFilterClear"
          @filter-reset="handleFilterReset"
        />
      </template>

      <!-- 单元格编辑 -->
      <TableEdit
        v-else-if="
          editable === true || // 表格整体编辑
          column.editable || // 单列整体编辑
          scope.row._editable || // 单行整体编辑
          getProp(scope.row?._editableCol, prop(column)) // 单元格编辑，支持多级 prop
        "
        :ref="(el: any) => registerProFormInstance(el, scope, prop(column))"
        v-bind="column.editProps"
        :value="getOriginValue(scope, column)"
        :prop="column.editProps?.prop || prop(column)"
        :options="column.editProps?.options || getOptions(column)"
        :option-field="column.editProps?.optionField || column.optionField"
        @change="value => handleChange(value, scope, column)"
      />

      <!-- 自定义 Render 函数渲染 -->
      <component
        v-else-if="column.render"
        :is="column.render(getRenderParams(scope, column))"
        v-bind="{ ...column.elProps }"
      />
      <!-- 自定义 RenderHtml 函数渲染，返回 HTML 格式 -->
      <span v-else-if="column.renderHTML" v-html="column.renderHTML(getRenderParams(scope, column))" />
      <!-- 自定义插槽，插槽名为 column.prop -->
      <slot
        v-else-if="$slots[lastProp(prop(column))]"
        :name="lastProp(prop(column))"
        v-bind="getRenderParams(scope, column)"
      />

      <!-- 自定义 el 组件 -->
      <ElDisplay
        v-else-if="column.el"
        :origin-value="getProp(scope.row, column.prop || '')"
        :display-value="getDisplayValue(scope, column)"
        :el="column.el"
        :el-props="isFunction(column.elProps) ? column.elProps(scope.row) : column.elProps"
        :options="getOptions(column)"
        :option-field="column.optionField"
      >
        <template v-for="(slot, key) in column.elSlots" :key="key" #[key]="data">
          <component :is="slot" v-bind="{ ...getRenderParams(scope, column), ...data }" />
        </template>

        <template #value="{ value }">
          {{ formatValue(value, scope, column) }}
        </template>
      </ElDisplay>

      <!-- 默认 -->
      <template v-else>{{ formatValue(getDisplayValue(scope, column), scope, column) }}</template>
    </template>
  </el-table-column>
</template>
