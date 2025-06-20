<script setup lang="ts">
import type { TableColumnCtx } from "element-plus";
import type { TableScope, TableColumn, TableColumnDataNamespace, TableRow } from "../types";
import type { ProFormInstance } from "@/components/pro/form";
import type { ModelBaseValueType } from "@/components/pro/form-item";
import { ElMessage, ElTableColumn, ElTooltip, ElIcon } from "element-plus";
import { QuestionFilled } from "@element-plus/icons-vue";
import { getProp } from "@/components/pro/form-item";
import { isBoolean } from "@/utils";
import { useNamespace } from "@/composables";
import { formatCellValue, lastProp } from "../helper";
import TableFilter from "../plugins/table-filter.vue";
import TableEdit from "../plugins/table-edit.vue";

import "../styles/table-column-data.scss";

defineOptions({ name: "TableColumnData" });

const props = withDefaults(defineProps<TableColumnDataNamespace.Props>(), {
  editable: false,
});

const emits = defineEmits<
  TableColumnDataNamespace.Emits & {
    registerProFormInstance: [index: number, prop: string, instance: ProFormInstance | null];
  }
>();

const ns = useNamespace("pro-table-column-data");

const useEditable = computed(() => !isBoolean(props.editable) && ["click", "dblclick"].includes(props.editable));

/**
 * 初始化表格的 row，添加编辑态开关的方法
 */
const initRowEditableApi = (row: TableRow) => {
  // 初始化 _editableCol
  row._editableCol ??= {};

  // 开启单元格编辑状态
  row._openCellEdit ??= prop => {
    if (prop) {
      row._editableCol![prop] = true;
      nextTick(() => {
        // 焦点聚焦
        (row._proFormInstance?.[prop]?.getElInstance(prop) as HTMLElement)?.focus();
      });
    } else row._editable = true;
  };
  // 关闭开启单元格编辑状态
  row._closeCellEdit ??= prop => {
    if (prop) row._editableCol![prop] = false;
    else row._editable = false;
  };

  // 判断当前单元格是否处于编辑状态
  row._isCellEdit ??= prop => {
    if (prop) return row._editableCol![prop] ?? false;
    else return row._editable ?? false;
  };

  // 编辑态行/单元格校验
  row._validateCellEdit ??= async (callback, prop) => {
    if (!row._proFormInstance) return true;

    try {
      // 校验失败会走 catch
      if (prop) await row._proFormInstance[prop].elFormInstance?.validate();
      else {
        const proFormInstances = Object.values(row._proFormInstance);
        await Promise.all(
          proFormInstances.map(async proFormInstance => {
            await proFormInstance.elFormInstance?.validate();
          })
        );
      }

      callback?.(true, undefined);
      return true;
    } catch (error) {
      // 如果校验失败且没有自定义 callback，则弹出内置错误信息
      if (!callback) {
        ElMessage.closeAll();
        ElMessage.warning(Object.values(error || { message: ["请完整填写表单然后再次提交！"] })[0][0].message);
      }

      callback?.(false, error as any);
      return false;
    }
  };
  // 获取 row 的纯数据（过滤掉内置的方法）
  row._getData ??= () => {
    return Object.fromEntries(Object.entries(row).filter(([key]) => !key.startsWith("_")));
  };
};

/**
 * 获取 ProFormItem 的实例
 */
const registerProFormInstance = (el: InstanceType<typeof TableEdit>, scope: Recordable, prop: string) => {
  if (!el) return;

  handleRegisterProFormInstance(scope.$index, prop, el.proFormInstance);

  scope.row._proFormInstance ??= {};
  if (!scope.row._proFormInstance[prop]?.elFormInstance) scope.row._proFormInstance[prop] = el.proFormInstance;
};

const formatTableColumn = (column: TableColumn) => {
  column.filter = toValue(column.filter);
  column.editable = toValue(column.editable);
  column.hide = toValue(column.hide);
  column.disabledHide = toValue(column.disabledHide);
  column.disabledFilter = toValue(column.disabledFilter);
  column.disabledSortable = toValue(column.disabledSortable);
  column.isFilterOptions = toValue(column.isFilterOptions);

  // 使用解构并排除 children 属性
  // eslint-disable-next-line no-unused-vars
  const { children, ...rest } = toRaw(column);

  return rest as unknown as TableColumnCtx<any>;
};

/**
 * 格式化单元格值（如果存在字典枚举，则根据 value 找 label）
 */
