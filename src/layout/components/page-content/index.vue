<script setup lang="ts">
import { ref, nextTick, provide, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { ElMain } from "element-plus";
import { RefreshPageKey } from "@/common/config";
import { getUrlParams, mittBus } from "@/common/utils";
import { useNamespace } from "@/composables";
import { useLayoutStore, useSettingStore } from "@/pinia";
import Maximize from "./components/maximize.vue";
import FrameLayout from "../iframe/index.vue";

defineOptions({ name: "MainContent" });

const ns = useNamespace("page-content");

const layoutStore = useLayoutStore();
const settingStore = useSettingStore();

const { isRefreshRoute } = useRefreshPage();

const { layout, transition } = storeToRefs(settingStore);

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
</script>

<template>
  <Maximize v-if="layout.maximize" />
  <el-main :class="ns.b()" class="page-content" v-bind="$attrs">
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
    <FrameLayout />
  </el-main>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(page-content) {
  // 配置项 headerShowMode 为 autoHidden、scrollHidden 时，通过 z-index 确保内容区的层级大于顶栏
  z-index: 1;
  height: 100%;
  padding: 10px 12px;
  background-color: cssVar(layout-page-bg-color);
}
</style>

<style lang="scss">
@use "@styles/mixins/bem" as *;

/* 当前页面最大化 */
.page-maximize {
  @include joins(columns-layout__aside, auto-top) {
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
