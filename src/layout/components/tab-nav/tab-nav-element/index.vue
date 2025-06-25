<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElTabs, ElTabPane, type TabPaneName, type TabsPaneContext } from "element-plus";
import { useSettingStore } from "@/pinia";
import { useNamespace } from "@/composables";
import { useTabNav } from "../use-tab-nav";
import RightMenu from "../components/right-menu/index.vue";
import MoreButton from "../components/more-button/index.vue";

import "./index.scss";

defineOptions({ name: "ElTabNav" });

const ns = useNamespace("el-tabs-nav");
const route = useRoute();
const router = useRouter();
const settingStore = useSettingStore();

const {
  selectedTab,
  tabNavList,
  rightMenuVisible,
  contextMenuCondition,
  rightMenuLeft,
  rightMenuTop,
  tabsDrop,
  initAffixTabs,
  addTabByRoute,
  getRouteFullPath,
  closeCurrentTab,
  openRightMenu,
} = useTabNav();

const tabNavValue = ref(getRouteFullPath(route));
const tabNavRef = useTemplateRef("tabNavRef"); // 导航栏标签

onMounted(() => {
  tabsDrop(`.${ns.elNamespace}-tabs__nav`, `.${ns.elNamespace}-tabs__item`);
  initAffixTabs();
  addTabByRoute();
});

// 监听路由的变化
watch(
  () => route.fullPath,
  () => {
    if (route.meta.isFull) return;
    tabNavValue.value = getRouteFullPath(route);
    addTabByRoute();
  }
);

// Tab 点击回调
const tabClick = (tabItem: TabsPaneContext) => {
  const fullPath = tabItem.props.name as string;
  router.push(fullPath);
};

// 删除一个 Tab
const tabRemove = async (fullPath: TabPaneName) => {
  const tab = tabNavList.value.find(item => item.path === fullPath);
  if (tab) closeCurrentTab(tab);
};
</script>

<template>
  <div ref="tabNavRef" :class="[ns.b(), 'tab-nav']">
    <div :class="[ns.e('content'), 'flx-align-center']">
      <el-tabs v-model="tabNavValue" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
        <el-tab-pane
          v-for="tab in tabNavList"
          :key="tab.path"
          :label="tab.title"
          :name="tab.path"
          :closable="tab.close"
        >
          <template #label>
            <div @contextmenu.prevent="openRightMenu($event, tab, tabNavRef)">
              <Icon
                v-if="tab.meta.icon && settingStore.showTabNavIcon"
                :icon="tab.meta.icon"
                :class="ns.em('content', 'icon')"
              />
              <span>{{ tab.title }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>

      <MoreButton />
    </div>

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
