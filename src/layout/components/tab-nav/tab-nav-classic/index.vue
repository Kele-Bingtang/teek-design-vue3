<script setup lang="ts">
import type { TabProps } from "@/pinia";
import { ref, onMounted, watch, nextTick, useTemplateRef } from "vue";
import { useRoute } from "vue-router";
import { ElButton } from "element-plus";
import { Close, ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { isString, openRouteInNewWindow } from "@/common/utils";
import { useNamespace, useCommon } from "@/composables";
import { useSettingStore } from "@/pinia";
import { useTabNav } from "../use-tab-nav";
import MoreButton from "../components/more-button/index.vue";
import RightMenu from "../components/right-menu/index.vue";

import "./index.scss";

defineOptions({ name: "ClassicTabNav" });

const { type = "classic" } = defineProps<{ type?: "simple" | "classic" }>();

const ns = useNamespace("classic-tabs-nav");
const { getTitle } = useCommon();
const route = useRoute();
const settingStore = useSettingStore();
const router = useRouter();

const tabBodyLeft = ref(0); // tabNav 滚动
const hasScroll = ref(false); // 是否出现滚动条
const tabNavInstance = useTemplateRef("tabNavInstance"); // 导航栏标签
const scrollContainerInstance = useTemplateRef("scrollContainerInstance"); // 滚动栏标签
const scrollBodyInstance = useTemplateRef("scrollBodyInstance"); // tabNav 滚动栏
const tabsInstance = useTemplateRef("tabsInstance"); // tab 标签

const { tabNav } = storeToRefs(settingStore);

const {
  rightMenuActiveTab,
  tabNavList,
  rightMenuVisible,
  contextMenuCondition,
  rightMenuLeft,
  rightMenuTop,
  isActive,
  tabsDragSort,
  initAffixTabs,
  addTabByRoute,
  openRightMenu,
  closeTab,
} = useTabNav();

// 监听路由的变化
watch(
  () => route.fullPath,
  () => {
    if (route.meta.isFull) return;
    addTabByRoute();
    findTargetTab();
  }
);
watch(
  () => tabNavList,
  () => {
    findTargetTab();
  },
  { deep: true }
);

/**
 * 找出访问的目标 tab
 */
const findTargetTab = async () => {
  await nextTick();

  if (!tabsInstance.value || !tabsInstance.value.length) return;
  const targetTab = tabsInstance.value.find(tab => route.path === tab.getAttribute("to"));

  targetTab && moveToTargetTab(targetTab);
};

/**
 * 移动到目标 tab，如果目标 tab 在 TabNav 可视区域外面，则有滚动的动画效果
 */
const moveToTargetTab = (tabElement: HTMLElement) => {
  const outerWidth = scrollContainerInstance.value?.offsetWidth || 0;
  const bodyWidth = scrollBodyInstance.value?.offsetWidth || 0;
  hasScroll.value = bodyWidth > outerWidth;

  if (bodyWidth <= outerWidth) {
    tabBodyLeft.value = 0;
    return;
  }

  const outerPadding = 4;
  const tabOffsetLeft = tabElement.offsetLeft;
  const tabWidth = tabElement.offsetWidth;
  const currentScrollLeft = -tabBodyLeft.value;

  // 可视区域右边界
  const visibleRightEdge = currentScrollLeft + outerWidth - outerPadding;
  // Tab 的右边界
  const tabRightEdge = tabOffsetLeft + tabWidth;

  // 如果 Tab 完全在可视区域内，无需滚动
  if (tabOffsetLeft >= currentScrollLeft && tabRightEdge <= visibleRightEdge) return;
  // Tab 在左侧不可见
  if (tabOffsetLeft < currentScrollLeft) tabBodyLeft.value = -tabOffsetLeft + outerPadding;
  // Tab 在右侧不可见
  else if (tabRightEdge > visibleRightEdge) {
    const newScrollLeft = tabRightEdge - outerWidth + outerPadding;
    tabBodyLeft.value = -newScrollLeft;
  }
};

// 鼠标点击回调
const handleClick = (tab: TabProps, type: "left" | "middle") => {
  // 鼠标左侧点击
  if (type === "left") return router.push(tab.path);

  // 鼠标中键点击
  if (type === "middle") {
    if (tabNav.value.middleClickToOpenInNewWindow) return openRouteInNewWindow(tab.path);
    if (tabNav.value.middleClickToOpen) return router.push(tab.path);
    if (tabNav.value.middleClickToClose) return closeTab(tab);
  }
};

// 鼠标滚动回调
const handleScrollOnDom = (e: MouseEvent & { wheelDelta: number }) => {
  if (!tabNav.value.wheel) return;

  const type = e.type;
  let delta = 0;
  if (["DOMMouseScroll", "mousewheel"].includes(type)) {
    delta = e.wheelDelta ?? -(e.detail || 0) * 40;
  }
  handleScroll(delta);
};

// TagsNav 滚动回调
const handleScroll = (offset: number) => {
  const tabNavWidth = scrollContainerInstance.value?.offsetWidth as number;
  const canScrollWidth = scrollBodyInstance.value?.offsetWidth as number;

  // 没有超出标签栏宽度则不需要滚动
  if (tabNavWidth >= canScrollWidth) {
    tabBodyLeft.value = 0;
    return;
  }

  // 偏移量最大值为 0，从 0 开始，向右移动时偏移量越来越小（负数），等于 标签栏宽度 - 可以滚动的宽度（负数所以反着减） 到达最有边界，向左移动时偏移量越接近 0，等于 0 则到达最左边界
  const newLeft = tabBodyLeft.value + offset;
  tabBodyLeft.value = Math.max(Math.min(newLeft, 0), tabNavWidth - canScrollWidth);
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
  tabNav.value.draggable && tabsDragSort(`.${ns.e("scroll-body")}`, `.${ns.e("tab")}`);
  initAffixTabs();
  addTabByRoute();

  const outerWidth = scrollContainerInstance.value?.offsetWidth || 0;
  const bodyWidth = scrollBodyInstance.value?.offsetWidth || 0;
  hasScroll.value = bodyWidth > outerWidth;
});
</script>

