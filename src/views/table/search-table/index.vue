<script setup lang="ts" name="SearchTable">
import { middleData } from "@/mock/table";
import { ElMessageBox, ElNotification } from "element-plus";
import { tableStatusFilter } from "@/common/config";
import { Search, Refresh, Delete } from "@element-plus/icons-vue";

const searchOptions = [
  {
    value: "id",
    label: "ID",
  },
  {
    value: "date",
    label: "日期",
  },
  {
    value: "name",
    label: "姓名",
  },
  {
    value: "address",
    label: "地址",
  },
  {
    value: "status",
    label: "状态",
  },
  {
    value: "priority",
    label: "优先级",
  },
];

const statusOptions = [
  {
    value: "Enable",
    label: "Enable",
  },
  {
    value: "Disable",
    label: "Disable",
  },
  {
    value: "Deleted",
    label: "Deleted",
  },
];

const priorityOptions = [1, 2, 3, 4, 5];

const loading = ref(true);
const tableData = ref(middleData);
const singleSearchKey = ref("");
const singleSearchValue = ref("");
const multipleSearchParams = reactive({
  name: "",
  status: "",
  priority: "",
});

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 500);
});

const handleSearch = (type: "single" | "multiple") => {
  loading.value = true;
  tableData.value = middleData;
  if (type === "single") {
    if (!singleSearchValue.value) {
      setTimeout(() => {
        loading.value = false;
      }, 500);
      return;
    }
    tableData.value = tableData.value.filter(item => {
      if (singleSearchKey.value === "priority") {
        return item.priority === parseInt(singleSearchValue.value);
      }
      return (item as any)[singleSearchKey.value].indexOf(singleSearchValue.value) !== -1;
    });
  } else {
    if (
      multipleSearchParams.name === "" &&
      multipleSearchParams.status === "" &&
      multipleSearchParams.priority === ""
    ) {
      setTimeout(() => {
        loading.value = false;
      }, 500);
      return;
    }
    let tableDataTemp = tableData.value;
    if (multipleSearchParams.name) {
      tableDataTemp = tableDataTemp.filter(item => {
        return item.name.indexOf(multipleSearchParams.name) !== -1;
      });
    }
    if (multipleSearchParams.status) {
      tableDataTemp = tableDataTemp.filter(item => {
        return item.status === multipleSearchParams.status;
      });
    }
    if (multipleSearchParams.priority) {
      tableDataTemp = tableDataTemp.filter(item => {
        return item.priority === parseInt(multipleSearchParams.priority);
      });
    }
    tableData.value = tableDataTemp;
  }
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

const handleReset = () => {
  tableData.value = middleData;
};

const handleDelete = (row: any, index: number) => {
  ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      tableData.value.splice(index, 1);
      ElNotification.success({
        title: "Success",
        message: "删除成功！",
      });
    })
    .catch(() => {});
};
</script>

<template>
  <div class="single-search-table-container tk-card-minimal">
    <div class="search-container">
      <div class="single-search search-content">
        <el-select v-model="singleSearchKey" placeholder="关键词" clearable style="width: 150px">
          <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input
          v-model="singleSearchValue"
          placeholder="输入关键词搜索"
          style="width: 200px"
          @keyup.enter="handleSearch('single')"
        />
        <el-button v-waves type="primary" :icon="Search" @click="handleSearch('single')" style="margin-left: 10px">
          单条件查询
        </el-button>
      </div>
      <div class="multiple-search search-content">
        <el-input v-model="multipleSearchParams.name" placeholder="姓名" style="width: 200px" />
        <el-select v-model="multipleSearchParams.status" placeholder="状态" clearable style="width: 130px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="multipleSearchParams.priority" placeholder="优先级" clearable style="width: 120px">
          <el-option v-for="item in priorityOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button v-waves type="primary" :icon="Search" @click="handleSearch('multiple')" style="margin-left: 10px">
          多条件查询
        </el-button>
        <el-button v-waves type="primary" :icon="Refresh" @click="handleReset">重置</el-button>
      </div>
    </div>

    <el-table :data="tableData" v-loading="loading" border highlight-current-row row-key="id" style="width: 100%">
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
          <Icon v-for="n in row.priority" :key="n" name="star" style="color: #606266" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template #default="{ row, $index }">
          <el-button link type="danger" :icon="Delete" @click="handleDelete(row, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.single-search-table-container {
  p {
    margin-bottom: 16px;
  }

  .search-container {
    margin-bottom: 20px;

    .search-content {
      display: inline-block;
    }

    .multiple-search {
      margin-left: 20px;
    }
  }
}
</style>
