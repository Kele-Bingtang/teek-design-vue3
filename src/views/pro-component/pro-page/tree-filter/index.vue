<script setup lang="ts">
import type { TableColumn, ProPageInstance } from "@/components";
import { ref, useTemplateRef } from "vue";
import { ProPage, TreeFilter } from "@/components";
import { ElMessage, ElMessageBox } from "element-plus";
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh } from "@element-plus/icons-vue";
import { exportJsonToExcel, formatJsonToArray } from "@/common/utils";
import { useConfirm } from "@/composables";
import { genderType, tableData, userStatus, department } from "@/mock/pro-component/pro-table";
import type { ResUserList } from "../advanced/index.vue";

const proPageInstance = useTemplateRef<ProPageInstance>("proPageInstance");
const data = ref(tableData);

// 树形筛选切换
const changeTreeFilter = () => {
  ElMessage.success("演示点击功能，实际去后台获取该部的所有用户信息 ☺");
  proPageInstance.value!.paging.pageNum = 1;
};

// 表格配置项
const columns: TableColumn<ResUserList>[] = [
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", label: "#", width: 80 },
  { prop: "username", label: "用户姓名", width: 120, search: { el: "el-input" } },
  {
    prop: "gender",
    label: "性别",
    width: 120,
    sortable: true,
    options: genderType,
    search: { el: "el-select" },
  },
  { prop: "idCard", label: "身份证号" },
  { prop: "email", label: "邮箱" },
  { prop: "address", label: "居住地址" },
  {
    prop: "status",
    label: "用户状态",
    width: 120,
    sortable: true,
    options: userStatus,
    search: { el: "el-select" },
  },
  { prop: "createTime", label: "创建时间", width: 180 },
  { prop: "operation", label: "操作", width: 330, fixed: "right" },
];

// 删除用户信息
const deleteAccount = async (params: TableColumn<ResUserList>) => {
  await useConfirm(() => {
    data.value = data.value.filter(item => item.id !== params.id);
  }, `删除【${params.username}】用户`);
  proPageInstance.value?.proTableInstance?.fetch();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useConfirm(() => {
    data.value = data.value.filter(item => !id.includes(item.id));
  }, "删除所选用户信息");
  proPageInstance.value?.proTableInstance?.clearSelection();
  proPageInstance.value?.proTableInstance?.fetch();
};

// 重置用户密码
const resetPass = async (params: TableColumn<ResUserList>) => {
  await useConfirm(() => {}, `重置【${params.username}】用户密码`);
  proPageInstance.value?.proTableInstance?.fetch();
};

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() => {
    const tHeader = [] as string[];
    columns.forEach(item => {
      if (!item.type && item.prop !== "operation") tHeader.push(item.prop!);
    });
    const filterVal = tHeader;
    const d = formatJsonToArray(data.value, filterVal);
    exportJsonToExcel(tHeader, d, "proTable", undefined, undefined, true, ".xlsx");
  });
};
</script>

<template>
  <div class="main-box">
    <TreeFilter label="name" title="部门列表(单选)" :data="department" @change="changeTreeFilter" show-more />
    <div class="table-box">
      <ProPage ref="proPageInstance" :data :columns>
        <!-- 表格 header 按钮 -->
        <template #head-left="scope">
          <el-button type="primary" :icon="CirclePlus">新增用户</el-button>
          <el-button type="primary" :icon="Upload" plain>批量添加用户</el-button>
          <el-button type="primary" :icon="Download" plain @click="downloadFile">导出用户数据</el-button>
          <el-button type="primary" plain>To 详情页面</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            plain
            :disabled="!scope.isSelected"
            @click="batchDelete(scope.selectedListIds)"
          >
            批量删除用户
          </el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View">查看</el-button>
          <el-button type="primary" link :icon="EditPen">编辑</el-button>
          <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row as TableColumn<ResUserList>)">
            重置密码
          </el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row as TableColumn<ResUserList>)">
            删除
          </el-button>
        </template>
      </ProPage>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-box {
  display: flex;
  width: 100%;
  height: 100%;

  .table-box {
    // 这里减去的是 treeFilter 组件宽度
    width: calc(100% - 230px);
    margin-left: 10px;
  }
}
</style>
