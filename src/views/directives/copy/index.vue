<script setup lang="ts" name="Copy">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const data = ref<string>("https://github.com/Kele-Bingtang/teek-design-vue3");
</script>

<template>
  <el-space fill alignment="normal" style="width: 100%; height: 100%">
    <el-card shadow="never" header="自定义复制指令" class="tk-card-minimal">
      <p style="margin-bottom: 16px">在标签上加 v-copy="data"，data 为复制的内容。</p>
      <div>
        <el-input placeholder="请输入内容" v-model="data" style="width: 500px">
          <template #append>
            <el-button v-copy="data">复制</el-button>
          </template>
        </el-input>
      </div>
      <p style="margin-top: 16px">
        如果需要点击事件触发复制，请看
        <el-button link type="primary" @click="router.push('/plugins/clipboard')">文本复制</el-button>
      </p>
    </el-card>
  </el-space>
</template>
