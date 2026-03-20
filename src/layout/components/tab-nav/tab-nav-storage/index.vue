<!-- /* 🗂️ 收纳模式标签页组件 - 抽屉式展示标签页 白木开发🔗gl.baimu.live */ -->
<script setup lang="ts">
import type { TabProps } from "@/pinia";
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { ElButton } from "element-plus";
import { Close, ArrowDown, FolderOpened, List } from "@element-plus/icons-vue";
import { isString } from "@/common/utils";
import { useNamespace, useCommon } from "@/composables";
import { useSettingStore } from "@/pinia";
import { useTabNav } from "../use-tab-nav";
import MoreButton from "../components/more-button/index.vue";
import RightMenu from "../components/right-menu/index.vue";
import { TabNavElementModeEnum } from "@/common/enums";

import "./index.scss";

defineOptions({ name: "StorageTabNav" });

const ns = useNamespace("storage-tabs-nav");
const { getTitle } = useCommon();
const route = useRoute();
const settingStore = useSettingStore();
const router = useRouter();

const { tabNav } = storeToRefs(settingStore);

/* 🔗 抽屉显示状态 */
const drawerVisible = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const {
  rightMenuActiveTab,
  tabNavList,
  rightMenuVisible,
  contextMenuCondition,
  rightMenuLeft,
  rightMenuTop,
  isActive,
  addTabByRoute,
  openRouteInNewWindow,
  openRightMenu,
  closeTab,
} = useTabNav();

/* 🔗 计算当前激活的标签数量 */
const activeTabCount = computed(() => tabNavList.value.length);

/* 🔗 监听路由变化 */
watch(
  () => route.fullPath,
  () => {
    if (route.meta.isFull) return;
    addTabByRoute();
  }
);

/* 🔗 鼠标点击回调 */
const handleClick = (tab: TabProps, type: "left" | "middle") => {
  /* 鼠标左侧点击 - 跳转路由并关闭抽屉 */
  if (type === "left") {
    router.push(tab.path);
    drawerVisible.value = false;
    return;
  }

  /* 鼠标中键点击 */
  if (type === "middle") {
    if (tabNav.value.middleClickToOpenInNewWindow) return openRouteInNewWindow(tab.path);
    if (tabNav.value.middleClickToOpen) {
      router.push(tab.path);
      drawerVisible.value = false;
      return;
    }
    if (tabNav.value.middleClickToClose) return closeTab(tab);
  }
};

/* 🔗 打开抽屉 */
const openDrawer = () => {
  drawerVisible.value = true;
};

/* 🔗 关闭抽屉 */
const closeDrawer = () => {
  drawerVisible.value = false;
};

/* 🔗 在抽屉中打开右键菜单 */
const handleContextMenu = (e: MouseEvent, tab: TabProps) => {
  const drawerBody = dropdownRef.value;
  openRightMenu(e, tab, drawerBody);
};

/* 🔗 切换收纳模式 */
const toggleStorageMode = () => {
  const newMode =
    tabNav.value.elementMode === TabNavElementModeEnum.Storage
      ? TabNavElementModeEnum.Classic
      : TabNavElementModeEnum.Storage;
  settingStore.$patch({ tabNav: { elementMode: newMode } });
};

/* 🔗 点击外部关闭抽屉 */
const handleClickOutside = (e: MouseEvent) => {
  if (!drawerVisible.value) return;

  const target = e.target as HTMLElement;
  const dropdown = dropdownRef.value;
  const triggerBtn = document.querySelector(`.${ns.e("trigger")}`);

  /* 如果点击的是下拉区域或触发按钮，不关闭 */
  if (dropdown?.contains(target) || triggerBtn?.contains(target)) return;

  drawerVisible.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

watch(
  () => tabNavList,
  () => {
    nextTick();
  },
  { deep: true }
);
</script>

<template>
  <div :class="[ns.b()]" class="flx-align-center tab-nav">
    <!-- /* 🗂️ 查看标签页按钮 */ -->
    <div :class="ns.e('trigger')">
      <el-button type="primary" plain size="small" :class="ns.e('trigger-btn')" @click="openDrawer">
        <Icon><FolderOpened /></Icon>
        <span>查看标签页</span>
        <span :class="ns.e('count')">({{ activeTabCount }})</span>
        <Icon><ArrowDown /></Icon>
      </el-button>
    </div>

    <!-- /* 🗂️ 收纳模式切换按钮 */ -->
    <el-button
      v-show="tabNav.showMore"
      text
      size="small"
      :class="ns.e('storage-btn')"
      :type="tabNav.elementMode === TabNavElementModeEnum.Storage ? 'primary' : ''"
      @click="toggleStorageMode"
    >
      <Icon><List /></Icon>
      <span>列表</span>
    </el-button>

    <MoreButton v-show="tabNav.showMore" />

    <!-- /* 🗂️ 高斯模糊遮罩层 */ -->
    <transition name="el-fade-in">
      <div v-show="drawerVisible" :class="ns.e('backdrop')" @click="closeDrawer"></div>
    </transition>

    <!-- /* 🗂️ 下拉式标签页展示 */ -->
    <transition name="el-zoom-in-top">
      <div v-show="drawerVisible" ref="dropdownRef" :class="ns.e('dropdown')">
        <!-- /* 💕 标签卡片列表 */ -->
        <div :class="ns.e('card-list')">
          <div
            v-for="(tab, index) in tabNavList"
            :key="index"
            :to="tab.path"
            :class="[ns.e('card'), ns.is('active', isActive(tab))]"
            @click.left="handleClick(tab, 'left')"
            @click.middle="handleClick(tab, 'middle')"
            @contextmenu.prevent="handleContextMenu($event, tab)"
          >
            <!-- /* 🏷️ 标签图标 */ -->
            <div :class="ns.e('card-icon')">
              <Icon
                v-if="
                  tab.meta.icon &&
                  tabNav.showIcon &&
                  (!isString(tab.meta.icon) && '__name' in tab.meta.icon ? 'setup' in tab.meta.icon : true)
                "
                :icon="tab.meta.icon"
              />
              <span class="dot" v-else-if="tabNav.showDot || !tab.meta.icon" />
            </div>

            <!-- /* 🏷️ 标签标题 */ -->
            <span :class="ns.e('card-title')">{{ tab.title || getTitle(tab) }}</span>

            <!-- /* 🏷️ 关闭按钮 */ -->
            <Icon
              v-if="tab.close && tabNavList.length !== 1"
              :class="ns.e('card-close')"
              @click.prevent.stop="closeTab(tab)"
            >
              <Close />
            </Icon>
          </div>
        </div>

        <!-- /* 💕 空状态 */ -->
        <div v-if="tabNavList.length === 0" :class="ns.e('empty')">
          <span>暂无标签页</span>
        </div>
      </div>
    </transition>

    <!-- /* 🗂️ 右键菜单 */ -->
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
