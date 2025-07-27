<script setup lang="ts" name="IntegrationTable">
import type { FormInstance } from "element-plus";
import type { PaginationInfo } from "@/components";
import { ref, useTemplateRef, shallowRef, onMounted, nextTick, watch, reactive } from "vue";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { Search, Refresh, Plus, Check, EditPen, Delete, Star } from "@element-plus/icons-vue";
import Sortable from "sortablejs";
import { tableStatusFilter } from "@/common/config";
import { Pagination, TableSort, defaultPaginationInfo } from "@/components";
import { useNamespace } from "@/composables";
import { largeData } from "@/mock/table/common";

const defaultTableData = {
  id: "",
  name: "",
  date: "",
  address: "",
  status: "",
  priority: 0,
  title: "",
};

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

const ns = useNamespace();
const dialogTitle: Record<string, string> = {
  look: "查看",
  edit: "编辑",
  add: "创建",
};
const rules = {
  date: [{ required: true, message: "date is required", trigger: "change" }],
  name: [{ required: true, message: "name is required", trigger: "change" }],
  title: [{ required: true, message: "title is required", trigger: "blur" }],
};

const tableKey = ref(0);
const showAddress = ref(false);
const loading = ref(true);
const tableData = ref(largeData);
const paging = reactive(defaultPaginationInfo);
const singleSearchKey = ref("");
const singleSearchValue = ref("");
const multipleSearchParams = reactive({
  name: "",
  status: "",
  priority: "",
});
const dialogFormVisible = ref(false);
const dialogStatus = ref("");
const tempTableDate = ref(defaultTableData);
const sortable = shallowRef();
const tableRef = useTemplateRef("tableRef");
const formRef = useTemplateRef<FormInstance>("formRef");

watch(
  () => showAddress.value,
  () => {
    sortable.value = null;
    nextTick(() => {
      rowDrop();
    });
  }
);

onMounted(() => {
  tableData.value.map((item: any) => {
    item.edit = false;
    item.originalTitle = item.title;
    return item;
  });
  setTimeout(() => {
    loading.value = false;
  }, 500);
  rowDrop();
});

const rowDrop = () => {
  const el = tableRef.value?.el?.$el.querySelector(
    `.${ns.elNamespace}-table__body-wrapper .${ns.elNamespace}-scrollbar__view > table > tbody`
  ) as HTMLElement;
  sortable.value = Sortable.create(el, {
    ghostClass: "sortable-ghost",
    onEnd: (evt: any) => {
      if (typeof evt.oldIndex !== "undefined" && typeof evt.newIndex !== "undefined") {
        // 删除选择的行，并获取
        const targetRow = tableData.value.splice(evt.oldIndex, 1)[0];
        // 获取的行插入到新的地方
        tableData.value.splice(evt.newIndex, 0, targetRow);
      }
    },
  });
};

const handleSearch = (type: "single" | "multiple") => {
  loading.value = true;
  tableData.value = largeData;
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
  tableData.value = largeData;
};
const handleAdd = (formRef: FormInstance | null) => {
  tempTableDate.value = defaultTableData;
  dialogStatus.value = "add";
  dialogFormVisible.value = true;
  nextTick(() => {
    setTimeout(() => {
      formRef?.clearValidate();
    }, 100);
  });
};

const addData = (formRef: FormInstance | null) => {
  formRef?.validate(async valid => {
    if (valid) {
      const tableDataTemp = tempTableDate.value;
      tableDataTemp.id = Math.round(Math.random() * 100) + 1024 + ""; // 随机一个 id
      tableData.value.unshift(tableDataTemp);
      dialogFormVisible.value = false;
      ElNotification.success({
        title: "成功",
        message: "创建成功",
      });
    }
  });
};

const handleInlineEdit = (row: any) => {
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
  ElMessage({});
};

const confirmEdit = (row: any) => {
  row.edit = false;
  row.originalTitle = row.title;
  ElMessage.success("标题已编辑！");
};

const handleLook = (row: any, formRef: FormInstance | null) => {
  tempTableDate.value = Object.assign({}, row);
  dialogStatus.value = "look";
  dialogFormVisible.value = true;
  nextTick(() => {
    formRef?.clearValidate();
  });
};

const handleEdit = (row: any, formRef: FormInstance | null) => {
  tempTableDate.value = Object.assign({}, row);
  dialogStatus.value = "edit";
  dialogFormVisible.value = true;
  nextTick(() => {
    formRef?.clearValidate();
  });
};

