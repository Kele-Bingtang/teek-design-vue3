<script setup lang="ts" name="ParamsDetail">
import { useDetail } from "./use-tabs";

const { id } = useDetail();
</script>

<template>
  <div>{{ id }} - 详情页内容在此（params 传参）</div>
</template>
