<script setup lang="ts">
import type { TableColumnProps, TypeProps } from "../interface";
import type { TableColumnCtx } from "element-plus";
import { inject, useTemplateRef } from "vue";
import { ElTable, ElButton, ElTableColumn, ElPopconfirm, ElTag, ElIcon } from "element-plus";
import { Edit, Delete, DCaret } from "@element-plus/icons-vue";
import TableColumn from "./table-column.vue";
import { dialogFormInstanceKey, proTablePrefixClassKey } from "../interface";
import { visibleButton } from "../helper";
import type { DialogFormProps } from "./dialog-form.vue";

defineOptions({ name: "ProTableMain" });

const prefixClass = inject(proTablePrefixClassKey, "pro-table");

export interface ProTableProps {
  columns?: TableColumnProps[]; // 列配置项 ==> 必传
  columnTypes?: TypeProps[]; // 字段类型
  dialogForm?: DialogFormProps; // 新增、编辑、删除表单配置
  rowClickEdit?: boolean; // 单击行激活行内编辑
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  columnTypes: () => ["selection", "radio", "index", "expand", "sort"],
  rowClickEdit: false,
});

type TableMainEmits = {
  edit: [cope: any, item: TableColumnProps];
  remove: [cope: any, item: TableColumnProps];
};

const emits = defineEmits<TableMainEmits>();

const dialogFormRef = inject(dialogFormInstanceKey, undefined);

const tableInstance = useTemplateRef<InstanceType<typeof ElTable>>("tableInstance");

// 编辑回调
const handleEdit = (scope: any, item: TableColumnProps) => {
  emits("edit", scope, item);
};

// 删除回调
const handleRemove = (scope: any, item: TableColumnProps) => {
  emits("remove", scope, item);
};

const setTableColumn = (item: TableColumnProps) => {
  return item as TableColumnCtx<any>;
};

const handleRowClick = (row: any) => {
  if (props.rowClickEdit) row._edit = !row._edit;
};

defineExpose({ table: tableInstance });
</script>

<template>
  <el-table ref="tableInstance" v-bind="$attrs" @row-click="handleRowClick">
    <!-- 默认插槽 -->
    <slot />

    <template v-for="item in columns" :key="item">
      <!-- selection || index || expand -->
      <el-table-column
        v-if="item.type && item.isShow && columnTypes.includes(item.type)"
        v-bind="setTableColumn(item)"
        :align="item.align ?? 'center'"
        :reserve-selection="item.type == 'selection'"
      >
        <template #header="scope">
          <component v-if="item.headerRender" :is="item.headerRender" v-bind="scope"></component>
          <slot v-else :name="`${item.type}Header`" v-bind="scope">{{ scope.column.label }}</slot>
        </template>

        <template #default="scope">
          <!-- expand -->
          <template v-if="item.type == 'expand'">
            <component v-if="item.render" :is="item.render" v-bind="scope" />
            <slot v-else :name="item.type" v-bind="scope" />
          </template>

          <!-- sort -->
          <el-tag v-if="item.type == 'sort'" class="move">
            <el-icon><DCaret /></el-icon>
          </el-tag>
        </template>
      </el-table-column>

      <!-- other -->
      <TableColumn v-if="!item.type && item.prop && item.isShow && item.prop !== 'operation'" :column="item">
        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </TableColumn>

      <TableColumn v-else-if="item.prop === 'operation'" :column="item">
        <template #operation="scope">
          <slot name="operation" v-bind="{ ...scope, operate: dialogFormRef }">
            <el-button
              link
              type="primary"
              size="small"
              :icon="Edit"
              @click="handleEdit(scope, item)"
              :disabled="scope.row.disableEdit || dialogForm?.disableEdit"
              v-if="(scope.row.useEdit ?? true) && visibleButton(dialogForm?.editApi, dialogForm?.useEdit)"
            >
              编辑
            </el-button>
            <el-popconfirm
              title="你确定删除吗?"
              @confirm="handleRemove(scope, item)"
              v-if="(scope.row.useRemove ?? true) && visibleButton(dialogForm?.removeApi, dialogForm?.useRemove)"
            >
              <template #reference>
                <el-button
                  link
                  type="danger"
                  size="small"
                  :icon="Delete"
                  :disabled="scope.row.disableRemove || dialogForm?.disableRemove"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
            <slot name="operationExtra" v-bind="{ ...scope, operate: dialogFormRef }"></slot>
          </slot>
        </template>
      </TableColumn>
    </template>

    <!-- 插入表格最后一行之后的插槽 -->
    <template #append><slot name="append"></slot></template>

    <!-- 无数据 -->
    <template #empty>
      <div :class="`${prefixClass}__empty`">
        <slot name="empty">
          <img src="@/common/assets/images/notData.png" alt="notData" />
          <div>暂无数据</div>
        </slot>
      </div>
    </template>
  </el-table>
</template>
