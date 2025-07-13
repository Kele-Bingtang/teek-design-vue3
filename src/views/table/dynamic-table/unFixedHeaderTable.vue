<script setup lang="ts" name="UnFixedHeaderTable">
import { ref } from "vue";
import { simpleData } from "@/mock/table/common";

const tableData = ref(simpleData);
const formThead = ref(["date", "address"]);
</script>

<template>
  <div>
    <el-checkbox-group v-model="formThead">
      <el-checkbox value="date">date</el-checkbox>
      <el-checkbox value="address">address</el-checkbox>
      <el-checkbox value="status">status</el-checkbox>
      <el-checkbox value="title">title</el-checkbox>
    </el-checkbox-group>
  </div>

  <el-table :data="tableData" border highlight-current-row style="width: 100%">
    <el-table-column prop="name" label="name" width="180" />
    <el-table-column v-for="col in formThead" :key="col" :label="col">
      <template #default="{ row }">
        {{ row[col] }}
      </template>
    </el-table-column>
  </el-table>
</template>
