<script setup lang="ts" name="FixedHeaderTable">
import { simpleData } from "@/mock/table";

const tableData = ref(simpleData);
const key = ref(1);
const formTheadOptions = ref(["date", "address", "status", "title"]);
const checkboxVal = ref(["date", "address", "title"]);
const formThead = ref(checkboxVal.value);

watch(
  () => checkboxVal.value,
  (value: string[]) => {
    formThead.value = formTheadOptions.value.filter(i => value.indexOf(i) >= 0);
    key.value = key.value + 1;
  }
);
</script>

<template>
  <div>
    <el-checkbox-group v-model="checkboxVal">
      <el-checkbox value="date">date</el-checkbox>
      <el-checkbox value="address">address</el-checkbox>
      <el-checkbox value="status">status</el-checkbox>
      <el-checkbox value="title">title</el-checkbox>
    </el-checkbox-group>
  </div>

  <el-table :key="key" :data="tableData" border highlight-current-row style="width: 100%">
    <el-table-column prop="name" label="name" width="180" />
    <el-table-column v-for="col in formThead" :key="col" :label="col">
      <template #default="{ row }">
        {{ row[col] }}
      </template>
    </el-table-column>
  </el-table>
</template>
