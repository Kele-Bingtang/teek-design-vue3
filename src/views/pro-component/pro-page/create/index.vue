<script setup lang="tsx">
import type { TableColumnCtx } from "element-plus";
import type { PageColumn, ProPageInstance } from "@/components";
import { onMounted, useTemplateRef, withModifiers } from "vue";
import { ElButton, ElMessage, ElInput } from "element-plus";
import { useProPage } from "@/components";
import { tableData } from "@/mock/pro-component/pro-table";

const {
  createMethods: { createPage, createPageComponent },
} = useProPage();

const getTicketList = () => {
  return new Promise(resolve => {
    resolve({ data: tableData });
  });
};

/**
 * context 里有 slots 和 attrs，如果元素里有 slots 和 attrs，则必传
 */
const RenderProPage = (_: any, context: Recordable) => {
  // 函数式创建 Template 组件
  return createPageComponent({ pageScope: "client", columns: columns, requestApi: getTicketList }, context);
};

onMounted(() => {
  // 函数式动态渲染组件到 proTableInstance 元素
  createPage("proPageInstance", { pageScope: "client", columns: columns, requestApi: getTicketList }, tableSlots);
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

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proPageInstance = useTemplateRef<ProPageInstance>("proPageInstance");

const columns: PageColumn[] = [
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", label: "#", width: 60 },
  { type: "sort", label: "Sort", width: 80 },
  { type: "expand", label: "Expand", width: 80 },
  {
    prop: "username",
    label: "用户姓名",
    search: { el: "el-input" },
    render: ({ value }) => {
      return (
        <ElButton
          type="primary"
          link
          onClick={withModifiers(() => ElMessage.success("我是通过 tsx 语法渲染的内容"), ["stop"])}
        >
          {value}
        </ElButton>
      );
    },
  },
  {
    prop: "gender",
    label: "性别",
    options: [
      { genderLabel: "男", genderValue: 1 },
      { genderLabel: "女", genderValue: 2 },
    ],
    optionField: { label: "genderLabel", value: "genderValue" },
    search: { el: "el-select", elProps: { filterable: true } },
    filters: [
      { text: "男", value: "1" },
      { text: "女", value: "2" },
    ],
    filterMethod: (value: string, row: any, column: TableColumnCtx<any>) => {
      const property = column["property"];
      return row[property] === Number(value);
    },
    editable: true,
    editProps: {
      el: "el-select",
    },
  },
  {
    // 多级 prop
    prop: "user.detail.age",
    label: "年龄",
    filterProps: {
      formColumn: { width: 400 },
      // 自定义过滤规则
      rule: (model, row) => {
        const value = row.user.detail.age;
        return value >= model.minAge && value <= model.maxAge;
      },
    },
    search: {
      el: "el-input-number",
      // 自定义 search 显示内容
      render: ({ model }) => {
        return (
          <div class="flx-center">
            <ElInput vModel_trim={model.minAge} placeholder="最小年龄" />
            <span style="margin: 0 10px">-</span>
            <ElInput vModel_trim={model.maxAge} placeholder="最大年龄" />
          </div>
        );
      },
    },
    editProps: {
      el: "el-input-number",
      prop: "age",
      formItemProps: { required: true },
    },
  },
  {
    prop: "idCard",
    label: "身份证号",
    filterProps: {
      rule: "like",
    },
    search: { el: "el-input" },
    editProps: {
      formItemProps: { required: true },
    },
  },
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
    filterProps: {
      formColumn: { width: 400 },
    },
    search: {
      el: "el-date-picker",
      span: 2, // 占两个位置
      elProps: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ["1900-11-12 11:35:00", "2024-12-12 11:35:00"],
    },
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
    <el-card shadow="never" header="createPageComponent 函数式创建 Template 组件">
      <RenderProPage>
        <template #head-left="scope">
          <el-button type="primary">新增用户</el-button>
          <el-button type="primary" plain>批量添加用户</el-button>
          <el-button type="primary" plain>导出用户数据</el-button>
          <el-button type="primary" plain>To 子集详情页面</el-button>
          <el-button type="danger" plain :disabled="!scope.isSelected">批量删除用户</el-button>
        </template>
      </RenderProPage>
    </el-card>

    <el-card shadow="never" header="createPage 函数式动态渲染组件到指定元素">
      <div ref="proPageInstance"></div>
    </el-card>
  </el-space>
</template>
