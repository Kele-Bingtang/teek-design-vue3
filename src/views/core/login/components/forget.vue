<script setup lang="ts" name="Forget">
import type { FormInstance } from "element-plus";
import { ref, reactive, inject, useTemplateRef } from "vue";
import { ElMessage } from "element-plus";
import { Phone, Lock, WarnTriangleFilled } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { useVerifyCode } from "../use-verify-code";
import { updateRules } from "../rules";

const ns = useNamespace("login-form");
const { isDisabled, text } = useVerifyCode();

const loading = ref(false);
const ruleForm = reactive({
  phone: "",
  verifyCode: "",
  password: "",
  repeatPassword: "",
});

const ruleFormRef = useTemplateRef<FormInstance>("ruleFormRef");

const repeatPasswordRule = [
  {
    validator: (_: any, value: string, callback: (error?: string | Error | undefined) => void) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (ruleForm.password !== value) {
        callback(new Error("两次密码不一致!"));
      } else {
        callback();
      }
    },
    trigger: "blur",
  },
];

const login = async () => {
  loading.value = true;

  if (!ruleFormRef.value) return;

  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      // 模拟请求，需根据实际开发进行修改
      setTimeout(() => {
        ElMessage.success("修改密码成功");
        loading.value = false;
      }, 2000);
    } else {
      loading.value = false;
      Promise.resolve(fields);
    }
  });
};

const switchLoginMode = inject("switchLoginMode") as (mode: string) => void;

const onBack = () => {
  useVerifyCode().end();
  switchLoginMode("login");
};
</script>

<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="updateRules" size="large" :class="ns.b()">
    <el-form-item prop="phone">
      <el-input clearable v-model="ruleForm.phone" placeholder="手机号码" :prefix-icon="Phone" />
    </el-form-item>

    <el-form-item prop="verifyCode">
      <div style="display: flex; justify-content: space-between; width: 100%">
        <el-input
          clearable
          v-model="ruleForm.verifyCode"
          placeholder="短信验证码"
          :prefix-icon="WarnTriangleFilled"
          @keydown.enter="login"
        />
        <el-button :disabled="isDisabled" class="ml-2" @click="useVerifyCode().start(ruleFormRef, 'phone')">
          {{ text.length > 0 ? text + " 秒后重新获取" : "获取验证码" }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        clearable
        show-password
        v-model="ruleForm.password"
        placeholder="新密码"
        :prefix-icon="Lock"
        @keydown.enter="login"
      />
    </el-form-item>

    <el-form-item :rules="repeatPasswordRule" prop="repeatPassword">
      <el-input
        clearable
        show-password
        v-model="ruleForm.repeatPassword"
        placeholder="确认密码"
        :prefix-icon="Lock"
        @keydown.enter="login"
      />
    </el-form-item>

    <el-form-item>
      <div :class="ns.e('btn')" class="flx-align-center-between">
        <el-button icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login">
          登录
        </el-button>
        <el-button icon="CircleClose" round size="large" @click="onBack">返回</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
@use "../loginForm";
</style>
