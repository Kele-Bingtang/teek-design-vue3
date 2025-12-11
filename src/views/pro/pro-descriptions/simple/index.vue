<script lang="ts" setup>
import type { DescriptionColumn } from "@/components";
import { ref } from "vue";
import { ProDescriptions } from "@/components";

const border = ref(false);

const data = {
  name: "Teek",
  gender: 1,
  status: 1,
  tag: "success",
  progress: 30,
  rate: 3.5,
  switch: true,
  time: new Date(),
  code: `
  const getData = async params => {
    const data = await getData(params)
    return { list: data.data, ...data }
  }`,
};

const columns: DescriptionColumn[] = [
  { label: "名称", prop: "name", el: "Copy" },
  {
    prop: "gender",
    label: "性别",
    el: "el-tag",
    options: [
      { label: "男", value: 1 },
      { label: "女", value: 2 },
    ],
  },
  {
    label: "状态",
    prop: "status",
    el: "point-tag",
    options: [
      { label: "未解决", value: 0, tagColor: "red" },
      { label: "已解决", value: 1, tagColor: "blue" },
      { label: "解决中", value: 2, tagColor: "yellow" },
      { label: "失败", value: 3, tagColor: "red" },
    ],
  },
  { label: "标签", width: 120, prop: "tag", el: "el-tag" },
  { label: "执行进度", width: 200, prop: "progress" },
  { label: "代码块", width: 250, prop: "code" },
  { label: "评分", width: 200, prop: "rate" },
  { label: "开关", width: 100, prop: "switch" },
  { label: "时间", width: 190, prop: "time" },
];
</script>

<template>
  <div>
    <el-button type="primary" @click="border = !border" style="margin-bottom: 20px">
      {{ `${border ? "取消" : "打开"}边框` }}
    </el-button>

    <ProDescriptions title="基础使用" :column="3" :columns :data :border card />
  </div>
</template>
