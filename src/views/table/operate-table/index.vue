<script setup lang="ts" name="OperateTable">
import { Pagination, defaultPageInfo, type PageInfo } from "@/components";
import { largeData } from "@/mock/table";
import { ElMessage, ElMessageBox, ElNotification, type FormInstance, type TableInstance } from "element-plus";
import { tableStatusFilter } from "@/common/config";
import { Search, Refresh, Plus, Check, EditPen, Delete } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";

const ns = useNamespace();
const defaultTableData = {
  id: "",
  name: "",
  date: "",
  address: "",
  status: "",
  priority: 0,
  title: "",
};

const dialogTitle: Record<string, string> = {
  look: "查看",
  edit: "编辑",
  add: "创建",
};
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
const rules = {
  date: [{ required: true, message: "date is required", trigger: "change" }],
  name: [{ required: true, message: "name is required", trigger: "change" }],
  title: [{ required: true, message: "title is required", trigger: "blur" }],
};

const tableKey = ref(0);
const showAddress = ref(false);
const loading = ref(true);
const tableData = ref(largeData);
const paging = reactive(defaultPageInfo);
const dialogFormVisible = ref(false);
const dialogStatus = ref("");
const tempTableDate = ref(defaultTableData);
const tableRef = useTemplateRef<TableInstance>("tableRef");
const formRef = useTemplateRef<FormInstance>("formRef");

onMounted(() => {
  tableData.value.map((item: any) => {
    item.edit = false;
    item.originalTitle = item.title;
    return item;
  });
  setTimeout(() => {
    loading.value = false;
  }, 500);
});

const handleAdd = () => {
  tempTableDate.value = defaultTableData;
  dialogStatus.value = "add";
  dialogFormVisible.value = true;
  nextTick(() => {
    setTimeout(() => {
      formRef.value?.clearValidate();
    }, 100);
  });
};

const addData = () => {
  formRef.value?.validate(async valid => {
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
};

const confirmEdit = (row: any) => {
  row.edit = false;
  row.originalTitle = row.title;
  ElMessage.success("标题已编辑！");
};

const handleLook = (row: any) => {
  tempTableDate.value = Object.assign({}, row);
  dialogStatus.value = "look";
  dialogFormVisible.value = true;
  nextTick(() => {
    formRef.value?.clearValidate();
  });
};

const handleEdit = (row: any) => {
  tempTableDate.value = Object.assign({}, row);
  dialogStatus.value = "edit";
  dialogFormVisible.value = true;
  nextTick(() => {
    formRef.value?.clearValidate();
  });
};

const editData = () => {
  formRef.value?.validate(async valid => {
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

const handleSizeChange = (pagingParam: PageInfo) => {
  paging.pageNum = pagingParam.pageNum;
  paging.pageSize = pagingParam.pageSize;
};
</script>

<template>
  <div class="operate-table-container">
    <el-button v-waves type="primary" :icon="Plus" @click="handleAdd()" style="margin-bottom: 10px">添加</el-button>
    <el-table
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
      <el-table-column prop="id" label="ID" width="70" align="center" sortable></el-table-column>
      <el-table-column prop="date" label="日期" width="180px"></el-table-column>
      <el-table-column prop="name" label="姓名" width="150px"></el-table-column>
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
          <span
            v-else
            :style="`color: var(--${ns.elNamespace}-color-primary); cursor: pointer`"
            @click="handleEdit(row)"
          >
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
      <el-table-column prop="priority" label="优先级" width="140">
        <template #default="{ row }">
          <Icon v-for="n in row.priority" :key="n" name="star" style="color: #606266" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="220px">
        <template #default="{ row, $index }">
          <el-button link type="info" :icon="Search" @click="handleLook(row)">查看</el-button>
          <el-button link type="primary" :icon="EditPen" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" :icon="Delete" @click="handleDelete(row, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination v-show="tableData.length > 0" :total="tableData.length" v-model="paging" @change="handleSizeChange" />

    <el-dialog :title="dialogTitle[dialogStatus]" v-model="dialogFormVisible">
      <el-form
        ref="formRef"
        :rules="rules"
        :model="tempTableDate"
        label-position="left"
        label-width="60px"
        style="width: 400px"
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
            <el-button type="primary" @click="dialogStatus === 'add' ? addData() : editData()">确定</el-button>
          </template>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.operate-table-container {
  padding: 10px 12px;
  background-color: #ffffff;

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
