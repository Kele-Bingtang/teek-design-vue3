<script setup lang="ts">
import { computed, ref, nextTick, provide, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { ElMain } from "element-plus";
import { RefreshPageKey } from "@/common/config";
import { getCssVar, getUrlParams, mittBus, removeUnit } from "@/common/utils";
import { LayoutModeEnum } from "@/common/enums";
import { useNamespace } from "@/composables";
import { useLayoutStore, useSettingStore } from "@/pinia";
import TabNav from "../tab-nav/index.vue";
import Maximize from "./components/maximize.vue";
import FrameLayout from "../iframe/index.vue";

defineOptions({ name: "MainContent" });

const ns = useNamespace();

const layoutStore = useLayoutStore();
const settingStore = useSettingStore();

const { topHeight, topHeightStyle } = useTopHeight();
const { isRefreshRoute } = useRefreshPage();
// const { topState } = useWatchTop();

const { layout, tabNav, transition, header } = storeToRefs(settingStore);

// 是否固定标签栏
const isFixedTabNav = computed(() => {
  if (tabNav.value.fixed) return "hidden auto";
  return "";
});

/**
 * 顶部高度
 */
function useTopHeight() {
  const topHeight = computed(() => {
    const { headerHeight, tabNavHeight } = getTopHeight();
    return headerHeight + tabNavHeight;
  });

  // 计算非内容区高度
  const topHeightStyle = computed(() => {
    const { headerHeight, tabNavHeight } = getTopHeight();

    return {
      [ns.cssVarName("header-height")]: `${headerHeight}px`,
      [ns.cssVarName("tab-height")]: `${tabNavHeight}px`,
    };
  });

  /**
   * 获取顶部高度
   */
  const getTopHeight = () => {
    let headerHeight = 0;
    let tabNavHeight = 0;

    // 内容最大化时，顶栏高度和标签栏高度都为 0
    if (!layout.value.maximize) {
      // 嵌入布局没有顶栏
      if (layout.value.layoutMode !== LayoutModeEnum.IFrame && header.value.enabled) {
        headerHeight = removeUnit(getCssVar(ns.cssVarName("layout-header-height"))) ?? 0;
      }
      // 隐藏标签栏时，标签栏高度为 0
      if (tabNav.value.enabled) {
        tabNavHeight = removeUnit(getCssVar(ns.cssVarName("layout-tab-height"))) ?? 0;
      }
    }
    return {
      headerHeight,
      tabNavHeight,
    };
  };

  return { topHeight, topHeightStyle };
}

/**
 * 刷新页面
 */
function useRefreshPage() {
  const isRefreshRoute = ref(true);

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

  mittBus.on(RefreshPageKey, refreshPage as any);

  return { isRefreshRoute, refreshPage };
}

// function useWatchTop() {
//   const topState = ref(true);

//   const { y: mouseY } = useMouse({ type: "client" });

//   watch(
//     () => mouseY.value,
//     newValue => {
//       if (newValue > topHeight.value) topState.value = false;
//       else topState.value = true;
//     }
//   );

//   return { topState };
// }

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

defineExpose({ topHeight });
</script>

<template>
  <Maximize v-if="layout.maximize" />
  <el-main ref="elMainInstance">
    <TabNav />

    <div class="page-content" :style="topHeightStyle">
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

  :deep(.tk-classic-tabs-nav) {
    transition: height 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