const formatValue = (row: TableRow, column: TableColumn) => {
  return formatCellValue(getProp(row._label?.[column.prop!] ?? row, column.prop!));
};

/**
 * 处理部分列配置项数据
 */
const toValueColumn = (column: Partial<TableColumn>) => {
  return {
    width: toValue(column.width),
    label: toValue(column.label),
  };
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
const handleFilter = (model: ModelBaseValueType, filterValue: unknown, prop: string | undefined) => {
  emits("filter", model as Recordable, filterValue, prop);
};

/**
 * 执行过滤清除
 */
const handleFilterClear = (prop: string | undefined) => {
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
const handleChange = (model: unknown, scope: Recordable, column: TableColumn) => {
  emits("formChange", model, column.prop || "", {
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
    v-bind="{ ...$attrs, ...formatTableColumn(column) }"
    :class-name="`${ns.b()}${' ' + ns.is('cell-edit', useEditable)}${column.className ? ' ' + column.className : ''}`"
  >
    <!-- 表头插槽 - 表头内容 -->
    <template #header="scope">
      <slot name="header-before" />

      <!-- 自定义表头 | 自定义插槽 -->
      <component v-if="column.headerRender" :is="column.headerRender(scope)" />
      <slot v-else :name="`${lastProp(column.prop!)}-header`" v-bind="scope">{{ column.label }}</slot>

      <el-tooltip v-if="column.tooltip" placement="top" effect="dark" v-bind="column.tooltip">
        <!-- ElToolTip 默认插槽 -->
        <component v-if="column.tooltip.render" :is="column.tooltip.render()" />
        <!-- ElToolTip content 插槽 -->
        <template v-if="column.tooltip.contentRender" #content>
          <component v-if="column.tooltip.contentRender" :is="column.tooltip.contentRender()" />
        </template>
        <!-- ElToolTip icon -->
        <slot name="tooltip-icon">
          <el-icon :size="16"><QuestionFilled /></el-icon>
        </slot>
      </el-tooltip>

      <!-- 表头筛选 -->
      <TableFilter
        v-if="column.filter"
        v-bind="column.filterProps"
        :prop="column.filterProps?.prop || column.prop"
        @filter="handleFilter"
        @clear="handleFilterClear"
        @reset="handleFilterReset"
      >
        <template v-if="$slots['filter-icon']" #filter-icon>
          <slot name="filter-icon" />
        </template>
        <template v-if="$slots['filter-button']" #filter-button>
          <slot name="filter-button" />
        </template>
      </TableFilter>

      <slot name="header-after" />
    </template>

    <!-- 默认插槽 - 单元格内容 -->
    <template #default="scope">
      <span v-if="!column.children" style="display: none">{{ initRowEditableApi(scope.row) }}</span>

      <!-- 合并表头 -->
      <template v-if="column.children">
        <TableColumnData
          v-for="child in column.children"
          :key="child.prop"
          :column="child"
          v-bind="toValueColumn(column)"
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
          scope.row._editableCol?.[column.prop!] || // 单元格编辑
          getProp(scope.row_editableCol, column.prop!) // 多级 prop 单元格编辑
        "
        :ref="(el: any) => registerProFormInstance(el, scope, column.prop!)"
        v-bind="column.editProps"
        :value="getProp(scope.row._label?.[column.prop!] ?? scope.row, column.prop!)"
        :prop="column.editProps?.prop || column.prop!"
        :options="column.editProps?.options || scope.row._options?.[column.prop!]"
        :option-field="column.editProps?.optionField || column.optionField"
        @change="model => handleChange(model, scope, column)"
      />

      <component
        v-else-if="column.render"
        :is="
          column.render(
            scope.row[column.prop!],
            { ...scope, rowIndex: scope.$index },
            scope.row._options?.[column.prop!]
          )
        "
      />
      <component
        v-else-if="column.renderHTML"
        :is="
          column.renderHTML(
            scope.row[column.prop!],
            { ...scope, rowIndex: scope.$index },
            scope.row._options?.[column.prop!]
          )
        "
      />
      <slot
        v-else-if="$slots[lastProp(column.prop!)]"
        :name="lastProp(column.prop!)"
        v-bind="{ ...scope, options: scope.row._options?.[column.prop!] }"
      />

      <template v-else>
        {{ formatValue(scope.row, column) }}
      </template>
    </template>
  </el-table-column>
</template>
