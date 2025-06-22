<script lang="ts" setup>
import type { DescriptionColumn } from "@/components";
import { ref } from "vue";
import { ProDescriptions } from "@/components";

const DataServe = {
  getList: async () => {
    const index = Math.random() * 10;
    const data = {
      index,
      id: index,
      title: "序号" + (index + 1),
      name: "name".repeat(10),
      status: "1",
      tag: index < 5 ? "success" : "danger",
      progress: 30,
      rate: index > 3 ? 2 : 3.5,
      switch: index > 3,
      indexColStyle:
        index < 3
          ? {
              backgroundColor: "#314659",
            }
          : {
              backgroundColor: "#979797",
            },
      time: new Date(),
      code: `
  const getData = async params => {
    const data = await getData(params)
    return { list: data.data, ...data }
  }`,
    };

    return { data };
  },
};

const columns: DescriptionColumn[] = [
  {
    label: "名称",
    prop: "name",
  },
  {
    label: "状态",
    prop: "status",
    options: [
      {
        label: "未解决",
        value: "0",
        color: "red",
      },
      {
        label: "已解决",
        value: "1",
        color: "blue",
      },
      {
        label: "解决中",
        value: "2",
        color: "yellow",
      },
      {
        label: "失败",
        value: "3",
        color: "red",
      },
    ],
  },
  { label: "标签", width: 120, prop: "tag" },
  { label: "执行进度", width: 200, prop: "progress" },
  { label: "代码块", width: 250, prop: "code" },
  { label: "评分", width: 200, prop: "rate" },
  { label: "开关", width: 100, prop: "switch" },
  { label: "时间", width: 190, prop: "time" },
];
const descriptionsData = ref<Recordable>({});
const getList = async () => {
  const { data } = await DataServe.getList();
  descriptionsData.value = data || {};
};

getList();
</script>

<template>
  <ProDescriptions title="Info" :column="3" :columns :data="descriptionsData" border card />
</template>
