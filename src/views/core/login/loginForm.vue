<script setup lang="ts" name="LoginForm">
import { useRouter } from "vue-router";
import { ElNotification, type FormInstance } from "element-plus";
import { useUserStore } from "@/pinia";
import { getTimeState } from "@/common/utils";
import SystemConfig, { HOME_URL } from "@/common/config";
import { ImageVerifyCode } from "@/components";
import { User, Lock, WarnTriangleFilled, CircleClose, UserFilled } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";

interface LoginForm {
  username: string;
  password: string;
  verifyCode: string;
}

const ns = useNamespace("login-form");

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const switchLoginMode = inject("switchLoginMode") as (mode: string) => void;

const loginRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  verifyCode: [
    {
      validator: (_: any, value: string, callback: (e?: Error) => void) => {
        if (value === "") {
          callback(new Error("请输入验证码"));
        } else if (imgCode.value !== value) {
          callback(new Error("请输入正确的验证码"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const operates = [
  { title: "手机登录", mode: "phone" },
  { title: "二维码登录登录", mode: "qrCode" },
  { title: "注册登录", mode: "register" },
];

const thirdParty = [
  { title: "微信登录", icon: "login-wechat" },
  { title: "QQ登录", icon: "login-qq" },
  { title: "支付宝登录", icon: "login-alipay" },
  { title: "微博登录", icon: "login-weibo" },
];

const loginFormRef = useTemplateRef<FormInstance>("loginFormRef");

const imgCode = ref("");
const loading = ref(false);
const loginForm = reactive<LoginForm>({ username: "", password: "", verifyCode: "" });
const checked = ref(false);

const handleForgetPwd = () => {
  switchLoginMode("forget");
};

const login = () => {
  loginFormRef.value?.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 执行登录
      const result = await userStore.login({ ...loginForm });
      if (!result) {
        ElNotification({
          title: getTimeState(),
          message: "登录失败，用户名或密码错误",
          type: "success",
          duration: 3000,
        });
        return;
      }

      // 跳转到首页或者 URL 携带的 redirect 页（优先级高）
      let path = HOME_URL;
      const { query } = route;

      if (query.redirect) path = query.redirect as string;

      const otherQuery = getOtherQuery(query);
      // otherQuery 不能是 {}，否则无法跳转
      if (Object.keys(otherQuery).length === 0) router.push(path);
      else router.push({ path, query: otherQuery });

      ElNotification.success({
        title: `欢迎登录 ${SystemConfig.systemInfo.name}`,
        message: getTimeState(),
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  });
};

const getOtherQuery = (query: any) => {
  return Object.keys(query).reduce((acc: any, cur) => {
    if (cur !== "redirect") acc[cur] = query[cur];
    return acc;
  }, {});
};

const resetForm = () => {
  loginFormRef.value?.resetFields();
};
</script>

<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large" :class="ns.b()">
    <el-form-item prop="username">
      <el-input
        v-model="loginForm.username"
        placeholder="用户名（任意）"
        :prefix-icon="User"
        @keydown.enter="login"
      ></el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        type="password"
        v-model="loginForm.password"
        placeholder="密码（任意）"
        show-password
        autocomplete="new-password"
        :prefix-icon="Lock"
        @keydown.enter="login"
      ></el-input>
    </el-form-item>

    <el-form-item prop="verifyCode">
      <el-input
        clearable
        v-model="loginForm.verifyCode"
        placeholder="验证码"
        :prefix-icon="WarnTriangleFilled"
        @keydown.enter="login"
      >
        <template #append>
          <ImageVerifyCode v-model="imgCode" />
        </template>
      </el-input>
    </el-form-item>

    <el-form-item>
      <div :class="[ns.e('item'), 'flx-align-center-between']">
        <el-checkbox v-model="checked">记住密码</el-checkbox>
        <el-button link type="primary" @click="handleForgetPwd">忘记密码?</el-button>
      </div>
    </el-form-item>

    <el-form-item>
      <div :class="[ns.e('btn'), 'flx-align-center-between']">
        <el-button :icon="CircleClose" round @click="resetForm()" size="large">重置</el-button>
        <el-button :icon="UserFilled" round @click="login()" size="large" type="primary" :loading="loading">
          登录
        </el-button>
      </div>
    </el-form-item>

    <el-form-item>
      <div :class="[ns.e('item'), 'flx-align-center-between']">
        <el-button v-for="(item, index) in operates" :key="index" @click="switchLoginMode(item.mode)" size="default">
          {{ item.title }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item>
      <el-divider>第三方登录</el-divider>
      <div :class="ns.e('third-item')">
        <span v-for="(item, index) in thirdParty" :key="index" :title="item.title">
          <Icon :icon="item.icon" :size="20" />
        </span>
      </div>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
@use "./loginForm";
</style>
