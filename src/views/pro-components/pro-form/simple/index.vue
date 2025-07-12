<script setup lang="ts" name="SimpleProForm">
import { ref } from "vue";
import { ProForm, ProFormItem, type FormColumn, type ElFormProps } from "@/components";

const model = ref<Recordable>({});

// 表单整体配置项
const elFormProps: Partial<ElFormProps> = {
  inline: false,
  labelPosition: "right",
  labelWidth: "80px",
  disabled: false,
  labelSuffix: " :",
};

// 表单列配置项 (formItem 代表 item 配置项，attrs 代表 输入、选择框 配置项)
const columns: FormColumn[] = [
  {
    formItemProps: { labelWidth: "80px" },
    label: "用户名",
    prop: "username",
    el: "el-input",
    elProps: { clearable: true, placeholder: "请输入用户名", disabled: true },
  },
  {
    label: "密码",
    prop: "password",
    el: "el-input",
    elProps: { clearable: true, autofocus: true, placeholder: "请输入密码", type: "password" },
  },
  {
    label: "邮箱",
    prop: "email",
    el: "el-input",
    width: 500,
    elProps: { placeholder: "请输入邮箱", clearable: true },
    formItemProps: { required: true },
  },
];

const options = [
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
];

const checkboxOptions = [
  {
    label: "四六级",
    value: "0",
  },
  {
    label: "计算机二级证书",
    value: "1",
  },
  {
    label: "普通话证书",
    value: "2",
  },
];

const model2 = ref({
  name: "123",
  cascader: "",
  checkbox: [],
});

const editable = ref(true);
</script>

<template>
  <div>
    <div class="tk-card-minimal">
      <h4 style="margin: 10px 0; font-size: 16px; font-weight: 600">1 个 ProForm</h4>
      <ProForm :elFormProps :columns v-model="model" />
      {{ model }}

      <h4 style="margin: 10px 0; font-size: 16px; font-weight: 600">3 个 ProFormItem</h4>

      <ProFormItem v-model="model2.name" label="输入框" prop="name" :editable />
      <ProFormItem
        v-model="model2.cascader"
        el="el-cascader"
        label="级联"
        prop="cascader"
        :options="options"
        :editable
      />
      <ProFormItem
        v-model="model2.checkbox"
        el="el-checkbox-group"
        label="多选"
        prop="checkbox"
        :options="checkboxOptions"
        :editable
      />
      {{ model2 }}

      <el-button @click="editable = !editable">点击</el-button>
    </div>
  </div>
</template>
