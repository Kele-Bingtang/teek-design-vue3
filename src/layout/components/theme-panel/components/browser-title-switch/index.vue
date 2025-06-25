<script setup lang="ts">
import { ElSelect, ElOption } from "element-plus";
import { useI18n } from "vue-i18n";
import { useNamespace, useBrowserTitle } from "@/composables";
import { useSettingStore } from "@/pinia";
import { TitleModeEnum } from "@/common/enums/appEnum";

defineOptions({ name: "BrowserTitleSwitch" });

const ns = useNamespace("browser-title-switch");

const { t } = useI18n();

const settingStore = useSettingStore();
const { getBrowserTitle } = useBrowserTitle();

const handleTitleModeSelect = () => {
  // 根据选择的标题模式，重新渲染浏览器标题
  window.document.title = getBrowserTitle();
};

const titleModeOptions = [
  { value: TitleModeEnum.ProjectPage, label: t("_setting.titleModeProjectPage") },
  { value: TitleModeEnum.UsernamePage, label: t("_setting.titleModeUsernamePage") },
  { value: TitleModeEnum.Project, label: t("_setting.titleModeProject") },
  { value: TitleModeEnum.Page, label: t("_setting.titleModePage") },
];
</script>

<template>
  <div :class="ns.b()">
    <el-select
      v-model="settingStore.titleMode"
      :placeholder="$t('_setting.titlePlaceholder')"
      @change="handleTitleModeSelect"
    >
      <el-option
        v-for="item in titleModeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.value === settingStore.titleMode"
      ></el-option>
    </el-select>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
