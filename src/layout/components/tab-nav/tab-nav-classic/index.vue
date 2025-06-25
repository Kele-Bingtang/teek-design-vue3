<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { ElButton } from "element-plus";
import { Close, ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { useLayoutStore, useSettingStore } from "@/pinia";
import { useNamespace } from "@/composables";
import { useTabNav } from "../use-tab-nav";
import MoreButton from "../components/more-button/index.vue";
import RightMenu from "../components/right-menu/index.vue";

import "./index.scss";

defineOptions({ name: "ClassicTabNav" });

const { type = "classic" } = defineProps<{ type?: "simple" | "classic" }>();

const ns = useNamespace("classic-tabs-nav");
const route = useRoute();
const layoutStore = useLayoutStore();
const settingStore = useSettingStore();

const tabBodyLeft = ref(0); // tabNav 滚动
const tabNavRef = useTemplateRef("tabNavRef"); // 导航栏标签
const scrollContainerRef = useTemplateRef("scrollContainerRef"); // 滚动栏标签
const scrollBodyRef = useTemplateRef("scrollBodyRef"); // tabNav 滚动栏
const tabsRef = useTemplateRef<any>("tabsRef"); // tab 标签
const hasScroll = ref(false); // 是否出现滚动条

const {
  selectedTab,
  tabNavList,
  rightMenuVisible,
  contextMenuCondition,
  rightMenuLeft,
  rightMenuTop,
  isActive,
  tabsDrop,
  initAffixTabs,
  getTabByRoute,
  addTabByRoute,
  openRightMenu,
  closeCurrentTab,
} = useTabNav();

onMounted(() => {
  tabsDrop(`.${ns.e("scroll-body")}`, `.${ns.e("tab")}`);
  initAffixTabs();
  addTabByRoute();
});

/**
 * 找出访问的目标 tab
 */
const findTargetTab = async () => {
  await nextTick();

  if (!tabsRef.value || !tabsRef.value.length) return;

  for (const tab of tabsRef.value) {
    if (route.path === tab?.to) {
      moveToTargetTab(tab.$el);
      // 当 query 不一样
      if (tab.to.path !== route.fullPath) {
        const tabParam = getTabByRoute(route);
        layoutStore.updateTab(tabParam);
      }
    }
  }
};

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
 * 移动到目标 tab，如果目标 tab 在 TabNav 可视区域外面，则有滚动的动画效果
 */
const moveToTargetTab = (tabElement: HTMLElement) => {
  const outerWidth = scrollContainerRef.value?.offsetWidth || 0;
  const bodyWidth = scrollBodyRef.value?.offsetWidth || 0;
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
  if (tabOffsetLeft < currentScrollLeft) {
    tabBodyLeft.value = -tabOffsetLeft + outerPadding;
  }
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
  if (type === "DOMMouseScroll" || type === "mousewheel") {
    delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
  }
  handleScroll(delta);
};

// TagsNav 滚动回调
const handleScroll = (offset: number) => {
  const outerWidth = scrollContainerRef.value?.offsetWidth as number;
  const bodyWidth = scrollBodyRef.value?.offsetWidth as number;

  if (offset > 0) tabBodyLeft.value = Math.min(0, tabBodyLeft.value + offset);
  else if (outerWidth < bodyWidth) {
    if (tabBodyLeft.value >= -(bodyWidth - outerWidth)) {
      tabBodyLeft.value = Math.max(tabBodyLeft.value + offset, outerWidth - bodyWidth);
    }
  } else tabBodyLeft.value = 0;
};
</script>

<template>
  <div :class="[ns.b(), ns.is(type), 'flx-align-center', 'tab-nav']" ref="tabNavRef">
    <div v-show="hasScroll" :class="[ns.e('btn'), ns.is('left')]">
      <el-button plain @click="handleScroll(240)">
        <Icon><ArrowLeft /></Icon>
      </el-button>
    </div>

    <div :class="ns.e('scroll')" ref="scrollContainerRef">
      <div
        ref="scrollBodyRef"
        :class="ns.e('scroll-body')"
        :style="{ left: tabBodyLeft + 'px' }"
        @DOMMouseScroll="handleScrollOnDom"
        @mousewheel="handleScrollOnDom"
      >
        <router-link
          ref="tabsRef"
          v-for="tab in tabNavList"
          :key="tab.path"
          :to="tab.path"
          :class="[ns.e('tab'), ns.is('active', isActive(tab))]"
          @contextmenu.prevent="openRightMenu($event, tab, tabNavRef)"
        >
          <Icon
            v-if="tab.meta.icon && settingStore.showTabNavIcon"
            :icon="tab.meta.icon"
            :class="ns.em('tab', 'icon')"
          />
          <span class="dot" v-else-if="settingStore.showTabNavDot || !tab.meta.icon" />
          <span>{{ tab.title }}</span>
          <Icon class="icon-close" v-if="tab.close" @click.prevent.stop="closeCurrentTab(tab)">
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
        :selected-tab="selectedTab"
        :visible="rightMenuVisible"
        :left="rightMenuLeft"
        :top="rightMenuTop"
        :condition="contextMenuCondition"
      />
    </transition>
  </div>
</template>
