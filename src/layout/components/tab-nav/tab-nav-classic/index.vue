<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { ElButton } from "element-plus";
import { Close, ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { useSettingStore } from "@/pinia";
import { useNamespace } from "@/composables";
import { useTabNav } from "../use-tab-nav";
import MoreButton from "../components/more-button/index.vue";
import RightMenu from "../components/right-menu/index.vue";

import "./index.scss";
import { isString } from "@/common/utils";

defineOptions({ name: "ClassicTabNav" });

const { type = "classic" } = defineProps<{ type?: "simple" | "classic" }>();

const ns = useNamespace("classic-tabs-nav");
const route = useRoute();
const settingStore = useSettingStore();

const tabBodyLeft = ref(0); // tabNav 滚动
const tabNavInstance = useTemplateRef("tabNavInstance"); // 导航栏标签
const scrollContainerInstance = useTemplateRef("scrollContainerInstance"); // 滚动栏标签
const scrollBodyInstance = useTemplateRef("scrollBodyInstance"); // tabNav 滚动栏
const tabsInstance = useTemplateRef<any>("tabsInstance"); // tab 标签
const hasScroll = ref(false); // 是否出现滚动条

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

/**
 * 找出访问的目标 tab
 */
const findTargetTab = async () => {
  await nextTick();

  if (!tabsInstance.value || !tabsInstance.value.length) return;
  const targetTab = tabsInstance.value.find((tab: any) => route.path === tab?.to);

  moveToTargetTab(targetTab?.$el);
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

// 鼠标中键滚动回调
const handleScrollOnDom = (e: MouseEvent & { wheelDelta: number }) => {
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
  tabsDragSort(`.${ns.e("scroll-body")}`, `.${ns.e("tab")}`);
  initAffixTabs();
  addTabByRoute();
});
</script>

<template>
  <div ref="tabNavInstance" :class="[ns.b(), ns.is(type), 'flx-align-center', 'tab-nav']">
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
        <router-link
          ref="tabsInstance"
          v-for="(tab, index) in tabNavList"
          :key="index"
          :to="tab.path"
          :class="[ns.e('tab'), ns.is('active', isActive(tab))]"
          @contextmenu.prevent="openRightMenu($event, tab, tabNavInstance)"
        >
          <Icon
            v-if="
              tab.meta.icon &&
              settingStore.showTabNavIcon &&
              (!isString(tab.meta.icon) && '__name' in tab.meta.icon ? 'setup' in tab.meta.icon : true)
            "
            :icon="tab.meta.icon"
            :class="ns.em('tab', 'icon')"
          />
          <span class="dot" v-else-if="settingStore.showTabNavDot || !tab.meta.icon" />
          <span>{{ tab.title }}</span>
          <Icon class="icon-close" v-if="tab.close && tabNavList.length !== 1" @click.prevent.stop="closeTab(tab)">
            <Close />
          </Icon>
        </router-link>
      </div>
    </div>

    <div v-show="hasScroll" :class="[ns.e('btn'), ns.is('right')]">
      <el-button plain @click="handleScroll(-240)">
        <Icon><ArrowRight /></Icon>
      </el-button>
    </div>

    <MoreButton />

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
