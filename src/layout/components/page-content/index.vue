<script setup lang="ts">
import type { Component } from "vue";
import { computed, ref, nextTick, provide, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { ElMain } from "element-plus";
import { RefreshPageKey } from "@/common/config";
import { getUrlParams, mittBus } from "@/common/utils";
import { useLayoutStore, useSettingStore } from "@/pinia";
import { TabNavModeEnum } from "@/common/enums/appEnum";
import SimpleTabNav from "../tab-nav/tab-nav-simple/index.vue";
import ClassicTabNav from "../tab-nav/tab-nav-classic/index.vue";
import ElTabNav from "../tab-nav/tab-nav-element/index.vue";
import Maximize from "./components/maximize.vue";
import FrameLayout from "../iframe/index.vue";

defineOptions({ name: "MainContent" });

const layoutStore = useLayoutStore();
const settingStore = useSettingStore();

const { tabNavMode, showTabNav, maximize, fixTabNav, pageTransition } = storeToRefs(settingStore);

const TabNavComponents: Record<string, Component> = {
  [TabNavModeEnum.Simple]: SimpleTabNav,
  [TabNavModeEnum.Classic]: ClassicTabNav,
  [TabNavModeEnum.Element]: ElTabNav,
};

// 刷新当前页面
const isRefreshRoute = ref(true);
const refreshPage = (value?: boolean) => {
  if (value !== undefined) return (isRefreshRoute.value = value);
  isRefreshRoute.value = false;

  nextTick(() => (isRefreshRoute.value = true));
};
provide(RefreshPageKey, refreshPage);

// 添加类型断言修复报错
mittBus.on(RefreshPageKey as any, refreshPage as any);

// 监听当前页是否最大化，动态添加 class
watchEffect(() => {
  const urlParams = getUrlParams();
  const app = document.getElementById("app") as HTMLElement;

  if (urlParams.get("_maximize")) {
    if (!app?.className.includes("page-maximize")) app?.classList.add("page-maximize");
  } else {
    if (maximize.value) app?.classList.add("page-maximize");
    else app?.classList.remove("page-maximize");
  }
});

const isFixTabNav = computed(() => {
  if (fixTabNav.value) return "auto";
  return "";
});
</script>

<template>
  <Maximize v-if="maximize" />
  <el-main class="flx-column">
    <component :is="TabNavComponents[tabNavMode]" v-if="showTabNav" />

    <div class="page-content">
      <router-view v-slot="{ Component, route }">
        <transition
          v-bind="route.meta.transitionProps"
          :name="route.meta.transitionProps?.name || pageTransition"
          mode="out-in"
          appear
        >
          <keep-alive :max="10" :include="layoutStore.keepAliveName">
            <component v-if="isRefreshRoute" :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <FrameLayout />
  </el-main>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include el-joins(main) {
  padding: 0;
  background-color: cssVar(layout-page-bg-color);

  .page-content {
    flex: 1;
    padding: 10px 12px;
    overflow: v-bind(isFixTabNav);

    // max-height: calc(
    //   100vh - cssVar(layout-header-height) - cssVar(layout-tab-height)
    // );
  }
}
</style>

<style lang="scss">
@use "@styles/mixins/bem" as *;

/* 当前页面最大化 */
.page-maximize {
  @include joins(columns-layout__aside) {
    display: none !important;
  }

  @include el-joins(aside, header, footer) {
    display: none !important;
  }

  .tab-nav {
    display: none !important;
  }
}
</style>
