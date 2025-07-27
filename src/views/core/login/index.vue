<script setup lang="ts" name="Login">
import type { Component } from "vue";
import { ref, provide } from "vue";
import { serviceConfig } from "@/common/config";
import { SwitchDark } from "@/components";
import { useNamespace } from "@/composables";
import LoginForm from "./loginForm.vue";
import Phone from "./components/phone.vue";
import QrCode from "./components/qrCode.vue";
import Register from "./components/register.vue";
import Forget from "./components/forget.vue";

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
        <div :class="ns.e('right__header')" class="flx-center">
          <img :src="serviceConfig.logo.source" alt="" />
          <h2 class="title">{{ serviceConfig.layout.name }}</h2>
        </div>

        <component :is="formComponents[formMode]" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
