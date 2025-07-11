<script setup lang="ts">
import type { FormColumn } from "@/components";
import { ProForm } from "@/components";

withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: false,
});

const model = defineModel<Recordable>({ default: () => ({}) });

const rules = {
  title: [{ required: true, message: "请输入标题" }],
  date: [{ required: true, message: "请选择日期" }],
  time: [{ required: true, message: "请选择时间范围" }],
  location: [{ required: true, message: "请输入地点" }],
};

const columns: FormColumn[] = [
  {
    label: "标题",
    prop: "title",
    el: "el-input",
  },
  {
    label: "会议日期",
    prop: "date",
    el: "el-date-picker",
    elProps: {
      disabledDate: (time: Date) => {
        // 不能预约今天之前的日期
        return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
      },
    },
  },
  {
    label: "会议时间",
    prop: "time",
    el: "el-time-picker",
    elProps: {
      isRange: true,
      valueFormat: "HH:mm",
    },
  },
  {
    label: "地点",
    prop: "location",
    el: "el-input",
  },
];
</script>

<template>
  <ProForm
    v-model="model"
    :columns
    :rules="rules"
    :col-props="{ span: 24 }"
    :show-footer="false"
    :disabled="disabled"
    v-bind="$attrs"
  ></ProForm>
</template>
