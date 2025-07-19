<script setup lang="ts">
import type { ElFormProps, FormGroupColumn, FormItemColumnProps } from "@/components";
import { ref } from "vue";
import { CreditCard, Calendar, Soccer } from "@element-plus/icons-vue";
import { ProFormGroup } from "@/components";

const model = ref({});

const elFormProps: Partial<ElFormProps> = {
  rules: {
    name: [{ required: true, message: "请输入名称" }],
    tag: [{ required: true, message: "请输入标签" }],
  },
};

const columns: FormGroupColumn[] = [
  {
    title: "第一分组",
    icon: CreditCard,
    columns: [
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
    ],
  },
  {
    title: "第二分组",
    icon: Calendar,
    columns: [
      { label: "标签", prop: "tag" },
      { label: "执行进度", prop: "progress" },
      { label: "评分", prop: "rate", el: "el-rate" },
      { label: "是否显示", prop: "switch", el: "el-switch" },
    ],
  },
  {
    title: "第三分组",
    icon: Soccer,
    columns: [
      { label: "时间", prop: "time", el: "el-date-picker" },
      { label: "数量", prop: "number", el: "el-input-number", elProps: { precision: 2, step: 2 } },
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
        label: "经度",
        prop: "lng",
        tooltip: "请保留两位小数",
      },
      {
        label: "纬度",
        prop: "lat",
        tooltip: "请保留两位小数",
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
      { label: "奖励", prop: "price" },
      { label: "提成", prop: "percentage" },
      {
        label: "说明",
        prop: "desc",
        el: "el-input",
        elProps: {
          type: "textarea",
          maxlength: 10,
          showWordLimit: true,
          autosize: { minRows: 2, maxRows: 4 },
        },
      },
    ],
  },
];

const handleChange = (value: unknown, model: Recordable, column: FormItemColumnProps) => {
  console.log(value, model, column.prop, "change");
};
const handleSubmit = (model: Recordable) => {
  console.log(model, "Submit");
};
const handleSubmitError = (err: any) => {
  console.log(err, "err");
};
const handleReset = (model: Recordable) => {
  console.log(model, "handleReset");
};
</script>

<template>
  <div>
    <ProFormGroup
      v-model="model"
      :columns
      :el-form-props
      @change="handleChange"
      @submit="handleSubmit"
      @submit-error="handleSubmitError"
      @reset="handleReset"
    ></ProFormGroup>

    {{ model }}
  </div>
</template>
