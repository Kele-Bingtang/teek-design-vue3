<script setup lang="ts" name="EditorInfo">
import { useUserStore, type UserInfo } from "@/pinia";
import { ElMessage, type FormInstance } from "element-plus";

const props = defineProps<{ user: UserInfo }>();

const { user } = toRefs(props);

const userStore = useUserStore();
const formRef = useTemplateRef("formRef");

const disabled = ref(true);

const rules = {
  username: [{ required: true, message: "用户名称不能为空", trigger: "blur" }],
  phone: [
    { required: true, message: "联系方式不能为空", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的联系方式",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "邮箱地址不能为空", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] },
  ],
} as any;

const submit = (formRef: FormInstance | null) => {
  formRef?.validate(valid => {
    if (valid) {
      userStore.setUserInfo({ ...user.value });
      ElMessage.success("修改成功");
      formRef?.clearValidate();
      disabled.value = true;
    }
  });
};
</script>

<template>
  <el-form ref="formRef" :model="user" :rules="rules" label-width="80px" :disabled>
    <el-form-item label="用户名称" prop="username">
      <el-input v-model="user.username" maxlength="30" />
    </el-form-item>
    <el-form-item label="个性签名" prop="username">
      <el-input v-model="user.signature" maxlength="100" />
    </el-form-item>
    <el-form-item label="联系方式" prop="phone">
      <el-input v-model="user.phone" maxlength="11" />
    </el-form-item>
    <el-form-item label="用户邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="工作职位" prop="email">
      <el-input v-model="user.job" />
    </el-form-item>
    <el-form-item label="所在部门" prop="email">
      <el-input v-model="user.dept" />
    </el-form-item>
    <el-form-item label="用户性别">
      <el-radio-group v-model="user.sex">
        <el-radio value="男">男</el-radio>
        <el-radio value="女">女</el-radio>
        <el-radio value="保密">保密</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>

  <el-button v-if="disabled" type="primary" @click="() => (disabled = !disabled)">编辑</el-button>
  <el-button v-else type="primary" @click="submit(formRef)">保存</el-button>
</template>
