<script setup lang="ts">
import type { TableInstance } from "element-plus";
import type { TableHeadColumnSettingEmits, TableHeadColumnSettingProps } from "../types";
import { ElTable, ElTableColumn, ElDrawer, ElSwitch } from "element-plus";
import { useNamespace } from "@/composables";
import TableColumnDragSort from "../table-column/table-column-drag-sort.vue";

defineOptions({ name: "TableHeadColumnSetting" });

const props = withDefaults(defineProps<TableHeadColumnSettingProps>(), {
  columns: () => [],
  columnSetting: () => ({}),
  emptyText: "暂无可配置列",
});

const emits = defineEmits<TableHeadColumnSettingEmits>();

const ns = useNamespace("pro-table-head-column-setting");

const visible = defineModel({ default: false });

const elTableInstance = useTemplateRef<TableInstance>("elTableInstance");

const open = () => {
  visible.value = true;
};

const close = () => {
  visible.value = false;
};

/**
 * 拖拽排序结束事件
 */
const handleDragSortEnd = (newIndex: number, oldIndex: number) => {
  emits("dragSortEnd", newIndex, oldIndex);
};

console.log(props.columns);
defineExpose({ open, close });
</script>

<template>
  <el-drawer v-model="visible" title="列设置" :size="450" :class="ns.b()">
    <el-table ref="elTableInstance" :data="columns" :border="true" row-key="prop">
      <TableColumnDragSort
        v-if="!columnSetting.hideDragSort"
        :table-instance="elTableInstance"
        label="排序"
        align="center"
        @drag-sort-end="handleDragSortEnd"
      >
        <template #drag-sort-icon>☷</template>
      </TableColumnDragSort>

      <el-table-column prop="label" align="center" label="列名" />

      <el-table-column v-if="!columnSetting.hideHidden" v-slot="{ row }" prop="hidden" align="center" label="显示">
        <el-switch
          v-model="row.hidden"
          :active-value="false"
          :inactive-value="true"
          :disabled="row.disabledHidden ?? columnSetting.disabledHidden"
        />
      </el-table-column>

      <el-table-column v-if="!columnSetting.hideSortable" v-slot="{ row }" prop="sortable" align="center" label="排序">
        <el-switch
          v-model="row.sortable"
          :disabled="row.type || (row.disabledSortable ?? columnSetting.disabledSortable)"
        />
      </el-table-column>

      <el-table-column v-if="!columnSetting.hideFilter" v-slot="{ row }" prop="filter" align="center" label="筛选">
        <el-switch v-model="row.filter" :disabled="row.type || (row.disabledFilter ?? columnSetting.disabledFilter)" />
      </el-table-column>

      <template #empty>
        <div :class="ns.e('empty')">
          <img src="@/common/assets/images/notData.png" alt="notData" />
          <div>{{ emptyText }}</div>
        </div>
      </template>
    </el-table>
  </el-drawer>
</template>
