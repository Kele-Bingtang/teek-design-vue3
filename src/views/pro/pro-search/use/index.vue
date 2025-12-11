<script setup lang="ts" name="UseProSearchDemo">
import type { SearchColumn, ActionPosition } from "@/components";
import { ref, reactive } from "vue";
import { ProSearch, useProSearch } from "@/components";

const { searchRegister, searchMethods } = useProSearch();
const { setColumn, setProps, setValues, getFormModel } = searchMethods;

const model = ref({});

const handleSearch = async (data: any) => {
  const formData = await getFormModel();
  console.log(formData);
  console.log(data);
};

const changePosition = (position: ActionPosition) => {
  setProps({ position });
};

const changeSex = (del: boolean) => {
  setColumn([
    {
      prop: "sex",
      field: "destroy",
      value: del,
    },
  ]);
};

const setValue = () => {
  setValues({
    name: "Young Kbt",
  });
};

const changeCollapsedRows = (rows: number) => {
  setProps({ showRow: rows });
};

const useCollapsed = (use: boolean) => {
  setProps({ showCollapse: use });
};

const changeSearchLoading = () => {
  setProps({ searchLoading: true });
  setTimeout(() => {
    setProps({ searchLoading: false });
  }, 2000);
};

const changeResetLoading = () => {
  setProps({ resetLoading: true });
  setTimeout(() => {
    setProps({ resetLoading: false });
  }, 2000);
};

const columns: SearchColumn[] = reactive([
  {
    label: "姓名",
    prop: "name",
    el: "el-input",
  },
  {
    label: "性别",
    prop: "sex",
    el: "el-select",
    options: [
      { label: "男", value: "1" },
      { label: "女", value: "2" },
    ],
  },
  {
    label: "年龄",
    prop: "age",
    el: "el-input-number",
    defaultValue: 18,
  },
  {
    label: "状态",
    prop: "status",
    el: "el-select",
    options: [
      { label: "在职", value: "1" },
      { label: "离职", value: "2" },
    ],
  },
  {
    label: "input 框",
    prop: "input",
    el: "el-input",
  },
  {
    label: "input 框",
    prop: "input1",
    el: "el-input",
  },
  {
    label: "input 框",
    prop: "input2",
    el: "el-input",
  },
  {
    label: "input 框",
    prop: "input3",
    el: "el-input",
  },
  {
    label: "input 框",
    prop: "input4",
    el: "el-input",
  },
]);
</script>

<template>
  <el-space fill>
    <el-card shadow="never">
      <el-space wrap>
        <el-button @click="changePosition('left')">按钮不换行 位置左</el-button>
        <el-button @click="changePosition('right')">按钮不换行 位置右</el-button>
        <el-button @click="changePosition('block-left')">按钮换行 位置左</el-button>
        <el-button @click="changePosition('block-center')">按钮换行 位置中</el-button>
        <el-button @click="changePosition('block-right')">按钮换行 位置右</el-button>
        <el-button @click="changeSex(true)">删除性别</el-button>
        <el-button @click="changeSex(false)">恢复性别</el-button>
        <el-button @click="setValue()">设置姓名值</el-button>
        <el-button @click="changeCollapsedRows(2)">默认显示两行</el-button>
        <el-button @click="changeCollapsedRows(1)">默认显示一行</el-button>
        <el-button @click="useCollapsed(false)">关闭折叠功能</el-button>
        <el-button @click="useCollapsed(true)">使用折叠功能</el-button>
        <el-button @click="changeSearchLoading">搜索按钮 loading</el-button>
        <el-button @click="changeResetLoading">重置按钮 loading</el-button>
      </el-space>
    </el-card>

    <ProSearch :columns v-model="model" @search="handleSearch" @reset="handleSearch" @register="searchRegister" />
    {{ model }}
  </el-space>
</template>
