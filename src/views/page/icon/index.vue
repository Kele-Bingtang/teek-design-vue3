<script setup lang="ts" name="IconDemo">
import { IconPicker } from "@/components";
import Upload from "@iconify-icons/ant-design/upload";

const currentIcon = ref("");
</script>

<template>
  <el-space fill>
    <el-card shadow="never">
      <template #header>
        <span>使用 Icon 组件</span>
      </template>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="在线 Icon 图标，传入字符串：<Icon icon='ep:add-location'></Icon>" width="300">
          <Icon icon="ep:add-location"></Icon>
        </el-descriptions-item>
        <el-descriptions-item label="本地 Icon 图标，需引入 Upload 再传入：<Icon :icon='Upload'></Icon>" width="300">
          <Icon :icon="Upload"></Icon>
        </el-descriptions-item>
        <el-descriptions-item label="本地 FontIcon 图标：<Icon icon='IF-icon-dagouyouquan'></Icon>" width="300">
          <Icon hover-color="red" icon="IF-icon-dagouyouquan"></Icon>
        </el-descriptions-item>
        <el-descriptions-item label="本地 SVG 图标：<Icon icon='svg-core-bug'></Icon>" width="300">
          <Icon icon="SVG-core-bug"></Icon>
        </el-descriptions-item>
        <el-descriptions-item label="本地 SVG 图标：<Icon icon='core-bug'></Icon>" width="300">
          <Icon icon="core-bug"></Icon>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span>图标选择器</span>
      </template>
      <div style="width: 600px">
        <IconPicker v-model="currentIcon" tip />
      </div>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="图标选择器 配置项 📚" :column="1" border>
        <el-descriptions-item label="v-model/modelValue">接收图标名字的响应式</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>
