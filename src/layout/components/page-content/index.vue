<script setup lang="ts">
import type { Component } from "vue";
import { computed, ref, nextTick, provide, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { ElMain } from "element-plus";
import { RefreshPageKey } from "@/common/config";
import { getCssVar, getUrlParams, mittBus, removeUnit } from "@/common/utils";
import { LayoutModeEnum, TabNavModeEnum } from "@/common/enums";
import { useLayoutStore, useSettingStore } from "@/pinia";
import SimpleTabNav from "../tab-nav/tab-nav-simple/index.vue";
import ClassicTabNav from "../tab-nav/tab-nav-classic/index.vue";
import ElTabNav from "../tab-nav/tab-nav-element/index.vue";
import Maximize from "./components/maximize.vue";
import FrameLayout from "../iframe/index.vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "MainContent" });

const ns = useNamespace();

const layoutStore = useLayoutStore();
const settingStore = useSettingStore();

const { layout, tabNav, transition } = storeToRefs(settingStore);

// 标签栏组件
const TabNavComponents: Record<string, Component> = {
  [TabNavModeEnum.Simple]: SimpleTabNav,
  [TabNavModeEnum.Classic]: ClassicTabNav,
  [TabNavModeEnum.Element]: ElTabNav,
};

const isRefreshRoute = ref(true);

// 计算非内容区高度
const topHeight = computed(() => {
  let headerHeight = 0;
  let tabHeight = 0;

  // 内容最大化时，顶栏高度和标签栏高度都为 0
  if (!layout.value.maximize) {
    // 嵌入布局没有顶栏
    if (layout.value.layoutMode !== LayoutModeEnum.IFrame) {
      headerHeight = removeUnit(getCssVar(ns.cssVarName("layout-header-height"))) ?? 0;
    }
    // 隐藏标签栏时，标签栏高度为 0
    if (tabNav.value.enabled) {
      tabHeight = removeUnit(getCssVar(ns.cssVarName("layout-tab-height"))) ?? 0;
    }
  }

  return {
    [ns.cssVarName("header-height")]: `${headerHeight}px`,
    [ns.cssVarName("tab-height")]: `${tabHeight}px`,
  };
});

/**
 * 刷新当前页面函数
 */
const refreshPage = (value?: boolean) => {
  if (value !== undefined) return (isRefreshRoute.value = value);
  isRefreshRoute.value = false;

  nextTick(() => (isRefreshRoute.value = true));
};

/**
 * 往所有路径组件提供刷新当前页面函数
 */
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
    if (layout.value.maximize) app?.classList.add("page-maximize");
    else app?.classList.remove("page-maximize");
  }
});

/**
 * 是否固定标签栏
 */
const isFixedTabNav = computed(() => {
  if (tabNav.value.fixed) return "hidden auto";
  return "";
});
</script>

<template>
  <Maximize v-if="layout.maximize" />
  <el-main>
    <component v-if="tabNav.enabled" :is="TabNavComponents[tabNav.tabNavMode]" />

    <div class="page-content" :style="topHeight">
      <router-view v-slot="{ Component, route }">
        <transition
          v-bind="route.meta.transitionProps"
          :name="route.meta.transitionProps?.name || transition.pageEnter"
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
    height: calc(100vh - cssVar(header-height) - cssVar(tab-height));
    padding: 10px 12px;
    overflow: v-bind(isFixedTabNav);
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
