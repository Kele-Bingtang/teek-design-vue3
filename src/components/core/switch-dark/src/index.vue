<script setup lang="ts">
import { ElSwitch } from "element-plus";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { useTheme } from "@/composables";
import { SystemThemeEnum } from "@/common/enums/appEnum";
import { useSettingStore } from "@/pinia";

defineOptions({ name: "SwitchDark" });

const settingStore = useSettingStore();

const { isDark } = storeToRefs(settingStore);

const dark = ref(isDark.value);

const onAddDarkChange = (val: string | number | boolean) => {
  const { changeSystemTheme } = useTheme();

  changeSystemTheme(val ? SystemThemeEnum.Dark : SystemThemeEnum.Light);
};
</script>

<template>
  <el-switch v-model="dark" @change="onAddDarkChange" inline-prompt :active-icon="Sunny" :inactive-icon="Moon" />
</template>
