<script setup lang="ts" name="DraggableItemDemo">
import { DraggableItem } from "@/components";
import { list1, list2, list3 } from "@/mock/drag-item";

const group = ref("drag_item");
const listData1 = ref(list1);
const listData2 = ref(list2);
const listData3 = ref(list3);
</script>

<template>
  <el-space fill>
    <el-card>
      <div style="display: flex; width: 100%">
        <DraggableItem :key="1" :list="listData1" :group="group" title-bg-color="#4A9FF9" title="Todo">
          <template #content="{ item }">
            {{ item.name }}
          </template>
        </DraggableItem>
        <DraggableItem :key="2" :list="listData2" :group="group" title-bg-color="#F9944A">
          <template #title>Working</template>
          <template #content="{ item }">
            {{ item.name }}
          </template>
        </DraggableItem>
        <DraggableItem :key="3" :list="listData3" :group="group" title-bg-color="#2AC06D">
          <template #title>Done</template>
          <template #content="{ item }">
            {{ item.name }}
          </template>
        </DraggableItem>
      </div>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="title">标题。`string` 类型，默认为 `"header"`</el-descriptions-item>
        <el-descriptions-item label="list">
          数量列表。`{ id: string; name: string; }[]` 类型，默认为 `[]`
        </el-descriptions-item>
        <el-descriptions-item label="titleBgColor">标题背景色。`string` 类型，默认为 `""`</el-descriptions-item>
        <el-descriptions-item label="titleClass">标题元素 class。`string` 类型，默认为 `""`</el-descriptions-item>
        <el-descriptions-item label="dragClass">拖拽元素 class。`string` 类型，默认为 `""`</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>
