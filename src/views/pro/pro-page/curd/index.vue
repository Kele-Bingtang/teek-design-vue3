<script setup lang="ts">
import type { FeedbackFormProps, PageColumn } from "@components/pro/page";
import { ProPage } from "@/components";
import { tableData } from "@/mock/pro-component/pro-table";
import { addUser, editUser, formColumns, removeBatch, removeUser, rules } from "./use-feedback-form";

defineOptions({ name: "CURDProPage" });

const feedbackType = ref<"dialog" | "drawer">("dialog");

const getDataList = (searchParams: Recordable) => {
  console.log("搜索参数 ", searchParams);

  return new Promise(resolve => {
    resolve({ data: tableData });
  });
};

// 表格配置项
const tableColumns: PageColumn[] = [
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", label: "#", width: 60 },
  {
    prop: "username",
    label: "用户姓名",
    el: "copy",
    search: {
      el: "el-input",
      beforeSearch: (searchValue, searchParams, column) => {
        return searchValue ? `#${searchValue}` : undefined;
      },
    },
  },
  {
    prop: "gender",
    label: "性别",
    search: { el: "el-select" },
    el: "el-tag",
    options: async () => {
      return [
        { label: "男", value: 1 },
        { label: "女", value: 2 },
      ];
    },
  },
  { prop: "age", label: "年龄", el: "el-progress" },
  {
    prop: "idCard",
    label: "身份证号",
    formatValue: value => (value as string)?.replace(/\d{4}/, "****"),
    search: { el: "el-input" },
  },
  { prop: "email", label: "邮箱", search: { el: "el-input" } },
  { prop: "address", label: "居住地址" },
  { prop: "operation", label: "操作", width: 160, fixed: "right" }, // 开启操作列
];

// 开启反馈表单功能
const feedbackFormProps: FeedbackFormProps = {
  form: {
    elFormProps: {
      labelWidth: 80,
      rules: rules,
    },
    columns: formColumns,
  },
  type: feedbackType, // 不写 type 默认为 dialog
  typeProps: {
    title: (_, status) => (status === "add" ? "新增" : "编辑"),
    width: "45%",
    height: 450,
    top: "5vh",
    closeOnClickModal: false,
  },
  id: ["id", "roleId"],
  addApi: data => addUser({ ...data, createDate: new Date() }),
  editApi: editUser,
  removeApi: removeUser,
  removeBatchApi: removeBatch,
  disableAdd: false,
  disableEdit: false,
  disableRemove: false,
  disableRemoveBatch: false,
  clickEdit: async model => {
    // 编辑时模拟获取该用户的在线状态
    const res = { code: 200, data: "在线", success: true };
    model.status = res.data || "离线";
  },
};
</script>

<template>
  <ProPage :columns="tableColumns" :request-api="getDataList" page-scope card :feedback-form-props>
    <template #head-left-before>
      <div style="margin-bottom: 10px">
        使用 ProPage 组件内置的反馈表单功能（Dialog、Drawer），只需要写反馈表单配置项开启即可，无需写 Dialog、Drawer
        组件
      </div>
    </template>

    <template #head-left-after>
      <el-button type="warning" @click="feedbackType = feedbackType === 'dialog' ? 'drawer' : 'dialog'">
        切换为 {{ feedbackType === "dialog" ? "Drawer" : "Dialog" }}
      </el-button>
    </template>
  </ProPage>
</template>
