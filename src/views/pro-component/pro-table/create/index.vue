<script setup lang="tsx" name="CreateTable">
import type { TableColumn } from "@/components";
import { onMounted } from "vue";
import { ElButton, ElMessage } from "element-plus";
import { useProTable } from "@/components";
import { tableData } from "@/mock/pro-component/pro-table";

const {
  createMethods: { createTable, createTableComponent },
} = useProTable();

/**
 * context 里有 slots 和 attrs，如果元素里有 slots 和 attrs，则必传
 */
const RenderProTable = (_: any, context: Recordable) => {
  // 函数式创建 Template 组件
  return createTableComponent({ pageScope: "client", columns: columns, requestApi: getTicketList }, context);
};

onMounted(() => {
  // 函数式动态渲染组件到 proTableInstance 元素
  createTable("proTableInstance", { pageScope: "client", columns: columns, requestApi: getTicketList }, tableSlots);
});

const tableSlots = {
  "head-left": (scope: any) => (
    <>
      <ElButton type="primary">新增用户</ElButton>
      <ElButton type="primary" plain>
        批量添加用户
      </ElButton>
      <ElButton type="primary" plain>
        导出用户数据
      </ElButton>
      <ElButton type="primary" plain>
        To 子集详情页面
      </ElButton>
      <ElButton type="danger" plain disabled={!scope.isSelected}>
        批量删除用户
      </ElButton>
    </>
  ),
};

/**
 * 模拟获取数据
 */
const getTicketList = () => {
  return new Promise(resolve => {
    resolve({
      data: tableData,
    });
  });
};

const columns: TableColumn[] = [
  { type: "selection", prop: "selection", fixed: "left", width: 60 },
  { type: "index", label: "#", width: 60 },
  { type: "sort", label: "Sort", width: 80 },
  { type: "expand", prop: "expand", label: "Expand", width: 80 },
  {
    prop: "username",
    label: "用户姓名",
    render: ({ value }) => {
      return (
        <ElButton type="primary" link onClick={() => ElMessage.success("我是通过 tsx 语法渲染的内容")}>
          {value}
        </ElButton>
      );
    },
  },
  {
    prop: "gender",
    label: "性别",
    enum: [
      { genderLabel: "男", genderValue: 1 },
      { genderLabel: "女", genderValue: 2 },
    ],
    fieldNames: { label: "genderLabel", value: "genderValue" },
  },
  {
    // 多级 prop
    prop: "user.detail.age",
    label: "年龄",
  },
  { prop: "idCard", label: "身份证号" },
  { prop: "email", label: "邮箱" },
  { prop: "address", label: "居住地址" },
  {
    prop: "createTime",
    label: "创建时间",
    renderHeader: scope => {
      return (
        <ElButton type="primary" onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}>
          {scope.column.label}
        </ElButton>
      );
    },
    width: 180,
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: 180,
    render: () => {
      return (
        <>
          <ElButton plain type="primary">
            编辑
          </ElButton>
          <ElButton plain type="danger">
            删除
          </ElButton>
        </>
      );
    },
  },
];
</script>

<template>
  <el-space fill>
    <el-card shadow="never" header="createTableComponent 函数式创建 Template 组件">
      <RenderProTable>
        <template #head-left="scope">
          <el-button type="primary">新增用户</el-button>
          <el-button type="primary" plain>批量添加用户</el-button>
          <el-button type="primary" plain>导出用户数据</el-button>
          <el-button type="primary" plain>To 子集详情页面</el-button>
          <el-button type="danger" plain :disabled="!scope.isSelected">批量删除用户</el-button>
        </template>
      </RenderProTable>
    </el-card>

    <el-card shadow="never" header="createTable 函数式动态渲染组件到指定元素">
      <div ref="proTableInstance"></div>
    </el-card>
  </el-space>
</template>
