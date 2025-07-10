<script setup lang="ts">
import type { ProTableHeadNamespace, SizeStyle, TableColumn } from "./types";
import { ElTooltip, ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElPopover, ElCheckbox } from "element-plus";
import { Coin, Operation, Download, Setting, Refresh } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { flatColumnsFn } from "@/components/pro/helper";
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

// 列配置需要的列
const settingColumns = computed(() => {
  return props.columns
    .filter(column => !hasSpecialColumn(column))
    .map(column => {
      column.hidden ??= false;
      column.filterProps ??= {};
      return { ...column, children: undefined };
    });
});

const { columnSettingVisible, toggleColumnSetting } = useColumnSetting();
const { handleRefresh, handleSizeCommand, handleExport, handleDragSortEnd } = useButtonEvent();

/**
 * 列配置抽屉
 */
function useColumnSetting() {
  // 列配置抽屉状态
  const columnSettingVisible = ref(false);

  /**
   * 切换列配置抽屉的显示状态
   */
  const toggleColumnSetting = (show = !columnSettingVisible.value) => (columnSettingVisible.value = show);

  return { columnSettingVisible, toggleColumnSetting };
}

/**
 * 按钮点击事件
 */
function useButtonEvent() {
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
   * 列配置拖拽事件
   */
  const handleDragSortEnd = (newIndex: number, oldIndex: number) => {
    const { columns } = props;

    const partColumns = columns.slice(0, Math.max(oldIndex, newIndex));
    const specialColumnsLength = partColumns.filter(column => hasSpecialColumn(column)).length;

    if (specialColumnsLength) {
      const [removedItem] = columns.splice(oldIndex + specialColumnsLength, 1);
      columns.splice(newIndex + specialColumnsLength, 0, removedItem);
    } else {
      const [removedItem] = columns.splice(oldIndex, 1);
      columns.splice(newIndex, 0, removedItem);
    }
  };

  return { handleRefresh, handleSizeCommand, handleExport, handleDragSortEnd };
}

/**
 * 是否含有特殊列（多选列、单选列）
 */
const hasSpecialColumn = (column: TableColumn) =>
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
