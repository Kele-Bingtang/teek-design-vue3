<script setup lang="ts">
import { ElSelect, ElOption } from "element-plus";
import { useI18n } from "vue-i18n";
import { TitleModeEnum } from "@/common/enums";
import { useNamespace, useBrowserTitle } from "@/composables";
import { useSettingStore } from "@/pinia";

defineOptions({ name: "BrowserTitle" });

const ns = useNamespace("browser-title");

const { t } = useI18n();

const settingStore = useSettingStore();
const { getBrowserTitle } = useBrowserTitle();

const { layout } = storeToRefs(settingStore);

/**
 * 选择标题模式事件
 */
const handleTitleModeSelect = () => {
  // 根据选择的标题模式，重新渲染浏览器标题
  window.document.title = getBrowserTitle();
};

/**
 * 标题模式选项
 */
const titleModeOptions = computed(() => [
  { value: TitleModeEnum.ProjectPage, label: t("_setting.layout.titleModeSelect.projectPage") },
  { value: TitleModeEnum.UsernamePage, label: t("_setting.layout.titleModeSelect.usernamePage") },
  { value: TitleModeEnum.Project, label: t("_setting.layout.titleModeSelect.project") },
  { value: TitleModeEnum.Page, label: t("_setting.layout.titleModeSelect.page") },
]);
</script>

<template>
  <div :class="ns.b()">
    <el-select
      v-model="layout.titleMode"
      :placeholder="$t('_setting.layout.titleModePlaceholder')"
      @change="handleTitleModeSelect"
    >
      <el-option
        v-for="item in titleModeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.value === layout.titleMode"
      ></el-option>
    </el-select>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
