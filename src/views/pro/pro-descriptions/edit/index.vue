<script lang="ts" setup>
import type { DescriptionColumn, ElFormProps } from "@/components";
import { ref } from "vue";
import { ProDescriptions } from "@/components";
import { setProp } from "@/components/pro/helper";

const descriptionsData = ref({});
const model = ref({});

const position = ref<"center" | "left" | "right">("right");
const border = ref(true);
const editable = ref(false);
const direction = ref("horizontal");

const DataServe = {
  getList: async () => {
    const data = {
      name: "",
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

    return { data };
  },
};

const elFormProps: Partial<ElFormProps> = {
  rules: {
    name: [{ required: true, message: "请输入名称" }],
    tag: [{ required: true, message: "请输入标签" }],
  },
};

const columns: DescriptionColumn[] = [
  { label: "名称", prop: "name" },
  {
    label: "状态",
    prop: "status",
    options: [
      { label: "未解决", value: 0 },
      { label: "已解决", value: 1 },
      { label: "解决中", value: 2 },
      { label: "失败", value: 3 },
    ],
    formColumn: { el: "el-select" },
  },
  { label: "标签", width: 120, prop: "tag" },
  { label: "执行进度", width: 200, prop: "progress", formColumn: { formItemProps: { required: true } } },
  {
    label: "代码块",
    span: editable => (editable ? 2 : 1),
    labelWidth: 50,
    prop: "code",
  },
  { label: "评分", width: 200, prop: "rate" },
  { label: "开关", width: 100, prop: "switch", formColumn: { el: "el-switch" } },
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
  <div style="display: flex; flex-direction: column; gap: 20px">
    <ProDescriptions
      v-model="model"
      :data="descriptionsData"
      title="传入数据 & 编辑时需要手动通过 change 事件更新描述列表数据"
      :column="3"
      :columns
      :border
      :editable
      :direction
      :descriptions-item-props="{ align: position, minWidth: '60px' }"
      :form-props="{ elFormProps }"
      edit-button
      card
      @form-change="handleFormChange"
    >
      <template #title>
        <div class="title">
          <div>
            <span class="label">label 位置</span>
            <el-radio-group v-model="position">
              <el-radio value="left">left</el-radio>
              <el-radio value="center">center</el-radio>
              <el-radio value="right">right</el-radio>
            </el-radio-group>
          </div>

          <div>
            <span class="label">direction 方向</span>
            <el-radio-group v-model="direction">
              <el-radio value="vertical">vertical</el-radio>
              <el-radio value="horizontal">horizontal</el-radio>
            </el-radio-group>
          </div>

          <div>
            <span class="label">边框</span>
            <el-checkbox v-model="border">开启边框</el-checkbox>
          </div>
        </div>
      </template>
    </ProDescriptions>

    <ProDescriptions
      v-model="model"
      :request-api="DataServe.getList"
      title="传入请求函数 & 编辑时内部自动更新描述列表数据"
      :column="3"
      :columns
      :border
      :editable
      :direction
      :descriptions-item-props="{ align: position, minWidth: '60px' }"
      :form-props="{ elFormProps }"
      edit-button
      card
      @form-change="handleFormChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.title {
  display: flex;
  column-gap: 100px;
  justify-content: space-between;
  margin: 20px 0;

  .label {
    padding-right: 10px;
  }
}
</style>
