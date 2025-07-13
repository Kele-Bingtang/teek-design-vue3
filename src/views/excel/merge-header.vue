<script setup lang="ts" name="MergeHeader">
import { ref } from "vue";
import { Top } from "@element-plus/icons-vue";
import { exportJsonToExcel, formatJsonToArray } from "@/common/utils";
import { largeData } from "@/mock/table/common";
import { tableStatusFilter } from "@/common/config";

const tableData = ref(largeData);
const downloadLoading = ref(false);

/**
 * 导出 Excel
 */
const handleDownload = () => {
  downloadLoading.value = true;

  const filterVal = ["id", "name", "date", "address", "status", "priority", "title"];
  const header = ["ID", "Date", "Name", "Address", "Status", "Priority", "Title"];
  const multiHeader = [["ID", "Date", "Info", "", "", "", ""]];
  const merges = ["A1:A2", "B1:B2", "C1:G1"]; // 合并表头的位置
  const list = tableData.value;
  const data = formatJsonToArray(list, filterVal);
  exportJsonToExcel(header, data, "merge-header", multiHeader, merges);
  downloadLoading.value = false;
};
</script>

<template>
  <div class="tk-card-minimal">
    <el-button
      :loading="downloadLoading"
      style="margin-bottom: 20px"
      type="success"
      :icon="Top"
      @click="handleDownload"
    >
      Excel Export
    </el-button>

    <el-table :data="tableData" border highlight-current-row row-key="id" style="width: 100%">
      <el-table-column prop="id" label="ID" width="70" align="center" sortable></el-table-column>
      <el-table-column prop="date" label="日期" width="180px"></el-table-column>
      <el-table-column label="Info" align="center">
        <el-table-column prop="name" label="姓名" width="150px"></el-table-column>
        <el-table-column min-width="100" label="标题"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="status" label="状态" width="140">
          <template #default="{ row }">
            <el-tag :type="tableStatusFilter(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="140">
          <template #default="{ row }">
            <Icon v-for="n in row.priority" :key="n" name="star" style="color: #606266" />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
