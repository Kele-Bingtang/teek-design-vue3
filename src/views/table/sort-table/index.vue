<script setup lang="ts" name="SortTable">
import type { PaginationInfo } from "@/components";
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, EditPen, Delete } from "@element-plus/icons-vue";
import { Pagination, defaultPaginationInfo, TableSort } from "@/components";
import { largeData } from "@/mock/table/common";

const loading = ref(true);
const tableData = ref(largeData);
const paging = reactive(defaultPaginationInfo);

const data = computed(() =>
  tableData.value.slice((paging.pageNum - 1) * paging.pageSize, paging.pageNum * paging.pageSize)
);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 500);
});

/**
 * 查看
 */
const handleLook = () => {
  ElMessage.warning("消息弹框演示：无法查看");
};

/**
 * 编辑
 */
const handleEdit = () => {
  ElMessage.warning("消息弹框演示：无法查看");
};

/**
 * 删除
 */
const handleDelete = (row: any, index: number) => {
  ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      tableData.value.splice(index, 1);
      ElMessage({
        message: "消息弹框演示：删除成功",
        type: "success",
        duration: 3000,
      });
    })
    .catch(() => {});
};

/**
 * 分页大小改变
 */
const handleSizeChange = (pagingParams: PaginationInfo) => {
  paging.pageNum = pagingParams.pageNum;
  paging.pageSize = pagingParams.pageSize;
};

/**
 * 表格行类名
 */
const tableRowClassName = (row: any) => {
  if (row.rowIndex && row.rowIndex % 2 === 1) {
    return "table-highlight-row";
  } else {
    return "table-default-row";
  }
};

/**
 * 表格状态过滤
 */
const tableStatusFilter = (status: string): "success" | "info" | "danger" => {
  const statusMap: Record<string, "success" | "info" | "danger"> = {
    Enable: "success",
    Disable: "info",
    Deleted: "danger",
  };
  return statusMap[status];
};
</script>

<template>
  <div class="table-sort-container tk-card-minimal">
    <p>方法一：使用 TableSoft 组件代替 el-table</p>
    <TableSort
      :data="data"
      border
      highlight-current-row
      :header-cell-style="{
        background: '#fafafa',
        'text-align': 'center',
      }"
      :loading="loading"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="id" label="ID" width="70" align="center" sortable="custom"></el-table-column>
      <el-table-column prop="date" label="日期" width="180px" sortable="custom"></el-table-column>
      <el-table-column prop="name" label="姓名" width="150px" sortable="custom"></el-table-column>
      <el-table-column prop="title" min-width="100" label="标题"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="status" label="状态" width="140">
        <template #default="{ row }">
          <el-tag :type="tableStatusFilter(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级" width="140" sortable="custom">
        <template #default="{ row }">
          <Icon v-for="n in row.priority" :key="n" name="star" style="color: #606266" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="190px">
        <template #default="{ row, $index }">
          <el-button link size="small" :icon="Search" @click="handleLook">查看</el-button>
          <el-button link type="primary" size="small" :icon="EditPen" @click="handleEdit">编辑</el-button>
          <el-button link type="danger" size="small" :icon="Delete" @click="handleDelete(row, $index)">删除</el-button>
        </template>
      </el-table-column>
    </TableSort>
    <Pagination v-show="tableData.length > 0" :total="tableData.length" v-model="paging" @change="handleSizeChange" />

    <p>方法二：使用 TableSoft 组件包裹 el-table，el-table 作为插槽</p>
    <TableSort :data="data">
      <template #custom="{ headerCellClassName, sortChange }">
        <el-table
          :data="data"
          border
          highlight-current-row
          :header-cell-style="{
            background: '#fafafa',
            'text-align': 'center',
          }"
          v-loading="loading"
          :row-class-name="tableRowClassName"
          :header-cell-class-name="headerCellClassName"
          @sort-change="sortChange"
        >
          <el-table-column prop="id" label="ID" width="70" align="center" sortable="custom"></el-table-column>
          <el-table-column prop="date" label="日期" width="180px" sortable="custom"></el-table-column>
          <el-table-column prop="name" label="姓名" width="150px" sortable="custom"></el-table-column>
          <el-table-column prop="title" min-width="100" label="标题"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="status" label="状态" width="140">
            <template #default="{ row }">
              <el-tag :type="tableStatusFilter(row.status)">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="priority" label="优先级" width="140" sortable="custom">
            <template #default="{ row }">
              <Icon v-for="n in row.priority" :key="n" name="star" style="color: #606266" />
            </template>
          </el-table-column>

          <el-table-column label="操作" width="190px">
            <template #default="{ row, $index }">
              <el-button link size="small" :icon="Search" @click="handleLook">查看</el-button>
              <el-button link type="primary" size="small" :icon="EditPen" @click="handleEdit">编辑</el-button>
              <el-button link type="danger" size="small" :icon="Delete" @click="handleDelete(row, $index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TableSort>
    <Pagination v-show="tableData.length > 0" :total="tableData.length" v-model="paging" @change="handleSizeChange" />
  </div>
</template>

<style lang="scss" scoped>
.table-sort-container {
  p {
    margin-bottom: 16px;
  }

  .search-container {
    margin-bottom: 20px;
  }
}
</style>
