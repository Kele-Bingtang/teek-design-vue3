import type { IFrame } from "@/layout/components/iframe/use-iframe";
import type { Component } from "vue";
import type { IconifyIcon } from "@iconify/vue";

import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { useCache } from "@/composables";
import SystemConfig from "@/common/config";
import { useSettingStore } from "./setting";

// LayoutState
export interface TabProp {
  path: string; // 路由的 path
  name: string; // 路由的 name
  title: string; // 展示的描述
  icon: string | IconifyIcon | Component; // 图标
  close: boolean; // 是否允许关闭
  meta: MetaProp;
}

export const useLayoutStore = defineStore(
  "layoutStore",
  () => {
    const tabNavList = ref<TabProp[]>(useCache().getCacheTabNavList() || []);
    const keepAliveName = ref<string[]>([]);
    const layoutSize = ref(SystemConfig.layoutConfig.layoutSize);
    const language = ref(SystemConfig.layoutConfig.language);
    const iframeList = ref<IFrame[]>([]);

    const addTab = async (tab: TabProp) => {
      const path = tab.path;

      if (tab.meta.hideInTab) return;
      if (tabNavList.value.some(v => v.path === path || v.path + "/" === path)) return;
      // 判断动态路由的可打开最大数量
      const dynamicLevel = tab.meta.dynamicLevel ?? -1;

      if (dynamicLevel > 0 && tabNavList.value.filter(t => t.name === tab.name).length >= dynamicLevel) {
        // 如果当前已打开的动态路由数大于 dynamicLevel，替换第一个动态路由标签
        const index = tabNavList.value.findIndex(t => t.name === tab.name);
        index !== -1 && tabNavList.value.splice(index, 1);
      }
      tabNavList.value.push(tab);
    };

    const removeCurrentTab = async (tab: TabProp) => {
      for (const [i, v] of tabNavList.value.entries()) {
        if (v.path === tab.path) {
          tabNavList.value.splice(i, 1);
          removeIFrame(tab);
          break;
        }
      }
    };

    const removeBatchTab = async (pathList: string[]) => {
      pathList.forEach(path => {
        removeCurrentTab({ path } as TabProp);
      });
    };

    const removeLeftTab = async (tab: TabProp) => {
      const index = tabNavList.value.findIndex(v => v.path === tab.path);
      if (index === -1) return;

      const iframeNameList = iframeList.value.map(e => e.name);
      tabNavList.value = tabNavList.value.filter((item, i) => {
        if (iframeNameList.includes(item.name)) removeIFrame(item);
        if (i >= index || (item.meta && item.meta.isAffix)) return true;
        if (tab.meta.isKeepAlive) removeKeepAliveName(tab.name);
        return false;
      });
    };

    const removeRightTab = async (tab: TabProp) => {
      const index = tabNavList.value.findIndex(v => v.path === tab.path);
      if (index === -1) return;

      const iframeNameList = iframeList.value.map(e => e.name);
      tabNavList.value = tabNavList.value.filter((item, i) => {
        if (iframeNameList.includes(item.name)) removeIFrame(item);
        if (i <= index || (item.meta && item.meta.isAffix)) return true;
        if (tab.meta.isKeepAlive) removeKeepAliveName(tab.name);
        return false;
      });
    };

    const removeOtherTabs = async (tab: TabProp) => {
      tabNavList.value = tabNavList.value.filter(v => {
        return !v.close || v.path === tab.path;
      });

      iframeList.value = iframeList.value.filter(v => {
        return v.name === tab.name;
      });
    };

    const removeAllTabs = async () => {
      const fixedTabs = tabNavList.value.filter(tab => !tab.close);
      tabNavList.value = fixedTabs;
      iframeList.value = [];
    };

    const updateTab = (tab: TabProp) => {
      for (let v of tabNavList.value) {
        if (v.path === tab.path) {
          v = Object.assign(v, tab);
          break;
        }
      }
    };

    const addKeepAliveName = async (name: string) => {
      !keepAliveName.value.includes(name) && keepAliveName.value?.push(name);
    };

    const removeKeepAliveName = async (name: string) => {
      keepAliveName.value = keepAliveName.value.filter(item => item !== name);
    };

    const setKeepAliveName = async (keepAliveNameList: string[] = []) => {
      keepAliveName.value = keepAliveNameList;
    };

    const addIFrame = (obj: IFrame) => {
      iframeList.value.push(obj);
    };

    const removeIFrame = (tab: TabProp) => {
      for (const [i, v] of iframeList.value.entries()) {
        if (v.name === tab.name) {
          iframeList.value.splice(i, 1);
          break;
        }
      }
    };

    const settingStore = useSettingStore();

    watch(
      () => settingStore.recordTabNav,
      () => {
        handleRecordTabNav(settingStore.recordTabNav);
      }
    );
    watch(
      () => tabNavList.value,
      () => {
        handleRecordTabNav(settingStore.recordTabNav);
      },
      { deep: true }
    );

    const handleRecordTabNav = (value: boolean) => {
      if (value) useCache().setCacheTabNavList(tabNavList.value);
      else useCache().removeCacheTabNavList();
    };

    return {
      tabNavList,
      keepAliveName,
      layoutSize,
      language,
      iframeList,

      addTab,
      removeCurrentTab,
      removeBatchTab,
      removeLeftTab,
      removeRightTab,
      removeOtherTabs,
      removeAllTabs,
      updateTab,
      addKeepAliveName,
      removeKeepAliveName,
      setKeepAliveName,
      addIFrame,
      removeIFrame,
    };
  },
  {
    persist: {
      pick: ["layoutSize", "language", "device"],
    },
  }
);
