<script setup lang="ts" name="pageTable">
import type { PaginationInfo } from "@/components";
import { ref, reactive, computed } from "vue";
import { Star } from "@element-plus/icons-vue";
import { tableStatusFilter } from "@/common/config";
import { Pagination, defaultPaginationInfo } from "@/components";
import { largeData } from "@/mock/table/common";

const tableData = ref(largeData);
const paging = reactive(defaultPaginationInfo);

const tablePageData = computed(() =>
  tableData.value.slice((paging.pageNum - 1) * paging.pageSize, paging.pageNum * paging.pageSize)
);

const handleSizeChange = (pagingParam: PaginationInfo) => {
  paging.pageNum = pagingParam.pageNum;
  paging.pageSize = pagingParam.pageSize;
};
</script>

<template>
  <div class="tk-card-minimal">
    <el-table :data="tablePageData" border highlight-current-row row-key="id" style="width: 100%">
      <el-table-column prop="id" label="ID" width="70" align="center" sortable></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="tableStatusFilter(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级">
        <template #default="{ row }">
          <Icon v-for="n in row.priority" :key="n" :icon="Star" style="color: #606266" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="tableData.length > 0" :total="tableData.length" v-model="paging" @change="handleSizeChange" />
  </div>
</template>
