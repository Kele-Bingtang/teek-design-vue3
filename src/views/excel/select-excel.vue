<script setup lang="ts" name="SelectExcel">
import { exportJsonToExcel, formatJsonToArray } from "@/common/utils";
import { largeData } from "@/mock/table";
import { ElMessage, ElTable } from "element-plus";
import { tableStatusFilter } from "@/common/config";
import { Document, Top } from "@element-plus/icons-vue";

const tableData = ref(largeData);
const multipleSelection = ref([]);
const downloadLoading = ref(false);
const filename = ref("");
const multipleTableRef = useTemplateRef<InstanceType<typeof ElTable>>("multipleTableRef");

const handleSelectionChange = (value: any) => {
  multipleSelection.value = value;
};

const handleDownload = () => {
  if (multipleSelection.value.length) {
    downloadLoading.value = true;
    const tHeader = ["ID", "Name", "Date", "Address", "Status", "Priority", "Title"];
    const filterVal = ["id", "name", "date", "address", "status", "priority", "title"];
    const list = multipleSelection.value;
    const data = formatJsonToArray(list, filterVal);
    exportJsonToExcel(tHeader, data, filename.value !== "" ? filename.value : undefined);
    multipleTableRef.value?.clearSelection();
    downloadLoading.value = false;
  } else {
    ElMessage.warning("请至少选择一行数据");
  }
};
</script>

<template>
  <div class="select-excel-container">
    <el-input
      v-model="filename"
      placeholder="请输入导出的文件名，默认为 excel-table"
      style="width: 350px"
      :prefix-icon="Document"
    />
    <el-button :loading="downloadLoading" type="success" :icon="Top" @click="handleDownload">导出选择的数据</el-button>

    <el-table
      ref="multipleTableRef"
      :data="tableData"
      border
      highlight-current-row
      row-key="id"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column prop="id" label="ID" width="70" align="center" sortable></el-table-column>
      <el-table-column prop="date" label="日期" width="180px"></el-table-column>
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
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.select-excel-container {
  padding: 10px 12px;
  background-color: #ffffff;
}
</style>
