<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { ElSwitch } from "element-plus";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { useSettingStore } from "@/pinia";
import { switchThemeWithAnimation } from "@/layout/components/header/components/light-dark-switch/animation";

defineOptions({ name: "SwitchDark" });

const settingStore = useSettingStore();

const { isDark } = storeToRefs(settingStore);

const dark = ref(isDark.value);

const onAddDarkChange = (e: Event) => {
  switchThemeWithAnimation(e);
};
</script>

<template>
  <el-switch v-model="dark" @click="onAddDarkChange" inline-prompt :active-icon="Sunny" :inactive-icon="Moon" />
</template>
