<script setup lang="ts" name="Debounce">
import { ElMessage } from "element-plus";

const debounceClick = () => {
  ElMessage.success("我是防抖按钮触发的事件 🍍🍓🍌");
};
</script>

<template>
  <el-space fill alignment="normal" style="width: 100%; height: 100%">
    <el-card shadow="never" header="防抖指令" class="tk-card-minimal">
      <p style="margin-bottom: 16px">
        防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
      </p>
      <p style="margin-bottom: 16px">在标签上加 v-debounce="debounceClick"，其中 debounceClick 为防抖的事件。</p>
      <el-button type="primary" v-debounce="debounceClick">防抖按钮 (0.5 秒后执行)</el-button>
    </el-card>
  </el-space>
</template>
