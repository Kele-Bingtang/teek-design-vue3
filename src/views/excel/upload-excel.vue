<script setup lang="ts" name="UploadExcel">
import type { ExcelData } from "@/components";
import { UploadExcel } from "@/components";
import { ElMessage } from "element-plus";

const tableData = ref([]);
const tableHeader = ref<string[]>([]);
const radio = ref(1);

/**
 * 上传前事件
 */
const beforeUpload = (file: File) => {
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (isLt1M) {
    return true;
  }
  ElMessage.warning("Please do not upload files larger than 1m in size.");
  return false;
};

/**
 * 上传成功事件
 */
const handleSuccess = ({ results, header }: ExcelData) => {
  tableData.value = results;
  tableHeader.value = header;
};
</script>

<template>
  <div class="upload-excel-container tk-card-minimal">
    <el-radio-group v-model="radio">
      <el-radio :value="1">拖拽 & 按钮上传</el-radio>
      <el-radio :value="2">按钮上传</el-radio>
    </el-radio-group>

    <UploadExcel v-if="radio === 1" :on-success="handleSuccess" :before-upload="beforeUpload" drag />
    <UploadExcel v-else :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%; margin-top: 20px">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.upload-excel-container {
  height: 100%;

  .el-radio-group {
    margin-bottom: 16px;
  }
}
</style>
