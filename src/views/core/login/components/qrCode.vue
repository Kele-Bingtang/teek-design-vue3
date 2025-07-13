<script setup lang="ts" name="QrCode">
import { inject } from "vue";
import { CircleClose } from "@element-plus/icons-vue";
import { QrCode } from "@/components";

const switchLoginMode = inject("switchLoginMode") as (mode: string) => void;
</script>

<template>
  <div class="qrCode-container">
    <QrCode text="模拟登录" />

    <el-divider>
      <span>扫码后点击"确认"，即可完成登录</span>
    </el-divider>

    <el-button :icon="CircleClose" round size="large" @click="switchLoginMode('login')">返回</el-button>
  </div>
</template>

<style lang="scss" scoped>
.qrCode-container {
  text-align: center;
}
</style>
