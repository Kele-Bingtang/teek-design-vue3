import type { FeedbackFormColumn } from "@/components/pro/page";
import type { FormRules } from "element-plus";

interface Result {
  code: number;
  message: string;
}

export const addUser = async (data: Recordable) => {
  console.log("addUser", data);
  return new Promise<Result>(resolve => {
    setTimeout(() => {
      resolve({ code: 200, message: "添加成功！" });
    }, 1000);
  });
};

export const editUser = async (data: Recordable) => {
  console.log("editUser", data);
  return new Promise<Result>(resolve => {
    setTimeout(() => {
      resolve({ code: 200, message: "修改成功！" });
    }, 1000);
  });
};

export const removeUser = async (data: Recordable) => {
  console.log("removeUser", data);
  return new Promise<Result>(resolve => {
    setTimeout(() => {
      resolve({ code: 200, message: "删除成功！" });
    }, 1000);
  });
};

export const removeBatch = async (data: Recordable) => {
  console.log("removeBatch", data);
  return new Promise<Result>(resolve => {
    setTimeout(() => {
      resolve({ code: 200, message: "批量删除成功！" });
    }, 1000);
  });
};

// 表单配置项
export const formColumns: FeedbackFormColumn[] = [
  { prop: "username", label: "用户姓名" },
  {
    prop: "gender",
    label: "性别",
    el: "el-select",
    options: [
      { label: "男", value: 1 },
      { label: "女", value: 2 },
    ],
  },
  { prop: "age", label: "年龄", el: "el-input-number", elProps: { min: 0, max: 100 } },
  { prop: "idCard", label: "身份证号" },
  { prop: "email", label: "邮箱" },
  { prop: "address", label: "居住地址" },
  {
    prop: "status",
    label: "当前状态",
    props: { disabled: true },
    destroyIn: ["add"], // 在新增时销毁该表单
    disabledIn: ["edit"], // 在修改时禁用该表单
  },
];

export const rules = reactive<FormRules>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
});
