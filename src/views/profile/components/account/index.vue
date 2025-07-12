<script setup lang="ts" name="Account">
import { ElMessage, type FormInstance } from "element-plus";

const user = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const formInstance = useTemplateRef("formInstance");

const equalToPassword = (rule: any, value: string, callback: (info?: string) => void) => {
  if (user.newPassword !== value) {
    callback("两次输入的密码不一致");
  } else {
    callback();
  }
};

const rules = {
  oldPassword: [{ required: true, message: "旧密码不能为空", trigger: "blur" }],
  newPassword: [
    { required: true, message: "新密码不能为空", trigger: "blur" },
    { min: 4, max: 20, message: "长度在 4 到 20 个字符", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "确认密码不能为空", trigger: "blur" },
    { required: true, validator: equalToPassword, trigger: "blur" },
  ],
};

const submit = async (formInstance: FormInstance | null) => {
  await formInstance?.validate(valid => {
    if (valid) {
      ElMessage({
        message: "修改密码成功！",
        type: "success",
        duration: 4000,
      });
      reset(formInstance);
    }
  });
};

const reset = (formInstance: FormInstance | null) => {
  formInstance?.resetFields();
  user.oldPassword = "";
  user.newPassword = "";
  user.confirmPassword = "";
};
</script>

<template>
  <el-form ref="formInstance" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" placeholder="请确认新密码" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit(formInstance)">保存</el-button>
      <el-button type="danger" @click="reset(formInstance)">重置</el-button>
    </el-form-item>
  </el-form>
</template>
