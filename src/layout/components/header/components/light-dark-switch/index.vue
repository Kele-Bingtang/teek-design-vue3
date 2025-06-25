<script setup lang="ts">
import { useSettingStore } from "@/pinia";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { switchThemeWithAnimation } from "./animation";

defineOptions({ name: "LightDarkSwitch" });

const settingStore = useSettingStore();
</script>

<template>
  <div @click="switchThemeWithAnimation">
    <Icon>
      <Moon v-if="settingStore.isDark" />
      <Sunny v-else />
    </Icon>
  </div>
</template>
