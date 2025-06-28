<script setup lang="ts" name="HighlightDemo">
import { Highlight } from "@/components";
import { message } from "@/common/utils";

const handleClick = (key: string) => {
  message.info(key);
};
</script>

<template>
  <el-space fill>
    <el-card shadow="never" header="高亮组件">
      <Highlight :keys="['高亮', '点击我']" @click="handleClick">我是 高亮 组件，点击我 试试看</Highlight>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="tag">文本标签。`string` 类型，默认为 `span`</el-descriptions-item>
        <el-descriptions-item label="keys">高亮的关键词。`string[]` 类型，默认为 `[]`</el-descriptions-item>
        <el-descriptions-item label="color">
          高亮关键词的颜色。`string` 类型，默认 `cssVarEl(color-primary)`
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>
