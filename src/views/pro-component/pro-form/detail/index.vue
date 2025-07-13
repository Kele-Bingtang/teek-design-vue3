<script setup lang="ts" name="DetailProForm">
import { ref } from "vue";
import { ProForm } from "@/components";
import { columns, elFormProps } from "./options";

const model = ref({});
</script>

<template>
  <div style="padding: 10px">
    <el-card shadow="never" style="padding: 20px">
      <template #header>
        <div>超级表单详情页</div>
      </template>
      <ProForm :elFormProps="elFormProps" :colProps="{ span: 12 }" :columns v-model="model"></ProForm>
    </el-card>

    {{ model }}
  </div>
</template>
