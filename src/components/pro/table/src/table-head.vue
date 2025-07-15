<script setup lang="ts">
import type { ProTableHeadNamespace, SizeStyle, TableColumn } from "./types";
import { ref, computed, onMounted } from "vue";
import { ElTooltip, ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElPopover, ElCheckbox } from "element-plus";
import { Coin, Operation, Download, Setting, Refresh } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { TableColumnTypeEnum, TableSizeEnum, ToolButtonEnum } from "./helper";
import { exportExcel } from "./plugins/table-head-export";
import TableHeadColumnSetting from "./plugins/table-head-column-setting.vue";

import "./styles/table-head.scss";

defineOptions({ name: "TableHead" });

const props = withDefaults(defineProps<ProTableHeadNamespace.Props>(), {
  data: () => [],
  columns: () => [],
  toolButton: () => ["size", "export", "columnSetting", "baseSetting"],
  disabledToolButton: () => [],
  size: () => TableSizeEnum.Default,
  title: "",
  exportProps: () => ({}),
  tooltipProps: () => ({ placement: "top", effect: "light" }),
  sizeStyle: () => ({}),
  columnSetting: () => ({}),
  baseSetting: () => ({}),
  isSelected: undefined,
  selectedList: undefined,
  selectedListIds: undefined,
  operationProp: "operation",
});

const emits = defineEmits<ProTableHeadNamespace.Emits>();

const ns = useNamespace("pro-table-head");

// 密度值
const tableSize = ref<TableSizeEnum>((props.size as TableSizeEnum) || TableSizeEnum.Default);

// 密度样式 Map
const sizeStyleMap = computed<Record<TableSizeEnum, SizeStyle>>(() => {
  return {
    [TableSizeEnum.Default]: {
      cellStyle: {},
      rowStyle: {},
      headerCellStyle: {},
      ...props.sizeStyle[TableSizeEnum.Default],
    },
    [TableSizeEnum.Large]: {
      cellStyle: {},
      rowStyle: {},
      headerCellStyle: {},
      ...props.sizeStyle[TableSizeEnum.Large],
    },
    [TableSizeEnum.Small]: {
      cellStyle: {},
      rowStyle: { height: "40px" },
      headerCellStyle: { height: "40px" },
      ...props.sizeStyle[TableSizeEnum.Small],
    },
    [TableSizeEnum.Mini]: {
      cellStyle: { padding: "0" },
      rowStyle: { height: "24px", fontSize: "12px" },
      headerCellStyle: { height: "24px", fontSize: "12px", padding: "0" },
      ...props.sizeStyle[TableSizeEnum.Mini],
    },
  };
});

const { columnSettingVisible, settingColumns, toggleColumnSetting } = useColumnSetting();
const { handleDragSortEnd } = useDragSort();

/**
 * 列配置抽屉
 */
function useColumnSetting() {
  // 列配置抽屉状态
  const columnSettingVisible = ref(false);

  // 列配置需要的列
  const settingColumns = computed(() => {
    return props.columns
      .filter(column => !hasSpecialColumnType(column))
      .map(column => {
        // 禁用操作列的排序和筛选
        if (column.prop === props.operationProp) {
          column.disabledFilter = true;
          column.disabledSortable = true;
          column.disabledDragSort = true;
        }
        return column;
      });
  });

  /**
   * 切换列配置抽屉的显示状态
   */
  const toggleColumnSetting = (show = !columnSettingVisible.value) => (columnSettingVisible.value = show);

  return { columnSettingVisible, settingColumns, toggleColumnSetting };
}

/**
 * 列配置列拖拽排序
 */
