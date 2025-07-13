<script setup lang="ts">
import type { ElFormProps, FormColumn } from "@/components";
import { ref } from "vue";
import { ProFormDialog } from "@/components";

const model = ref({});
const dialogVisible = ref(false);
const confirmLoading = ref(false);

const elFormProps: Partial<ElFormProps> = {
  rules: {
    name: [{ required: true, message: "请输入名称" }],
    tag: [{ required: true, message: "请输入标签" }],
  },
};

const columns: FormColumn[] = [
  {
    label: "名称",
    prop: "name",
    tooltip: "名称最多显示6个字符",
  },
  {
    label: "状态",
    prop: "status",
    el: "el-select",
    options: [
      { label: "未解决", value: "0", color: "red" },
      { label: "已解决", value: "1", color: "blue" },
      { label: "解决中", value: "2", color: "yellow" },
      { label: "失败", value: "3", color: "red" },
    ],
  },
  {
    label: "是否显示",
    prop: "switch",
    el: "el-switch",
  },

  {
    label: "时间",
    prop: "time",
    el: "el-date-picker",
  },
  {
    label: "数量",
    prop: "number",
    el: "el-input-number",
    elProps: { precision: 2, step: 2 },
  },
  {
    label: "城市",
    prop: "city",
    el: "el-cascader",
    options: [
      {
        value: "0",
        label: "陕西",
        children: [
          {
            value: "0-0",
            label: "西安",
            children: [
              { value: "0-0-0", label: "新城区" },
              { value: "0-0-1", label: "高新区" },
              { value: "0-0-2", label: "灞桥区" },
            ],
          },
        ],
      },
      {
        value: "1",
        label: "山西",
        children: [
          {
            value: "1-0",
            label: "太原",
            children: [
              { value: "1-0-0", label: "小店区" },
              { value: "1-0-1", label: "古交市" },
              { value: "1-0-2", label: "万柏林区" },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "地区",
    prop: "place",
    tooltip: "请精确到门牌号",
    elProps: {
      placeholder: "请精确到门牌号",
    },
  },
  {
    label: "要求",
    prop: "demand",
    el: "el-checkbox",
    options: [
      { label: "四六级", value: "0" },
      { label: "计算机二级证书", value: "1" },
      { label: "普通话证书", value: "2" },
    ],
  },
  {
    label: "梦想",
    prop: "gift",
    el: "el-radio",
    options: [
      { label: "诗", value: "0" },
      { label: "远方", value: "1" },
      { label: "美食", value: "2" },
    ],
  },
  {
    label: "到期时间",
    prop: "endTime",
    el: "el-date-picker",
    elProps: {
      type: "datetimerange",
      startPlaceholder: "请选择开始时间",
      endPlaceholder: "请选择结束时间",
    },
  },
  {
    label: "说明",
    prop: "desc",
    el: "el-input",
    colProps: {
      span: 24,
    },
    elProps: {
      type: "textarea",
      maxlength: 10,
      showWordLimit: true,
      autosize: { minRows: 2, maxRows: 4 },
    },
  },
];

const handleSubmit = () => {
  confirmLoading.value = true;
  setTimeout(() => {
    confirmLoading.value = false;
    dialogVisible.value = false;
  }, 2000);
};
</script>

<template>
  <div>
    <el-button @click="dialogVisible = true">打开弹窗表单</el-button>

    <ProFormDialog
      v-model:visible="dialogVisible"
      v-model="model"
      :dialog="{ title: '表单标题', confirmLoading }"
      :form="{ elFormProps, columns }"
      @confirm="handleSubmit"
    />

    {{ model }}
  </div>
</template>
