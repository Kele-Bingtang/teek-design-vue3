<script setup lang="ts" name="Phone">
import type { FormInstance } from "element-plus";
import { ref, reactive, inject, useTemplateRef } from "vue";
import { ElMessage } from "element-plus";
import { Phone, WarnTriangleFilled, CircleClose, UserFilled } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { useVerifyCode } from "../use-verify-code";
import { phoneRules } from "../rules";

const ns = useNamespace("login-form");

const loading = ref(false);
const ruleForm = reactive({
  phone: "",
  verifyCode: "",
});
const ruleFormRef = useTemplateRef<FormInstance>("ruleFormRef");
const { isDisabled, text, start, end } = useVerifyCode();

const login = async () => {
  loading.value = true;
  if (!ruleFormRef.value) return;

  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      // 模拟登录请求，需根据实际开发进行修改
      setTimeout(() => {
        ElMessage.success("登录成功");
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
  end();
  switchLoginMode("login");
};
</script>

<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="phoneRules" size="large" :class="ns.b()">
    <el-form-item prop="phone">
      <el-input clearable v-model="ruleForm.phone" placeholder="手机号码" :prefix-icon="Phone" />
    </el-form-item>

    <el-form-item prop="verifyCode">
      <div style="display: flex; justify-content: space-between; width: 100%">
        <el-input
          clearable
          v-model="ruleForm.verifyCode"
          placeholder="请输入验证码"
          :prefix-icon="WarnTriangleFilled"
          @keydown.enter="login"
        />
        <el-button :disabled="isDisabled" @click="start(ruleFormRef, 'phone')">
          {{ text.length > 0 ? text + " 秒后重新获取" : "获取验证码" }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item>
      <div :class="ns.e('btn')" class="flx-align-center-between">
        <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login">
          登录
        </el-button>
        <el-button :icon="CircleClose" round size="large" @click="onBack">返回</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
@use "../loginForm";
</style>
