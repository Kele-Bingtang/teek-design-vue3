<script setup lang="ts">
import { ElSwitch } from "element-plus";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { useTheme } from "@/composables";
import { SystemThemeEnum } from "@/common/enums/appEnum";
import { useSettingStore } from "@/pinia";

defineOptions({ name: "SwitchDark" });

const settingStore = useSettingStore();

const { Dark, Light } = SystemThemeEnum;

const onAddDarkChange = () => {
  const { changeSystemTheme } = useTheme();
  const { isDark } = useSettingStore();

  changeSystemTheme(isDark ? Dark : Light);
};
</script>

<template>
  <el-switch
    v-model="settingStore.isDark"
    @change="onAddDarkChange"
    inline-prompt
    :active-icon="Sunny"
    :inactive-icon="Moon"
  />
</template>
