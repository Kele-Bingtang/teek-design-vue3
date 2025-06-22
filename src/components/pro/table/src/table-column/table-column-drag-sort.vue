<script setup lang="ts">
import type { TableColumnDragSortProps, TableColumnDragSortEmits } from "../types";
import { ElTableColumn, ElIcon } from "element-plus";
import Sortable from "sortablejs";
import { DCaret } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "TableColumnDragSort" });

const props = withDefaults(defineProps<TableColumnDragSortProps>(), {
  sortable: true,
  tableInstance: undefined,
});

const emits = defineEmits<TableColumnDragSortEmits>();

const ns = useNamespace("table-column-drag-sort");

onMounted(() => {
  if (props.tableInstance && props.sortable) dragSort();
});

watch(
  () => props.tableInstance,
  val => {
    if (val && props.sortable) dragSort();
  }
);

// 拖拽排序
const dragSort = () => {
  const tbody = unref(props.tableInstance)?.$el?.querySelector(
    `.${ns.elNamespace}-table__body-wrapper tbody`
  ) as HTMLElement;
  if (!tbody) return;

  Sortable.create(tbody, {
    handle: `.${ns.e("icon")}`,
    animation: 300,
    group: "table-column",
    easing: "cubic-bezier(1, 0, 0, 1)",
    chosenClass: "table-column-sortable-chosen",
    onEnd({ newIndex, oldIndex }) {
      if (newIndex !== undefined && oldIndex !== undefined) {
        emits("dragSortEnd", newIndex, oldIndex);
      }
    },
  });
};
</script>

<template>
  <el-table-column width="60" v-bind="$attrs">
    <span :class="ns.e('icon')" style="cursor: move">
      <slot name="drag-sort-icon">
        <el-icon><DCaret /></el-icon>
      </slot>
    </span>
  </el-table-column>
</template>
