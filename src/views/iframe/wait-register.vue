<script setup lang="ts">
import { message } from "@/common/utils";

onMounted(() => {
  message.success("我被嵌入页面注册了");
});
</script>

<template>
  <div>我是一个被嵌入页面注册的新页面</div>
</template>
