<script lang="ts" setup>
import type { DescriptionColumn } from "@/components";
import { ref } from "vue";
import { ProDescriptions, setProp } from "@/components";

const descriptionsData = ref<Recordable>({});
const model = ref({});

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
  { label: "名称", prop: "name" },
  {
    label: "状态",
    prop: "status",
    options: [
      { label: "未解决", value: "0", color: "red" },
      { label: "已解决", value: "1", color: "blue" },
      { label: "解决中", value: "2", color: "yellow" },
      { label: "失败", value: "3", color: "red" },
    ],
    form: { el: "el-select" },
  },
  { label: "标签", width: 120, prop: "tag" },
  { label: "执行进度", width: 200, prop: "progress", form: { formItemProps: { required: true } } },
  {
    label: "代码块",
    span: editable => (editable ? 2 : 1),
    labelWidth: 50,
    prop: "code",
  },
  { label: "评分", width: 200, prop: "rate" },
  { label: "开关", width: 100, prop: "switch", form: { el: "el-switch" } },
  { label: "时间", width: 190, prop: "time" },
];

const getList = async () => {
  const { data } = await DataServe.getList();
  descriptionsData.value = data || {};
};

getList();

const handleFormChange = (value: unknown, prop: string) => {
  setProp(descriptionsData.value, prop, value);
};
</script>

<template>
  <ProDescriptions
    v-model="model"
    :data="descriptionsData"
    title="传入数据 & 编辑时需要手动通过 change 事件更新描述列表数据"
    :column="3"
    :columns
    border
    card
    edit-button
    @form-change="handleFormChange"
  />

  <ProDescriptions
    v-model="model"
    :request-api="DataServe.getList"
    title="传入请求函数 & 编辑时内部自动更新描述列表数据"
    :column="3"
    :columns
    border
    card
    edit-button
    @form-change="handleFormChange"
  />

  {{ model }}
</template>
