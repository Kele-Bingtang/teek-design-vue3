<script setup lang="ts" name="ExportExcel">
import { ref } from "vue";
import { Document, Top } from "@element-plus/icons-vue";
import { tableStatusFilter } from "@/common/config";
import { exportJsonToExcel, formatJsonToArray } from "@/common/utils";
import { largeData } from "@/mock/table/common";

const options = ["xlsx", "csv", "txt"];

const tableData = ref(largeData);
const downloadLoading = ref(false);
const filename = ref("");
const autoWidth = ref(true);
const bookType = ref("xlsx");

/**
 * 导出 Excel
 */
const handleDownload = () => {
  downloadLoading.value = true;

  const tHeader = ["ID", "Name", "Date", "Address", "Status", "Priority", "Title"];
  const filterVal = ["id", "name", "date", "address", "status", "priority", "title"];
  const list = tableData.value;
  const data = formatJsonToArray(list, filterVal);

  exportJsonToExcel(
    tHeader,
    data,
    filename.value !== "" ? filename.value : undefined,
    undefined,
    undefined,
    autoWidth.value,
    bookType.value
  );
  downloadLoading.value = false;
};
</script>

<template>
  <div class="export-excel-container tk-card-minimal pd-16">
    <div style="display: flex">
      <div>
        <label class="radio-label" style="padding-left: 0">文件名：</label>
        <el-input
          v-model="filename"
          placeholder="请输入导出的文件名，默认为 excel-table"
          style="width: 345px"
          :prefix-icon="Document"
        />
      </div>

      <div>
        <label class="radio-label">Cell Auto-Width：</label>
        <el-radio-group v-model="autoWidth">
          <el-radio :value="true" border>True</el-radio>
          <el-radio :value="false" border>False</el-radio>
        </el-radio-group>
      </div>

      <div>
        <label class="radio-label">文件类型：</label>
        <el-select v-model="bookType" style="width: 120px">
          <el-option v-for="item in options" :key="item" :label="item" :value="item" />
        </el-select>
      </div>

      <el-button
        v-waves
        plain
        :loading="downloadLoading"
        style="margin: 0 0 20px 20px"
        type="success"
        :icon="Top"
        @click="handleDownload"
      >
        Excel Export
      </el-button>
    </div>

    <el-table :data="tableData" border highlight-current-row row-key="id" style="width: 100%">
      <el-table-column prop="id" label="ID" width="70" align="center" sortable></el-table-column>
      <el-table-column prop="date" label="日期" width="180px"></el-table-column>
      <el-table-column prop="name" label="姓名" width="150px"></el-table-column>
      <el-table-column prop="title" min-width="100" label="标题"></el-table-column>
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
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.export-excel-container {
  .radio-label {
    padding: 0 12px 0 30px;
    font-size: 14px;
  }
}
</style>
