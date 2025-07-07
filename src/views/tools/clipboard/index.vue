<script setup lang="ts" name="Clipboard">
import { ElMessage } from "element-plus";
import useClipboard from "vue-clipboard3";
import { Document } from "@element-plus/icons-vue";
import { useClipboard as vueuseClipboard } from "@vueuse/core";

const { toClipboard } = useClipboard();
const content = ref("https://github.com/Kele-Bingtang/teek-design-vue3");

const doClipboard = () => {
  toClipboard(content.value) // 复制该内容前，你可以添加以前额外的信息，如个人版权声明
    .then(() => {
      clipboardSuccess();
    })
    .catch(() => {
      clipboardFailed();
    });
};

const clipboardSuccess = () => {
  ElMessage({
    message: "Copy successfully",
    type: "success",
    duration: 1500,
  });
};
const clipboardFailed = () => {
  ElMessage({
    message: "Copy failed",
    type: "error",
    duration: 1500,
  });
};

const source = ref("https://github.com/Kele-Bingtang/teek-design-vue3");
const { text, copy, copied, isSupported } = vueuseClipboard({ source });
</script>

<template>
  <el-space fill style="width: 100%">
    <el-card shadow="never" header="vue-clipboard3 插件：点击按钮即可复制内容" class="tk-card-minimal">
      <el-input v-model="content" placeholder="请输入" style="width: 400px; max-width: 100%" />
      <el-button type="primary" :icon="Document" @click="doClipboard()">复制</el-button>
    </el-card>

    <el-card shadow="never" header="@vueuse/core 插件：点击按钮即可复制内容" class="tk-card-minimal">
      <div v-if="isSupported">
        <el-input v-model="source" placeholder="请输入" style="width: 400px; max-width: 100%" />
        <el-button type="primary" :icon="Document" @click="copy(source)">复制</el-button>

        <p>
          <span v-if="copied">复制成功！</span>
          当前值:
          <code>{{ text || "none" }}</code>
        </p>
      </div>
      <p v-else>你的浏览器不支持 Clipboard API</p>
    </el-card>
  </el-space>
</template>