const editData = (formRef: FormInstance | null) => {
  formRef?.validate(async valid => {
    if (valid) {
      const tempData = Object.assign({}, tempTableDate.value);
      const index = tableData.value.findIndex(v => v.id === tempData.id);
      tableData.value.splice(index, 1, tempData);
      dialogFormVisible.value = false;
      ElNotification.success({
        title: "成功",
        message: "更新成功",
      });
    }
  });
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

const handleSizeChange = (pagingParam: PaginationInfo) => {
  paging.pageNum = pagingParam.pageNum;
  paging.pageSize = pagingParam.pageSize;
};
</script>

<template>
  <div class="integrationTable-table-container tk-card-minimal">
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
        <el-button v-waves type="primary" :icon="Plus" @click="handleAdd(formRef)">添加</el-button>
        <el-checkbox v-model="showAddress" style="margin-left: 15px" @change="tableKey = tableKey + 1">
          地址
        </el-checkbox>
      </div>
    </div>

    <TableSort
      :data="tableData.slice((paging.pageNum - 1) * paging.pageSize, paging.pageNum * paging.pageSize)"
      border
      highlight-current-row
      row-key="id"
      :key="tableKey"
      style="width: 100%"
      v-loading="loading"
      @row-dblclick="handleInlineEdit"
      ref="tableRef"
    >
      <el-table-column prop="id" label="ID" width="70" align="center" sortable="custom"></el-table-column>
      <el-table-column prop="date" label="日期" width="180px" sortable="custom"></el-table-column>
      <el-table-column prop="name" label="姓名" width="150px" sortable="custom"></el-table-column>
      <el-table-column min-width="100" label="标题">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              :icon="Refresh"
              type="warning"
              circle
              @click="cancelEdit(row)"
            ></el-button>
            <el-button
              class="confirm-btn"
              size="small"
              :icon="Check"
              type="primary"
              circle
              @click="confirmEdit(row)"
            ></el-button>
          </template>
          <span v-else style="color: var(--theme-color); cursor: pointer" @click="handleEdit(row, formRef)">
            {{ row.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" v-if="showAddress"></el-table-column>
      <el-table-column prop="status" label="状态" width="140">
        <template #default="{ row }">
          <el-tag :type="tableStatusFilter(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级" width="140" sortable="custom">
        <template #default="{ row }">
          <Icon v-for="n in row.priority" :key="n" :icon="Star" style="color: #606266" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="220px">
        <template #default="{ row, $index }">
          <el-button link type="info" :icon="Search" @click="handleLook(row, formRef)">查看</el-button>
          <el-button link type="primary" :icon="EditPen" @click="handleEdit(row, formRef)">编辑</el-button>
          <el-button link type="danger" :icon="Delete" @click="handleDelete(row, $index)">删除</el-button>
        </template>
      </el-table-column>
    </TableSort>

    <Pagination v-show="tableData.length > 0" :total="tableData.length" v-model="paging" @change="handleSizeChange" />

    <el-dialog :title="dialogTitle[dialogStatus]" v-model="dialogFormVisible">
      <el-form
        ref="formRef"
        :rules="rules"
        :model="tempTableDate"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left: 50px"
        :disabled="dialogStatus === 'look'"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="tempTableDate.name" placeholder="请选择姓名" />
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="tempTableDate.date"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择日期"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="tempTableDate.status" placeholder="请选择状态">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-rate
            v-model="tempTableDate.priority"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :max="5"
            style="margin-top: 8px"
          />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="tempTableDate.address"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入地址"
          />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="tempTableDate.title"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入标题"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <template v-if="dialogStatus === 'look'">
            <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
          </template>
          <template v-else>
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogStatus === 'add' ? addData(formRef) : editData(formRef)">
              确定
            </el-button>
          </template>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.integrationTable-table-container {
  .search-container {
    margin-bottom: 20px;

    .search-content {
      display: inline-block;
    }

    .multiple-search {
      margin-left: 20px;
    }
  }

  .edit-input {
    padding-right: 90px;
  }

  .cancel-btn {
    position: absolute;
    top: 10px;
    right: 55px;
  }

  .confirm-btn {
    position: absolute;
    top: 10px;
    right: 15px;
  }
}
</style>

<style lang="scss">
.sortable-ghost {
  color: #ffffff !important;
  background: #42b983 !important;
  opacity: 0.8;
}
</style>
