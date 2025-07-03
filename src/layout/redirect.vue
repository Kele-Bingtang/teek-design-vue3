<script setup lang="ts">
import { useRouter } from "vue-router";

defineOptions({ name: "Redirect" });

const { currentRoute, replace } = useRouter();

const { params, query } = currentRoute.value;
const { path } = params;

/**
 * 重定向路径
 */
const _path = Array.isArray(path) ? path.join("/") : path;

replace({ path: "/" + _path, query });
</script>

<template>
  <div />
</template>