<template>
  <div ref="tabNavInstance" :class="[ns.b(), ns.is(type)]" class="flx-align-center tab-nav">
    <div v-show="hasScroll" :class="[ns.e('btn'), ns.is('left')]">
      <el-button plain @click="handleScroll(240)">
        <Icon><ArrowLeft /></Icon>
      </el-button>
    </div>

    <div :class="ns.e('scroll')" ref="scrollContainerInstance">
      <div
        ref="scrollBodyInstance"
        :class="ns.e('scroll-body')"
        :style="{ left: tabBodyLeft + 'px' }"
        @DOMMouseScroll="handleScrollOnDom"
        @mousewheel="handleScrollOnDom"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
      >
        <div
          ref="tabsInstance"
          v-for="(tab, index) in tabNavList"
          :key="index"
          :to="tab.path"
          :class="[ns.e('tab'), ns.is('active', isActive(tab))]"
          @click.left="handleClick(tab, 'left')"
          @click.middle="handleClick(tab, 'middle')"
          @contextmenu.prevent="openRightMenu($event, tab, tabNavInstance)"
        >
          <Icon
            v-if="
              tab.meta.icon &&
              tabNav.showIcon &&
              (!isString(tab.meta.icon) && '__name' in tab.meta.icon ? 'setup' in tab.meta.icon : true)
            "
            :icon="tab.meta.icon"
            :class="ns.em('tab', 'icon')"
          />
          <span class="dot" v-else-if="tabNav.showDot || !tab.meta.icon" />
          <span>{{ tab.title || getTitle(tab) }}</span>
          <Icon class="icon-close" v-if="tab.close && tabNavList.length !== 1" @click.prevent.stop="closeTab(tab)">
            <Close />
          </Icon>
        </div>
      </div>
    </div>

    <div v-show="hasScroll" :class="[ns.e('btn'), ns.is('right')]">
      <el-button plain @click="handleScroll(-240)">
        <Icon><ArrowRight /></Icon>
      </el-button>
    </div>

    <MoreButton v-show="tabNav.showMore" />

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
