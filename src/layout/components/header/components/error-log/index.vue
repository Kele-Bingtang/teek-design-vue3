<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ElBadge } from "element-plus";
import { useNamespace } from "@/composables";

defineOptions({ name: "ErrorLog" });

const ns = useNamespace("error-badge");
const route = useRoute();
const router = useRouter();
const props = defineProps<{ errorCount: number }>();

/**
 * 打开错误日志页面
 */
const openErrorLogger = () => {
  if (route.path !== "/error-log") router.push("/error-log");
};
</script>

<template>
  <el-badge :class="ns.b()" :value="props.errorCount" :max="99" :hidden="props.errorCount === 0">
    <Icon icon="core-bug" @click.stop="openErrorLogger" />
  </el-badge>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
