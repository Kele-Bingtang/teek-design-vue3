<script setup lang="tsx">
import type { TableColumnCtx } from "element-plus";
import type { PageColumn, TableScope, ProPageInstance, TableColumn } from "@/components";
import { ref, useTemplateRef } from "vue";
import { ElButton, ElMessage } from "element-plus";
import { CirclePlus, Delete, Pointer, Refresh } from "@element-plus/icons-vue";
import { ProPage } from "@/components";
import { useConfirm, useNamespace } from "@/composables";
import { genderType, tableData, userStatus } from "@/mock/pro-component/pro-table";
import type { ResUserList } from "../advanced/index.vue";

const ns = useNamespace();
const proPageInstance = useTemplateRef<ProPageInstance>("proPageInstance");
const data = ref(tableData);

const columns: PageColumn<ResUserList>[] = [
  { type: "selection", width: 80 },
  { type: "index", label: "#", width: 80 },
  { type: "expand", label: "Expand", width: 100 },
  {
    prop: "base",
    label: "基本信息",
    renderHeader: (scope: TableScope<ResUserList>) => {
      return (
        <ElButton type="primary" onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}>
          {scope.column.label}
        </ElButton>
      );
    },
    children: [
      { prop: "username", label: "用户姓名", width: 110 },
      { prop: "user.detail.age", label: "年龄", width: 100 },
      {
        prop: "gender",
        label: "性别",
        width: 100,
        search: {
          el: "el-select",
        },
        options: genderType,
      },
      {
        prop: "details",
        label: "详细资料",
        children: [
          { prop: "idCard", label: "身份证号" },
          { prop: "email", label: "邮箱" },
          { prop: "address", label: "居住地址" },
        ],
      },
    ],
  },
  {
    prop: "status",
    label: "用户状态",
    tag: true,
    enum: userStatus,
  },
  { prop: "createTime", label: "创建时间", width: 200 },
  { prop: "operation", label: "操作", fixed: "right", width: 230 },
];

// 选择行
const setCurrent = () => {
  const proTableInstance = proPageInstance.value?.proTableInstance;
  proTableInstance?.getElTableInstance()?.setCurrentRow(proTableInstance.value?.tableData[4]);
};

// 表尾合计行（自行根据条件计算）
interface SummaryMethodProps<T = ResUserList> {
  columns: TableColumn[];
  data: T[];
}
const getSummaries = (param: SummaryMethodProps) => {
  const { columns } = param;
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) return (sums[index] = "合计");
    else sums[index] = "N/A";
  });
  return sums;
};

// 列合并
interface SpanMethodProps {
  row: ResUserList;
  column: TableColumnCtx<ResUserList>;
  rowIndex: number;
  columnIndex: number;
}
const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 3) {
    if (rowIndex % 2 === 0) return { rowspan: 2, colspan: 1 };
    else return { rowspan: 0, colspan: 0 };
  }
};

// 设置列样式
const tableRowClassName = ({ rowIndex }: { row: ResUserList; rowIndex: number }) => {
  if (rowIndex === 2) return "warning-row";
  if (rowIndex === 6) return "success-row";
  return "";
};

// 单击行
const rowClick = (row: ResUserList, column: TableColumnCtx<ResUserList>) => {
  if (column.property === "radio" || column.property === "operation") return;
  console.log(row);
  ElMessage.success("当前行被点击了！");
};

// 删除用户信息
const deleteAccount = async (params: TableColumn<ResUserList>) => {
  await useConfirm(() => {
    data.value = data.value.filter(item => item.id !== params.id);
  }, `删除【${params.username}】用户`);
  proPageInstance.value?.proTableInstance?.fetch();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useConfirm(() => {
    data.value = data.value.filter(item => !id.includes(item.id));
  }, "删除所选用户信息");
  proPageInstance.value?.proTableInstance?.tableMainInstance?.clearSelection();
  proPageInstance.value?.proTableInstance?.fetch();
};

// 重置用户密码
const resetPass = async (params: TableColumn<ResUserList>) => {
  await useConfirm(() => {}, `重置【${params.username}】用户密码`);
  proPageInstance.value?.proTableInstance?.fetch();
};
</script>

<template>
  <ProPage
    ref="proPageInstance"
    :data="data"
    :columns="columns"
    :row-class-name="tableRowClassName"
    :span-method="objectSpanMethod"
    :show-summary="true"
    :summary-method="getSummaries"
    @row-click="rowClick"
  >
    <!-- 表格 header 按钮 -->
    <template #head-left="scope">
      <el-button
        type="primary"
        :icon="CirclePlus"
        @click="proPageInstance?.proTableInstance?.getElTableInstance()?.toggleAllSelection"
      >
        全选 / 全不选
      </el-button>
      <el-button type="primary" :icon="Pointer" plain @click="setCurrent">选中第五行</el-button>
      <el-button
        type="danger"
        :icon="Delete"
        plain
        :disabled="!scope.isSelected"
        @click="batchDelete(scope.selectedListIds)"
      >
        批量删除用户
      </el-button>
    </template>
    <!-- Expand -->
    <template #expand="scope">
      {{ scope.row }}
    </template>
    <!-- 表格操作 -->
    <template #operation="scope">
      <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row as TableColumn<ResUserList>)">
        重置密码
      </el-button>
      <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row as TableColumn<ResUserList>)">
        删除
      </el-button>
    </template>
    <template #append>
      <span :style="{ color: ns.cssVarEl('color-primary') }">
        我是插入在表格最后的内容。若表格有合计行，该内容会位于合计行之上。
      </span>
    </template>
  </ProPage>
</template>

<style lang="scss">
.#{$el-namespace}-table .warning-row,
.#{$el-namespace}-table .warning-row .#{$el-namespace}-table-fixed-column--right,
.#{$el-namespace}-table .warning-row .#{$el-namespace}-table-fixed-column--left {
  background-color: cssVarEl(color-warning-light-9);
}

.#{$el-namespace}-table .success-row,
.#{$el-namespace}-table .success-row .#{$el-namespace}-table-fixed-column--right,
.#{$el-namespace}-table .success-row .#{$el-namespace}-table-fixed-column--left {
  background-color: cssVarEl(color-success-light-9);
}
</style>
