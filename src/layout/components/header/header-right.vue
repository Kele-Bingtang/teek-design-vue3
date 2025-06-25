<script setup lang="ts">
import { computed } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useErrorLogStore } from "@/pinia";
import { useNamespace } from "@/composables";
import SystemConfig, { mobileMaxWidthMedia } from "@/common/config";
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

const errorCount = computed(() => {
  const noReadErrorLogs = errorLogStore.errorLogs.filter(errorLog => {
    return !errorLog.hasRead;
  });
  return noReadErrorLogs.length;
});

const isMobile = useMediaQuery(mobileMaxWidthMedia);
</script>

<template>
  <div :class="[ns.b(), 'flx-center']">
    <GlobalSearch />

    <div :class="[ns.e('btn'), 'flx-align-center']" :style="{ '--icon-size': ns.cssVar('layout-header-icon-size') }">
      <GlobalSearchInput id="menuSearch" v-if="!isMobile" />
      <Fullscreen id="fullscreen" v-if="!isMobile" />
      <Notification id="notification" />
      <LanguageSelect id="languageSelect" />
      <ErrorLog
        id="errorLog"
        :errorCount="errorCount"
        v-if="SystemConfig.layoutConfig.errorLog.showInHeader && errorCount > 0 && !isMobile"
      />
      <LightDarkSwitch id="lightDarkSwitch" />
      <UserAvatar id="user" />
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
        width var(--#{$el-namespace}-transition-duration),
        background-color var(--#{$el-namespace}-transition-duration);

      &:hover {
        background-color: cssVar(gray-200);
      }
    }

    @include joins(user-dropdown) {
      margin-left: 14px;
    }
  }
}
</style>
