<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useErrorLogStore, useSettingStore } from "@/pinia";
import { serviceConfig } from "@/common/config";
import { useCommon, useNamespace } from "@/composables";
import Fullscreen from "./components/fullscreen/index.vue";
import LanguageSelect from "./components/language-select/index.vue";
import Notification from "./components/notification/index.vue";
import UserAvatar from "./components/user-avatar/index.vue";
import ErrorLog from "./components/error-log/index.vue";
import GlobalSearch from "./components/global-search/index.vue";
import GlobalSearchInput from "./components/global-search/input.vue";
import LightDarkSwitch from "./components/light-dark-switch/index.vue";

defineOptions({ name: "HeaderRight" });

const ns = useNamespace("header-right");
const errorLogStore = useErrorLogStore();
const settingStore = useSettingStore();
const { widget } = storeToRefs(settingStore);

/**
 * 未读错误日志数量
 */
const errorCount = computed(() => {
  const noReadErrorLogs = errorLogStore.errorLogs.filter(errorLog => {
    return !errorLog.hasRead;
  });
  return noReadErrorLogs.length;
});

const { isMobile } = useCommon();
</script>

<template>
  <div :class="ns.b()" class="flx-center">
    <GlobalSearch />

    <div :class="ns.e('btn')" :style="{ '--icon-size': ns.cssVar('layout-header-icon-size') }" class="flx-align-center">
      <GlobalSearchInput v-if="!isMobile && widget.search" id="menuSearch" />
      <Fullscreen v-if="!isMobile && widget.fullscreen" id="fullscreen" />
      <Notification v-if="widget.notification" id="notification" />
      <LanguageSelect v-if="widget.language" id="languageSelect" />
      <ErrorLog
        v-if="serviceConfig.layout.errorLog.showInHeader && errorCount > 0 && !isMobile"
        id="errorLog"
        :error-count="errorCount"
      />
      <LightDarkSwitch v-if="widget.theme" id="lightDarkSwitch" />
      <UserAvatar id="user" :name="false" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(header-right) {
  height: 100%;

  @include e(btn) {
    gap: 10px;
    height: 100%;

    > div:not(.customize) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 100%;
      cursor: pointer;
      transition:
        width cssVar(transition-duration),
        background-color cssVar(transition-duration);

      &.#{$el-namespace}-dropdown {
        color: inherit;
      }

      &:hover {
        background-color: cssVar(layout-header-bg-hover-color);
      }
    }

    @include joins(user-dropdown) {
      margin-left: 14px;
    }
  }
}
</style>
