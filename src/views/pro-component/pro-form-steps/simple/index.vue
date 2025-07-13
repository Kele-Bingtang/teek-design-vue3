<script lang="ts" setup>
import type { FormStepColumn } from "@/components";
import { ref } from "vue";
import { ProFormSteps } from "@/components";

const active = ref(1);

const stepForm = ref<FormStepColumn[]>([
  {
    title: "第一步",
    form: {
      modelValue: {},
      columns: [
        { label: "名称", prop: "name", tooltip: "名称最多显示6个字符" },
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
      elFormProps: {
        rules: {
          name: [{ required: true, message: "请输入名称" }],
        },
      },
    },
  },
  {
    title: "第二步",
    form: {
      modelValue: {},
      columns: [
        { label: "标签", prop: "tag" },
        { label: "执行进度", prop: "progress" },
        { label: "评分", width: 200, prop: "rate", el: "el-rate" },
        { label: "是否显示", width: 100, prop: "switch", el: "el-switch" },
      ],
      elFormProps: {
        labelWidth: "100",
        rules: {
          tag: [{ required: true, message: "请输入标签" }],
          progress: [{ required: true, message: "请输入执行进度" }],
        },
      },
    },
  },
  {
    title: "第三步",
    form: {
      modelValue: {},
      columns: [
        { label: "时间", prop: "time", el: "el-date-picker" },
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
      elFormProps: {
        rules: {
          time: [{ required: true, trigger: "change", message: "请选择时间" }],
          demand: [{ required: true, trigger: "change", message: "请选择要求" }],
        },
      },
    },
  },
]);

const next = (actives: number, currentModel: Recordable, allModel: Recordable) => {
  active.value = actives;
  console.log(actives, currentModel, allModel, stepForm.value);
};
</script>

<template>
  <div class="flx-column gap-10">
    <ProFormSteps v-model="active" :columns="stepForm" @next="next" />
    <ProFormSteps v-model="active" :columns="stepForm" direction="vertical" @next="next" style="height: 300px" />
  </div>
</template>
