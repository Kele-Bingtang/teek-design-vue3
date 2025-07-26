<script setup lang="ts" name="LanguageSelect">
import type { LanguageEnum } from "@/common/enums";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessage } from "element-plus";
import { languageOptions } from "@/common/languages";
import { useBrowserTitle } from "@/composables";
import { useLayoutStore } from "@/pinia";

const localList = [...languageOptions];

const i18n = useI18n();
const layoutStore = useLayoutStore();
const { getBrowserTitle } = useBrowserTitle();

const { language } = storeToRefs(layoutStore);

/**
 * 切换语言
 */
const handleSelectLanguage = (lang: LanguageEnum) => {
  i18n.locale.value = lang;
  layoutStore.$patch({ language: lang });
  document.documentElement.lang = lang;
  window.document.title = getBrowserTitle();

  let message = i18n.t("_headerBar.changeLanguage");
  message = message === "_headerBar.changeLanguage" ? "修改语言成功！" : message;
  ElMessage.success(message);
};
</script>

<template>
  <el-dropdown trigger="click" @command="handleSelectLanguage">
    <Icon icon="core-language" style="width: 100%; height: 100%" />

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="local in localList"
          :key="local.value"
          :command="local.value"
          :disabled="language === local.value"
        >
          {{ local.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
