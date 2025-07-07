<script setup lang="ts" name="Throttle">
import { ElMessage } from "element-plus";

const throttleClick = () => {
  ElMessage.success("我是节流按钮触发的事件 🍍🍓🍌");
};
</script>

<template>
  <el-space fill alignment="normal" style="width: 100%; height: 100%">
    <el-card shadow="never" header="节流指令" class="tk-card-minimal">
      <p style="margin-bottom: 16px">节流，就是指连续触发事件但是在 n 秒中只执行一次函数。节流会稀释函数的执行频率。</p>
      <p style="margin-bottom: 16px">在标签上加 v-throttle="throttleClick"，其中 throttleClick 为节流的事件。</p>
      <el-button type="primary" v-throttle="throttleClick">节流按钮 (每隔 1S 秒后执行)</el-button>
    </el-card>
  </el-space>
</template>