function useDragSort() {
  /**
   * 列配置拖拽事件，支持嵌套 children
   *
   * @remark 原理简述
   * 1. 从 0 循环 columns，如果找到 oldIndex，则返回该列，如果循环过程的列有 children，则递归处理 children，直到循环次数等于 oldIndex
   * 2. 拿到从 oldIndex 获取的列，从 0 循环 columns，如果找到 newIndex，则插入该列，如果循环过程的列有 children，则递归处理 children，直到循环次数等于 newIndex
   */
  const handleDragSortEnd = (newIndex: number, oldIndex: number) => {
    const { columns } = props;

    // 获取拖拽范围的列，计算特殊列的数量
    const partColumns = columns.slice(0, Math.max(oldIndex, newIndex));
    // 计算特殊列的数量，这些特殊列不参与排序，但是在 columns 中，因此需要加上特殊列数量，避免索引错乱
    const specialColumnsLength = partColumns.filter(column => hasSpecialColumnType(column)).length;

    const removedIndex = oldIndex + specialColumnsLength;
    const insertIndex = newIndex + specialColumnsLength;

    // 移除指定索引的列，支持嵌套 children
    const removedItem = removeIndexColumn(removedIndex, columns);

    if (removedItem) {
      // 当后面的列拖拽到前面时，且拖拽的是一个有 children 的列，需要减去该列长度，避免索引错乱
      const realInsertIndex =
        insertIndex > removedIndex ? insertIndex - getColumnLength(removedItem.children || []) : insertIndex;
      // 插入指定索引的列，支持嵌套 children
      insertIndexColumn(realInsertIndex, columns, removedItem);
    }
  };

  /**
   * 查找某个 index 所在的列及其父数组
   * @param index 目标索引
   * @param columns 列数组
   * @returns 包含 target（目标列）、parentArray（所在父数组）和 index（在父数组中的位置）
   */
  const findColumnByIndex = (
    index: number,
    columns: TableColumn[]
  ): { target?: TableColumn; parentArray: TableColumn[]; index: number } | undefined => {
    let currIndex = index;

    const traverse = (cols: TableColumn[], parentArray: TableColumn[] = cols): any => {
      for (let i = 0; i < cols.length; i++) {
        if (currIndex === 0) return { target: cols[i], parentArray, index: i };

        currIndex -= 1;

        if (cols[i].children?.length) {
          const result = traverse(cols[i].children!, cols[i].children!);
          if (result) return result;
        }
      }
      return undefined;
    };

    return traverse(columns, columns);
  };

  /**
   * 移除指定索引的列并返回被移除的列，支持嵌套 children
   */
  const removeIndexColumn = (index: number, columns: TableColumn[]): TableColumn | undefined => {
    const result = findColumnByIndex(index, columns);
    if (result?.parentArray && result?.index !== undefined) {
      return result.parentArray.splice(result.index, 1)[0];
    }
    return undefined;
  };

  /**
   * 在指定索引插入列，支持嵌套 children
   */
  const insertIndexColumn = (index: number, columns: TableColumn[], item: TableColumn): boolean => {
    // 如果 index 是 0，则直接插入到最前面
    if (index === 0) {
      columns.splice(0, 0, item);
      return true;
    }

    const result = findColumnByIndex(index - 1, columns);
    if (result?.parentArray && result?.index !== undefined) {
      result.parentArray.splice(result.index + 1, 0, item);
      return true;
    }
    return false;
  };

  /**
   * 获取所有子列的长度（递归计算嵌套 children）
   */
  const getColumnLength = (columns: TableColumn[]) => {
    let length = 0;

    for (const column of columns) {
      if (column.children?.length) length += getColumnLength(column.children) + 1;
      else length += 1;
    }
    return length;
  };

  return { handleDragSortEnd };
}

const handleRefresh = () => {
  emits("refresh");
};

/**
 * 表格密度修改
 */
const handleSizeCommand = (command: TableSizeEnum) => {
  tableSize.value = command;
  const tableSizeStyle = sizeStyleMap.value[command];

  emits("sizeChange", tableSize.value, tableSizeStyle);
};

/**
 * 表格导出
 */
const handleExport = () => {
  const { data, columns, exportProps } = props;

  if (exportProps.exportFile) return exportProps.exportFile(data);
  exportExcel(columns, data, exportProps);
};

/**
 * 是否含有特殊列（多选列、单选列）
 */
