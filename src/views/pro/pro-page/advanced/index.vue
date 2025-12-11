<script setup lang="tsx">
import type { TableColumnCtx } from "element-plus";
import type { PageColumn, ProPageInstance, TableRow } from "@/components";
import { ref, useTemplateRef, withModifiers } from "vue";
import { ElButton, ElMessage, ElMessageBox, ElSwitch, ElTag } from "element-plus";
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh } from "@element-plus/icons-vue";
import { exportJsonToExcel, formatJsonToArray } from "@/common/utils";
import { ProPage, setProp } from "@/components";
import { useConfirm, usePermission } from "@/composables";
import { tableData } from "@/mock/pro-component/pro-table";

export interface ResUserList {
  id: string;
  username: string;
  gender: number;
  user: { detail: { age: number } };
  idCard: string;
  email: string;
  address: string;
  createTime: string;
  status: number;
  avatar: string;
  photo: any[];
  children?: ResUserList[];
}

const { hasAuth } = usePermission();

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proPageInstance = useTemplateRef<ProPageInstance>("proPageInstance");

const data = ref(tableData);

const columns: PageColumn<ResUserList>[] = [
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", label: "#", width: 60 },
  { type: "sort", label: "Sort", width: 80 },
  { type: "expand", label: "Expand", width: 80 },
  {
    prop: "username",
    label: "用户姓名",
    search: { el: "el-input" },
    render: ({ value }) => {
      return (
        <ElButton
          type="primary"
          link
          onClick={withModifiers(() => ElMessage.success("我是通过 tsx 语法渲染的内容"), ["stop"])}
        >
          {value}
        </ElButton>
      );
    },
  },
  {
    prop: "gender",
    label: "性别",
    options: [
      { genderLabel: "男", genderValue: 1 },
      { genderLabel: "女", genderValue: 2 },
    ],
    optionField: { label: "genderLabel", value: "genderValue" },
    search: { el: "el-select", elProps: { filterable: true } },
    filters: [
      { text: "男", value: "1" },
      { text: "女", value: "2" },
    ],
    filterMethod: (value: string, row: any, column: TableColumnCtx<any>) => {
      const property = column["property"];
      return row[property] === Number(value);
    },
    editable: true,
    editProps: {
      el: "el-select",
    },
  },
  {
    // 多级 prop
    prop: "user.detail.age",
    label: "年龄",
    filterProps: {
      formColumn: { width: 400 },
      // 自定义过滤规则
      rule: (model, row) => {
        const value = row.user.detail.age;
        return value >= model.minAge && value <= model.maxAge;
      },
    },
    search: {
      el: "el-input-number",
      // 自定义 search 显示内容
      render: ({ model }) => {
        return (
          <div class="flx-center">
            <el-input vModel_trim={model.minAge} placeholder="最小年龄" />
            <span style="margin: 0 10px">-</span>
            <el-input vModel_trim={model.maxAge} placeholder="最大年龄" />
          </div>
        );
      },
    },
    editProps: {
      el: "el-input-number",
      prop: "age",
      formItemProps: { required: true },
    },
  },
  {
    prop: "idCard",
    label: "身份证号",
    filterProps: {
      rule: "like",
    },
    search: { el: "el-input" },
    editProps: {
      formItemProps: { required: true },
    },
  },
  { prop: "email", label: "邮箱" },
  { prop: "address", label: "居住地址" },
  {
    prop: "status",
    label: "用户状态",
    options: [
      { userLabel: "启用", userStatus: 1 },
      { userLabel: "禁用", userStatus: 0 },
    ],
    search: { el: "el-select", props: { filterable: true } },
    optionField: { label: "userLabel", value: "userStatus" },
    editProps: {
      el: "el-switch",
      elProps: {
        activeText: "启用",
        inactiveText: "禁用",
        activeValue: 1,
        inactiveValue: 0,
      },
    },
    render: ({ value, row }) => {
      return (
        <>
          {hasAuth("edit") ? (
            <ElSwitch
              model-value={value}
              active-text={value ? "启用" : "禁用"}
              active-value={1}
              inactive-value={0}
              {...{ onClick: () => changeStatus(row) }}
            />
          ) : (
            <ElTag type={value ? "success" : "danger"}>{value ? "启用" : "禁用"}</ElTag>
          )}
        </>
      );
    },
  },
  {
    prop: "createTime",
    label: "创建时间",
    renderHeader: scope => {
      return (
        <ElButton type="primary" onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}>
          {scope.column.label}
        </ElButton>
      );
    },
    width: 180,
    filterProps: {
      formColumn: { width: 400 },
    },
    search: {
      el: "el-date-picker",
      span: 2, // 占两个位置
      elProps: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ["1900-11-12 11:35:00", "2024-12-12 11:35:00"],
    },
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 },
];

