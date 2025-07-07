<script setup lang="ts" name="InlineTable">
import { simpleData } from "@/mock/table";
import { ElMessage } from "element-plus";
import { tableStatusFilter } from "@/common/config";
import { Refresh, Check, EditPen } from "@element-plus/icons-vue";

const tableData = ref(simpleData);

onMounted(() => {
  tableData.value.map((item: any) => {
    item.edit = false;
    item.originalTitle = item.title;
    return item;
  });
});

const handleEdit = (row: any) => {
  if (row.edit) {
    cancelEdit(row);
  } else {
    row.edit = !row.edit;
  }
};
const cancelEdit = (row: any) => {
  row.title = row.originalTitle;
  row.edit = false;
  ElMessage.warning("标题已恢复为原始值！");
};

const confirmEdit = (row: any) => {
  row.edit = false;
  row.originalTitle = row.title;
  ElMessage.success("标题已编辑！");
};
</script>

<template>
  <div class="inline-table-container tk-card-minimal">
    <p>
      目前仅
      <span style="color: red">标题</span>
      可以修改，其他字段也是类似
    </p>
    <el-table
      :data="tableData"
      @row-dblclick="handleEdit"
      border
      highlight-current-row
      row-key="id"
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
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

      <el-table-column min-width="250px" label="标题">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" />
            <el-button class="cancel-btn" :icon="Refresh" type="warning" @click="cancelEdit(row)">取消</el-button>
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template #default="{ row }">
          <el-button v-if="row.edit" type="success" :icon="Check" @click="confirmEdit(row)">确定</el-button>
          <el-button v-else link type="primary" :icon="EditPen" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.inline-table-container {
  p {
    margin-bottom: 16px;
  }

  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
  }
}
</style>
