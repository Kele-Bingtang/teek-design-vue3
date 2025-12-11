<script setup lang="ts">
import type { OperationNamespace, TableColumn, TableScope } from "@/components/pro/table";
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { Edit, Delete } from "@element-plus/icons-vue";
import { setProp } from "@/components/pro/helper";
import { ProTable } from "@/components/pro/table";
import { tableData } from "@/mock/pro-component/pro-table";

const data = ref(tableData);

const columns: TableColumn[] = [
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", label: "#", width: 60 },
  { type: "sort", label: "Sort", width: 80 },
  { type: "expand", label: "Expand", width: 80 },
  { prop: "username", label: "用户姓名", el: "copy" },
  {
    prop: "gender",
    label: "性别",
    el: "el-tag",
    elProps: (value: number) => {
      if (value === 1) return { type: "success" };
      return { type: "danger" };
    },
    options: async () => {
      return [
        { label: "男", value: 1 },
        { label: "女", value: 2 },
      ];
    },
    editProps: {
      el: "el-select",
    },
    filters: [
      { text: "男", value: "1" },
      { text: "女", value: "2" },
    ],
  },
  {
    prop: "status",
    label: "状态",
    el: "point-tag",
    options: [
      { label: "正常", value: 1, tagType: "success" },
      { label: "禁用", value: 0, tagType: "danger" },
    ],
  },
  {
    // 多级 prop
    prop: "user.detail.age",
    label: "年龄",
    el: "el-progress",
    elSlots: {
      default: ({ value }) => "*" + value,
    },
    filter: true,
    disabledFilter: false,
    filterProps: { formColumn: { elProps: { modelModifiers: { number: true } } } },
  },
  {
    prop: "idCard",
    label: "身份证号",
    filter: true,
    formatValue: value => (value as string)?.replace(/\d{4}/, "****"),
    filterProps: { rule: "like" },
    editProps: {
      formItemProps: {
        required: true,
      },
    },
  },
  { prop: "email", label: "邮箱" },
  { prop: "address", label: "居住地址" },
];

const el = ref<OperationNamespace.Props["el"]>("el-link");
const buttons = ref<OperationNamespace.ButtonRaw[]>();

buttons.value = [
  {
    text: "修改",
    code: "edit",
    elProps: () => ({
      type: "primary",
    }),
    icon: Edit,
    show: row => !row._editable,
    onClick: async ({ row }) => {
      row._editable = !row._editable;
    },
  },
  {
    text: "保存",
    code: "save",
    elProps: () => ({
      type: "primary",
    }),
    show: row => !!row._editable,
    icon: Edit,
    onClick: async ({ row }) => {
      const valid = await row._validateCellEdit?.();
      if (valid) row._editable = !row._editable;
    },
  },
  {
    text: "删除",
    code: "delete",
    elProps: computed(() => ({ type: "danger" })),
    confirm: {
      el: "el-messageBox",
      props: { options: { draggable: true } },
    },
    onConfirm: ({ row }) => {
      data.value = data.value.filter(item => !row.id.includes(item.id));
    },
    icon: Delete,
  },
];

const handleFormChange = async (fromValue: unknown, prop: string, scope: TableScope) => {
  setProp(data.value[scope.rowIndex!], prop, fromValue);
};

const handleLeaveCellEdit = (row: Recordable, column: TableColumn) => {
  ElMessage.success(`退出了 ${column.prop}: ${row[column.prop!]} 编辑`);
};

const handleButtonClick = (params: OperationNamespace.ButtonsCallBackParams) => {
  console.log("buttonClick", params);
};

const handleButtonConfirm = (params: OperationNamespace.ButtonsCallBackParams) => {
  console.log("confirm", params);
};

const handleButtonCancel = (params: OperationNamespace.ButtonsCallBackParams) => {
  console.log("cancel", params);
};
</script>

<template>
  <ProTable
    :columns
    :data
    title="支持单行/单元格编辑"
    page-scope
    card
    init-native-row-field
    editable="click"
    :operation-props="{
      buttons: buttons,
      el,
      width: el === 'el-button' ? 260 : el === 'el-icon' ? 190 : 200,
    }"
    @button-click="handleButtonClick"
    @button-confirm="handleButtonConfirm"
    @button-cancel="handleButtonCancel"
    @form-change="handleFormChange"
    @leave-cell-edit="handleLeaveCellEdit"
  >
    <template #expand="scope">
      {{ scope.row }}
    </template>
  </ProTable>
</template>
