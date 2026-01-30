<script setup lang="ts">
import type { TabPaneName, TabsPaneContext, TabsInstance } from "element-plus";
import type { TabProps } from "@/pinia";
import { onMounted, watch, useTemplateRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElTabs, ElTabPane } from "element-plus";
import { addUnit, removeUnit, isString, openRouteInNewWindow } from "@/common/utils";
import { useCommon, useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";
import { useTabNav } from "../use-tab-nav";
import RightMenu from "../components/right-menu/index.vue";
import MoreButton from "../components/more-button/index.vue";

import "./index.scss";

defineOptions({ name: "ElTabNav" });

const ns = useNamespace("el-tabs-nav");
const { getTitle } = useCommon();
const route = useRoute();
const router = useRouter();
const settingStore = useSettingStore();

const { tabNav } = storeToRefs(settingStore);

const {
  activeTab,
  rightMenuActiveTab,
  tabNavList,
  rightMenuVisible,
  contextMenuCondition,
  rightMenuLeft,
  rightMenuTop,
  tabsDragSort,
  initAffixTabs,
  addTabByRoute,
  closeTab,
  openRightMenu,
} = useTabNav();

const tabNavInstance = useTemplateRef("tabNavInstance"); // 导航栏标签
const elTabsInstance = useTemplateRef<TabsInstance>("elTabsInstance"); // 导航栏标签

// 监听路由的变化
watch(
  () => route.fullPath,
  () => {
    if (route.meta.isFull) return;
    addTabByRoute();
  }
);

// Tab 点击回调
const tabClick = (tabItem: TabsPaneContext) => {
  const path = tabItem.paneName as string;
  router.push(path);
};

// Tab 鼠标中键点击回调
const tabMiddleClick = (tab: TabProps) => {
  if (tabNav.value.middleClickToOpenInNewWindow) return openRouteInNewWindow(tab.path);
  if (tabNav.value.middleClickToOpen) return router.push(tab.path);
  if (tabNav.value.middleClickToClose) tabRemove(tab.path);
};

// 删除一个 Tab
const tabRemove = async (path: TabPaneName) => {
  const tab = tabNavList.value.find(item => item.path === path);
  if (tab) closeTab(tab);
};

// 鼠标中键滚动回调
const handleScrollOnDom = (e: MouseEvent & { wheelDelta: number }) => {
  if (!tabNav.value.wheel) return;

  const type = e.type;
  let delta = 0;
  if (["DOMMouseScroll", "mousewheel"].includes(type)) {
    delta = e.wheelDelta ?? -(e.detail || 0) * 40;
  }
  handleScroll(delta);
};

const handleScroll = (offset: number) => {
  const navContainerDom = elTabsInstance.value?.$el.querySelector(ns.joinEl("tabs__nav-scroll"));
  const tabListDom = elTabsInstance.value?.tabNavRef?.tabListRef;
  if (!navContainerDom || !tabListDom) return;

  const tabNavWidth = navContainerDom.offsetWidth;
  const canScrollWidth = tabListDom?.offsetWidth;

  // 没有超出标签栏宽度则不需要滚动
  if (tabNavWidth >= canScrollWidth) {
    tabListDom.style.transform = `translateX(0px)`;
    return;
  }

  // 获取当前偏移量
  const currentOffset = removeUnit(tabListDom?.style.transform.match(/translateX\((.+)\)/)?.[1]) || 0;
  // 偏移量最大值为 0，从 0 开始，向右移动时偏移量越来越小（负数），等于 标签栏宽度 - 可以滚动的宽度（负数所以反着减） 到达最有边界，向左移动时偏移量越接近 0，等于 0 则到达最左边界
  const newOffset = Math.max(Math.min(currentOffset + offset, 0), tabNavWidth - canScrollWidth);

  tabListDom.style.transform = `translateX(${addUnit(newOffset)})`;
};

// ---------- 移动端触屏滚动 ----------
let startX = 0;

const handleTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0];
  startX = touch.clientX;
};

const handleTouchMove = (event: TouchEvent) => {
  const touch = event.touches[0];
  const deltaX = touch.clientX - startX;

  handleScroll(deltaX);

  startX = touch.clientX;
};

onMounted(() => {
  tabNav.value.draggable && tabsDragSort(`.${ns.elNamespace}-tabs__nav`, `.${ns.elNamespace}-tabs__item`);
  initAffixTabs();
  addTabByRoute();
});
</script>

<template>
  <div ref="tabNavInstance" :class="ns.b()" class="tab-nav">
    <div :class="ns.e('content')" class="flx-align-center">
      <el-tabs
        ref="elTabsInstance"
        :model-value="activeTab.path"
        type="card"
        @tab-click="tabClick"
        @tab-remove="tabRemove"
        @DOMMouseScroll="handleScrollOnDom"
        @mousewheel="handleScrollOnDom"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
      >
        <el-tab-pane
          v-for="(tab, index) in tabNavList"
          :key="index"
          :label="tab.title"
          :name="tab.path"
          :closable="tab.close"
        >
          <template #label>
            <div @click.middle="tabMiddleClick(tab)" @contextmenu.prevent="openRightMenu($event, tab, tabNavInstance)">
              <Icon
                v-if="
                  tab.meta.icon &&
                  tabNav.showIcon &&
                  (!isString(tab.meta.icon) && '__name' in tab.meta.icon ? 'setup' in tab.meta.icon : true)
                "
                :icon="tab.meta.icon"
                :class="ns.em('content', 'icon')"
              />
              <span>{{ tab.title || getTitle(tab) }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>

      <MoreButton v-show="tabNav.showMore" />
    </div>

    <transition :name="`${ns.elNamespace}-zoom-in-top`">
      <RightMenu
        v-model="rightMenuVisible"
        :selected-tab="rightMenuActiveTab"
        :left="rightMenuLeft"
        :top="rightMenuTop"
        :condition="contextMenuCondition"
      />
    </transition>
  </div>
</template>