const hasSpecialColumnType = (column: TableColumn) =>
  [TableColumnTypeEnum.Selection, TableColumnTypeEnum.Radio].includes(column.type as TableColumnTypeEnum);

/**
 * 控制 ToolButton 显示
 */
const showToolButton = (key: ToolButtonEnum) => {
  const { toolButton } = props;

  if (!toolButton) return false;
  return toolButton === true || toolButton.includes(key);
};

onMounted(() => {
  // 初始化尺寸
  handleSizeCommand(tableSize.value);
});

const expose = { sizeCommand: handleSizeCommand, exportFile: handleExport, toggleColumnSetting };

defineExpose(expose);
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('left')">
      <slot
        name="head-left"
        :selected-list-ids="selectedListIds"
        :selected-list="selectedList"
        :is-selected="isSelected"
      >
        {{ title }}
      </slot>
    </div>

    <div v-if="toolButton" :class="ns.e('right')">
      <slot name="head-right">
        <slot name="head-right-before"></slot>

        <el-tooltip v-if="showToolButton(ToolButtonEnum.Refresh)" content="刷新" v-bind="tooltipProps">
          <el-button
            :disabled="disabledToolButton.includes(ToolButtonEnum.Refresh)"
            :icon="Refresh"
            @click="handleRefresh"
          />
        </el-tooltip>

        <el-tooltip v-if="showToolButton(ToolButtonEnum.Size)" content="密度" v-bind="tooltipProps">
          <el-dropdown @command="handleSizeCommand">
            <el-button :disabled="disabledToolButton.includes(ToolButtonEnum.Size)" :icon="Coin" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(value, key) in TableSizeEnum"
                  :key
                  :command="value"
                  :disabled="tableSize === value"
                >
                  {{ key }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>

        <el-tooltip v-if="showToolButton(ToolButtonEnum.Export)" content="导出" v-bind="tooltipProps">
          <el-button
            :disabled="disabledToolButton.includes(ToolButtonEnum.Export)"
            :icon="Download"
            @click="handleExport"
          />
        </el-tooltip>

        <el-tooltip
          v-if="showToolButton(ToolButtonEnum.ColumnSetting) && columns.length"
          content="列配置"
          v-bind="tooltipProps"
        >
          <el-button
            :disabled="disabledToolButton.includes(ToolButtonEnum.ColumnSetting)"
            :icon="Operation"
            @click="columnSettingVisible = true"
          />
        </el-tooltip>

        <el-popover placement="bottom" trigger="click">
          <template #reference>
            <div>
              <el-tooltip v-if="showToolButton(ToolButtonEnum.BaseSetting)" content="基础配置" v-bind="tooltipProps">
                <el-button :disabled="disabledToolButton.includes(ToolButtonEnum.BaseSetting)" :icon="Setting" />
              </el-tooltip>
            </div>
          </template>
          <div>
            <el-checkbox v-model="baseSetting.border" :value="true" :disabled="baseSetting.disabledBorder">
              边框
            </el-checkbox>
            <el-checkbox v-model="baseSetting.stripe" :value="true" :disabled="baseSetting.disabledStripe">
              斑马纹
            </el-checkbox>
            <el-checkbox v-model="baseSetting.showHeader" :value="true" :disabled="baseSetting.disabledShowHeader">
              表头
            </el-checkbox>
            <el-checkbox
              v-model="baseSetting.headerBackground"
              :value="true"
              :disabled="baseSetting.disabledHeaderBackground"
            >
              表头背景
            </el-checkbox>
            <el-checkbox
              v-model="baseSetting.highlightCurrentRow"
              :value="true"
              :disabled="baseSetting.disabledHighlightCurrentRow"
            >
              单击行高亮
            </el-checkbox>
          </div>
        </el-popover>

        <slot name="head-right-after"></slot>
      </slot>
    </div>

    <TableHeadColumnSetting
      v-model="columnSettingVisible"
      :columns="settingColumns"
      :column-setting
      @drag-sort-end="handleDragSortEnd"
    />
  </div>
</template>
