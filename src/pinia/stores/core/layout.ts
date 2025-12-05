import type { IFrame } from "@/layout/components/iframe/use-iframe";
import type { Component } from "vue";
import type { IconifyIcon } from "@iconify/vue";
import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { serviceConfig } from "@/common/config";
import { cacheOperator } from "@/common/utils";
import { useSettingStore } from "./setting";

export interface TabProps {
  /** 路由的 path */
  path: string;
  /** 路由的 name */
  name: string;
  /** 展示的描述 */
  title: string;
  /** 图标 */
  icon: string | IconifyIcon | Component;
  /** 是否允许关闭 */
  close: boolean;
  /** 路由 meta 信息 */
  meta: MetaProps;
}

export const useLayoutStore = defineStore(
  "layoutStore",
  () => {
    const tabNavList = ref<TabProps[]>(cacheOperator.getCacheTabNavList() || []);
    const keepAliveName = ref<string[]>([]);
    const language = ref(serviceConfig.layout.language);
    const iframeList = ref<IFrame[]>([]);

    const settingStore = useSettingStore();

    const { tabNav } = storeToRefs(settingStore);

    const closeTabNavList = computed(() => tabNavList.value.filter(t => t.close));

    /**
     * 根据路由路径找到 tab 信息
     * @param path 路径
     */
    const getTab = (path: string) => tabNavList.value.find(item => item.path === path);
    /**
     * 根据路由路径找到 tab 信息
     * @param path 路径
     */
    const findTabIndex = (path: string) => tabNavList.value.findIndex(item => item.path === path);

    /**
     * 获取第一个可关闭 tab 的下标
     */
    const findCloseTabIndex = () => tabNavList.value.findIndex(item => item.close);
    /**
     * 新增 tab
     */
    const addTab = async (tab: TabProps, updateIfExist = false) => {
      const tabNavListValue = tabNavList.value;

      if (tab.meta.hideInTab) return;
      // 如果关闭 updateIfExist，则已存在的 tab 不做更新
      if (!updateIfExist && tabNavListValue.some(v => [v.path, v.path + "/"].includes(tab.path))) return;

      // 判断动态路由的可打开最大数量
      const dynamicLevel = tab.meta.dynamicLevel ?? -1;
      const dynamicTabNavList = tabNavListValue.filter(t => t.path === tab.path || t.name === tab.name);

      if (dynamicLevel > 0 && dynamicTabNavList.length >= dynamicLevel) {
        const dynamicTabIndex = tabNavListValue.findIndex(t => t.path === tab.path || t.name === tab.name);

        // 如果当前已打开的动态路由数大于 dynamicLevel，则删除第一个动态路由 tab
        dynamicTabIndex !== -1 && tabNavListValue.splice(dynamicTabIndex, 1);
      }

      // 如果已打开的 tab 数量超过最大限制，则删除
      if (tabNav.value.maxCount > 0 && closeTabNavList.value.length >= tabNav.value.maxCount) {
        // 如果当前已打开的 tab大于 maxCount，则删除最先打开的非固定的 tab
        const index = findCloseTabIndex();
        index !== -1 && tabNavList.value.splice(index, closeTabNavList.value.length - tabNav.value.maxCount + 1);
      }

      const tabIndex = findTabIndex(tab.path);

      // tabIndex 为 -1 表示当前标签页不存在，需要新增
      if (tabIndex === -1) {
        if (!tab.close) {
          const closeTabIndex = findCloseTabIndex();
          // 插入到可关闭的标签首部，如果没有可关闭的 tab（closeTabIndex = -1），则代表全是不可关闭的 tab，则添加到末尾
          if (closeTabIndex === -1) tabNavList.value.push(tab);
          else tabNavList.value.splice(closeTabIndex, 0, tab);
        } else tabNavListValue.push(tab);
      } else updateTab(tab);
    };

    /**
     * 更新 tab 信息
     */
    const updateTab = (tab: Partial<TabProps>) => {
      const index = findTabIndex(tab.path ?? "");

      tab.meta ??= {};
      if (tab.title) tab.meta.title = tab.title;
      if (tab.icon) tab.meta.icon = tab.icon;

      if (index !== -1) {
        tabNavList.value[index] = {
          ...tabNavList.value[index],
          ...tab,
          meta: { ...tabNavList.value[index].meta, ...tab.meta },
        };
      }
    };

    /**
     * 切换 tab 的关闭与未关闭状态，如果切换为未关闭，则移动到未关闭的 tab 列表末尾
     */
    const toggleClose = (path: string) => {
      const targetTabIndex = findTabIndex(path);
      if (targetTabIndex === -1) return;

      const tab = { ...tabNavList.value[targetTabIndex] };
      tab.close = !tab.close;

      // 移除原位置
      tabNavList.value.splice(targetTabIndex, 1);

      const closeTabIndex = findCloseTabIndex();
      // 插入到可关闭的标签首部，如果没有可关闭的 tab，则代表全是不可关闭的 tab，则添加到末尾
      if (closeTabIndex === -1) tabNavList.value.push(tab);
      else tabNavList.value.splice(closeTabIndex, 0, tab);
    };

    /**
     * 删除指定的 tab
     */
    const removeTab = async (path: string) => {
      const index = findTabIndex(path);
      if (index === -1) return;

      const v = tabNavList.value[index];
      tabNavList.value.splice(index, 1);

      v.meta.iframeSrc && removeIFrame(v.name);
      v.meta.isKeepAlive && removeKeepAliveName(v.name);
    };

    /**
     * 批量删除 tab
     */
    const removeBatchTab = async (pathList: string[]) => {
      pathList.forEach(path => removeTab(path));
    };

    /**
     * 删除左侧 tab
     */
    const removeLeftTab = async (tab: TabProps) => {
      const index = findTabIndex(tab.path);
      if (index === -1) return;

      tabNavList.value = tabNavList.value.filter((item, i) => {
        if (i >= index || item.meta?.isAffix) return true;
        item.meta?.isKeepAlive && removeKeepAliveName(item.name);
        item.meta?.iframeSrc && removeIFrame(item.name);

        return false;
      });
    };

    /**
     * 关闭右侧 tab
     */
    const removeRightTab = async (tab: TabProps) => {
      const index = findTabIndex(tab.path);
      if (index === -1) return;

      tabNavList.value = tabNavList.value.filter((item, i) => {
        if (i <= index || item.meta?.isAffix) return true;
        item.meta?.isKeepAlive && removeKeepAliveName(item.name);
        item.meta?.iframeSrc && removeIFrame(item.name);

        return false;
      });
    };

    /**
     * 关闭其他 tab
     */
    const removeOtherTabs = async (tab: TabProps) => {
      tabNavList.value = tabNavList.value.filter(v => !v.close || v.path === tab.path);

      if (tab.meta.isKeepAlive) setKeepAliveName([tab.name]);
      else setKeepAliveName([]);

      if (tab.meta.iframeSrc) setIFame(iframeList.value.filter(v => v.name === tab.name));
    };

    /**
     * 关闭所有 tab
     */
    const removeAllTabs = async () => {
      const fixedTabs = tabNavList.value.filter(tab => !tab.close);
      tabNavList.value = fixedTabs;
      setKeepAliveName([]);
      setIFame([]);
    };

    /**
     * 添加指定的路由缓存
     */
    const addKeepAliveName = async (name: string) => {
      !keepAliveName.value.includes(name) && keepAliveName.value.push(name);
    };

    /**
     * 删除指定的路由缓存
     */
    const removeKeepAliveName = async (name: string) => {
      keepAliveName.value = keepAliveName.value.filter(item => item !== name);
    };

    /**
     * 设置指定的路由缓存
     */
    const setKeepAliveName = async (keepAliveNameList: string[] = []) => {
      keepAliveName.value = keepAliveNameList;
    };

    /**
     * 添加 IFrame 缓存
     */
    const addIFrame = (iframe: IFrame) => {
      const isExist = iframeList.value.findIndex(item => item.name === iframe.name) > -1;
      !isExist && iframeList.value.push(iframe);
    };

    /**
     * 删除指定的 IFrame
     */
    const removeIFrame = (name: string) => {
      const index = iframeList.value.findIndex(item => item.name === name);
      if (index === -1) return;

      iframeList.value.splice(index, 1);
    };

    /**
     * 设置 IFrame 缓存
     */
    const setIFame = (iFameList: IFrame[] = []) => {
      iframeList.value = iFameList;
    };

    watch(
      () => tabNav.value.persistence,
      newValue => handleRecordTabNav(newValue)
    );

    watch(
      () => tabNavList.value,
      () => handleRecordTabNav(tabNav.value.persistence),
      { deep: true }
    );

    const handleRecordTabNav = (needRecord: boolean) => {
      if (needRecord) cacheOperator.setCacheTabNavList(tabNavList.value);
      else cacheOperator.removeCacheTabNavList();
    };

    return {
      tabNavList,
      keepAliveName,
      language,
      iframeList,

      getTab,
      addTab,
      updateTab,
      toggleClose,
      removeTab,
      removeBatchTab,
      removeLeftTab,
      removeRightTab,
      removeOtherTabs,
      removeAllTabs,
      addKeepAliveName,
      removeKeepAliveName,
      setKeepAliveName,
      addIFrame,
      removeIFrame,
    };
  },
  {
    persist: {
      pick: ["language", "device"],
    },
  }
);
