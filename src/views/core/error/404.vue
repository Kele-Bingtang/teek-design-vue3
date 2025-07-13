<script setup lang="ts">
import { useRouter } from "vue-router";
import { HOME_URL } from "@/common/config";
import { useNamespace } from "@/composables";

defineOptions({ name: "404" });

const ns = useNamespace("error-page");

const router = useRouter();
</script>

<template>
  <div :class="ns.b()" class="flx-center">
    <img src="@/common/assets/images/status/404.png" :class="ns.e('img')" alt="404" />
    <div :class="ns.e('detail')">
      <h2>404</h2>
      <h4>抱歉，您访问的页面不存在~🤷‍♂️🤷‍♀️</h4>
      <el-button type="primary" @click="router.push(HOME_URL)">返回首页</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "./index";
</style>