// 删除用户信息
const deleteAccount = async (params: TableRow<ResUserList>) => {
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
  proPageInstance.value?.proTableInstance?.tableMainInstance?.clearSelection();
  proPageInstance.value?.proTableInstance?.fetch();
};

// 重置用户密码
const resetPass = async (params: TableRow<ResUserList>) => {
  await useConfirm(() => {}, `重置【${params.username}】用户密码`);
  proPageInstance.value?.proTableInstance?.fetch();
};

// 切换用户状态
const changeStatus = async (row: TableRow<ResUserList>) => {
  await useConfirm(() => {
    row.status === 0 ? (row.status = 1) : (row.status = 0);
  }, `切换【${row.username}】用户状态`);
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
    exportJsonToExcel(tHeader, d, "proTable", undefined, undefined, true, "xlsx");
  });
};

const handleFormChange = async (fromValue: unknown, prop: string, scope: Recordable) => {
  setProp(data.value[scope.rowIndex], prop, fromValue);
};

// 取消行内编辑
const cancelEdit = (row: TableRow<ResUserList>) => {
  row._editable = false;
};

const confirmEdit = (row: TableRow<ResUserList>) => {
  row._validateCellEdit((isValid, invalidFields) => {
    if (isValid) {
      row._editable = false;
      ElMessage.success({
        message: `编辑成功，内容为 ${JSON.stringify(row._getData())}`,
        plain: true,
      });
    } else {
      ElMessage.warning({
        message: Object.values(invalidFields || { message: ["请完整填写表单然后再次提交！"] })[0][0].message,
        plain: true,
      });
    }
  });
};
</script>

<template>
  <ProPage ref="proPageInstance" :columns :data page-scope init-native-row-field @form-change="handleFormChange">
    <template #head-left="scope">
      <el-button type="primary" :icon="CirclePlus">新增用户</el-button>
      <el-button type="primary" :icon="Upload" plain>批量添加用户</el-button>
      <el-button type="primary" :icon="Download" plain @click="downloadFile">导出用户数据</el-button>
      <el-button type="primary" plain>To 子集详情页面</el-button>
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

    <template #expand="scope">
      {{ scope.row }}
    </template>

    <template #username-header="scope">
      <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
        {{ scope.column.label }}
      </el-button>
    </template>

    <template #createTime="scope">
      <el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
        {{ scope.row?.createTime }}
      </el-button>
    </template>

    <template #operation="{ row }">
      <el-button v-if="!row._editable" type="primary" link :icon="View">查看</el-button>
      <el-button v-if="!row._editable" type="primary" link :icon="EditPen" @click="() => (row._editable = true)">
        编辑
      </el-button>
      <el-button
        v-if="row._editable"
        type="primary"
        link
        :icon="EditPen"
        @click="cancelEdit(row as TableRow<ResUserList>)"
      >
        取消
      </el-button>
      <el-button
        v-if="row._editable"
        type="primary"
        link
        :icon="EditPen"
        @click="confirmEdit(row as TableRow<ResUserList>)"
      >
        确定
      </el-button>
      <el-button
        v-if="!row._editable"
        type="primary"
        link
        :icon="Refresh"
        @click="resetPass(row as TableRow<ResUserList>)"
      >
        重置密码
      </el-button>
      <el-button
        v-if="!row._editable"
        type="primary"
        link
        :icon="Delete"
        @click="deleteAccount(row as TableRow<ResUserList>)"
      >
        删除
      </el-button>
    </template>
  </ProPage>
</template>
