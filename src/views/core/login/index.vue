<script setup lang="ts" name="Login">
import { SwitchDark } from "@/components";
import LoginForm from "./loginForm.vue";
import SystemConfig from "@/common/config";
import Phone from "./components/phone.vue";
import QrCode from "./components/qrCode.vue";
import Register from "./components/register.vue";
import Forget from "./components/forget.vue";
import { useNamespace } from "@/composables";

const ns = useNamespace("login");

const formComponents: Record<string, Component> = {
  login: LoginForm,
  phone: Phone,
  qrCode: QrCode,
  register: Register,
  forget: Forget,
};

const formMode = ref("login");

const switchLoginMode = (mode: string) => {
  formMode.value = mode;
};

provide("switchLoginMode", switchLoginMode);
</script>

<template>
  <div :class="ns.b()">
    <SwitchDark :class="ns.e('dark')" />
    <div :class="ns.e('wrapper')">
      <div :class="ns.e('left')">
        <img src="@/common/assets/images/login/login_left.png" alt="login" />
      </div>

      <div :class="ns.e('right')">
        <div :class="[ns.e('right__header'), 'flx-center']">
          <img src="@/common/assets/images/logo.png" alt="" />
          <h2 class="title">{{ SystemConfig.systemInfo.name }}</h2>
        </div>

        <component :is="formComponents[formMode]" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
