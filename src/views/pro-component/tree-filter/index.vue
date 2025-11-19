<script setup lang="ts" name="TreeFilterDemo">
import type { TreeKey } from "element-plus";
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import { TreeFilter } from "@/components";
import { useNamespace } from "@/composables";

const ns = useNamespace("tree-filter-demo");

interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}

const treeFilterValue = reactive<{ departmentId: string }>({ departmentId: "1" });
const changeTreeFilter = (val: string | TreeKey[]) => {
  ElMessage.success(`你选择了 id 为 ${val} 的数据🤔`);
  treeFilterValue.departmentId = val as string;
};

const treeFilterValue1 = reactive<{ departmentId: TreeKey[] }>({ departmentId: ["11"] });
const changeTreeFilter1 = (val: string | TreeKey[]) => {
  ElMessage.success(`你选择了 id 为 ${JSON.stringify(val)} 的数据🤔`);
  treeFilterValue1.departmentId = val as TreeKey[];
};

const data: Tree[] = [
  {
    id: 1,
    label: "Level one 1",
    children: [
      {
        id: 4,
        label: "Level two 1-1",
        children: [
          { id: 9, label: "Level three 1-1-1" },
          { id: 10, label: "Level three 1-1-2" },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Level one 2",
    children: [
      { id: 5, label: "Level two 2-1" },
      { id: 6, label: "Level two 2-2" },
    ],
  },
  {
    id: 3,
    label: "Level one 3",
    children: [
      { id: 7, label: "Level two 3-1" },
      { id: 8, label: "Level two 3-2" },
    ],
  },
];
</script>

<template>
  <div :class="ns.b()">
    <TreeFilter
      label="label"
      title="部门列表(单选)"
      :data="data"
      :defaultValue="treeFilterValue.departmentId"
      @change="changeTreeFilter"
      show-more
    />
    <TreeFilter
      title="部门列表(多选)"
      multiple
      label="label"
      :data="data"
      :defaultValue="treeFilterValue1.departmentId"
      @change="changeTreeFilter1"
      show-more
    />
    <el-card :class="[ns.e('descriptions'), 'tk-card-minimal']">
      <h2>树形筛选器 🍓🍇🍈🍉</h2>
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="requestApi">请求分类数据的 api</el-descriptions-item>
        <el-descriptions-item label="data">分类数据，如果有分类数据，则不会执行 api 请求</el-descriptions-item>
        <el-descriptions-item label="title">treeFilter 标题</el-descriptions-item>
        <el-descriptions-item label="id">选择的id，默认为 “id”</el-descriptions-item>
        <el-descriptions-item label="label">显示的label，默认为 “label”</el-descriptions-item>
        <el-descriptions-item label="multiple">是否为多选，默认为 false</el-descriptions-item>
        <el-descriptions-item label="defaultValue">默认选中的值</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(tree-filter-demo) {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100%;

  @include e(descriptions) {
    flex: 1;
    height: 100%;
  }
}
</style>
