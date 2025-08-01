<script setup lang="tsx" name="useProTable">
import type { TableColumn } from "@/components";
import { ref, reactive } from "vue";
import { ElButton, ElMessage } from "element-plus";
import { useProTable, ProTable } from "@/components";
import { tableData } from "@/mock/pro-component/pro-table";

const { tableRegister, tableMethods } = useProTable();
const { setProps, setColumn, getElTableExpose, addColumn, delColumn, clearSelection, changePagination } = tableMethods;

const getTicketList = () => {
  return new Promise(resolve => {
    resolve({ data: tableData });
  });
};

const showTableButton = (show: boolean) => {
  setProps({ toolButton: show });
};

const showSelections = (show: boolean) => {
  setColumn([
    {
      prop: "selection",
      field: "hidden",
      value: show,
    },
  ]);
};

const showPagination = (show: boolean) => {
  setProps({ pageScope: show });
};

const index = ref(1);

const changeUsername = () => {
  setColumn([
    {
      prop: "username",
      field: "label",
      value: `用户姓名 ${index.value}`,
    },
  ]);
  index.value++;
};

const showExpandedRows = (show: boolean) => {
  setColumn([
    {
      prop: "expand",
      field: "hidden",
      value: show,
    },
  ]);
};

const selectAllNone = async () => {
  const elTableRef = await getElTableExpose();
  elTableRef?.toggleAllSelection();
};

const showAction = ref(true);

const delOrAddAction = () => {
  if (showAction.value) {
    delColumn("operation");
    showAction.value = false;
  } else {
    addColumn({
      prop: "operation",
      label: "操作",
      fixed: "right",
      width: 180,
      render: () => {
        return (
          <>
            <el-button plain type="primary">
              编辑
            </el-button>
            <el-button plain type="danger">
              删除
            </el-button>
          </>
        );
      },
    });
    showAction.value = true;
  }
};

const showStripe = ref(false);
const showOrHiddenStripe = () => {
  setProps({
    stripe: !showStripe.value,
  });
  showStripe.value = !showStripe.value;
};

const height = ref<string | number>("auto");
const fixedHeaderOrAuto = () => {
  if (height.value === "auto") {
    height.value = 300;
    setProps({
      height: height.value,
    });
  } else {
    setProps({
      height: "auto",
    });
    height.value = "auto";
  }
};

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

const columns = reactive<TableColumn<ResUserList>[]>([
  { type: "selection", prop: "selection", fixed: "left", width: 60 },
  { type: "index", label: "#", width: 60 },
  { type: "sort", label: "Sort", width: 80 },
  { type: "expand", prop: "expand", label: "Expand", width: 80 },
  {
    prop: "username",
    label: "用户姓名",
    render: ({ value }) => {
      return (
        <ElButton type="primary" link onClick={() => ElMessage.success("我是通过 tsx 语法渲染的内容")}>
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
  },
  {
    // 多级 prop
    prop: "user.detail.age",
    label: "年龄",
  },
  { prop: "idCard", label: "身份证号" },
  { prop: "email", label: "邮箱" },
  { prop: "address", label: "居住地址" },
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
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: 180,
    render: () => {
      return (
        <>
          <el-button plain type="primary">
            编辑
          </el-button>
          <el-button plain type="danger">
            删除
          </el-button>
        </>
      );
    },
  },
]);
</script>

<template>
  <el-space fill style="width: 100%">
    <el-card shadow="never" header="UseTable 操作">
      <el-space wrap>
        <el-button @click="showTableButton(false)">隐藏顶栏工具栏按钮</el-button>
        <el-button @click="showTableButton(true)">显示顶栏工具栏按钮</el-button>
        <el-button @click="showSelections(true)">隐藏多选</el-button>
        <el-button @click="showSelections(false)">显示多选</el-button>
        <el-button @click="showPagination(false)">隐藏分页</el-button>
        <el-button @click="showPagination(true)">显示分页</el-button>
        <el-button @click="changePagination({ pageNum: 2 })">切换到第二个页</el-button>
        <el-button @click="changeUsername">修改用户姓名</el-button>
        <el-button @click="showExpandedRows(true)">隐藏展开行</el-button>
        <el-button @click="showExpandedRows(false)">显示展开行</el-button>
        <el-button @click="selectAllNone">全选/全不选</el-button>
        <el-button @click="clearSelection">清空选择</el-button>
        <el-button @click="delOrAddAction">删除/添加操作列</el-button>
        <el-button @click="showOrHiddenStripe">删除/隐藏斑马纹</el-button>
        <el-button @click="fixedHeaderOrAuto">固定表头/自动</el-button>
      </el-space>
    </el-card>

    <ProTable :columns :requestApi="getTicketList" page-scope @register="tableRegister" />
  </el-space>
</template>
