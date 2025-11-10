<script setup lang="ts">
import type { FormColumn } from "@/components";
import { ProForm } from "@/components";

const props = withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: false,
});

const model = defineModel<Recordable>({ default: () => reactive({}) });

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
  {
    label: "预约人",
    prop: "appointed",
    el: "el-input",
    defaultValue: "Teeker",
  },
  {
    label: "创建人",
    prop: "createUser",
    el: "el-input",
    destroy: computed(() => !props.disabled),
  },
  {
    label: "创建时间",
    prop: "createTime",
    el: "el-input",
    destroy: computed(() => !props.disabled),
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
