import type { TabProps } from "@/pinia";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { ref, reactive, nextTick, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Sortable from "sortablejs";
import { getUrlParams, isFunction } from "@/common/utils";
import { serviceConfig, HOME_URL } from "@/common/config";
import { useCommon, useMittBus } from "@/composables";
import beforeClose from "@/router/before-close";
import { formatTitle } from "@/router/helper";
import { useLayoutStore, useRouteStore } from "@/pinia";

type ContextMenu = "refresh" | "current" | "left" | "right" | "other" | "all";

// 右键菜单条件
export interface ContextMenuCondition {
  /** 是否允许刷新当前标签页 */
  refresh: boolean;
  /** 是否允许关闭当前标签页 */
  current: boolean;
  /** 是否允许关闭当左侧标签页 */
  left: boolean;
  /** 是否允许关闭右侧标签页 */
  right: boolean;
  /** 是否允许关闭其他标签页 */
  other: boolean;
  /** 是否允许关闭全部标签页 */
  all: boolean;
}

// 默认标签
export const defaultTab: TabProps = {
  path: "", // 路由的 path
  name: "", // 路由的 name
  title: "", // 展示的描述
  icon: "", // 图标
  close: true, // 是否允许关闭
  meta: {}, // 路由 meta 信息
};

/**
 * 标签栏管理
 */
export const useTabNav = () => {
  const route = useRoute();
  const router = useRouter();
  const layoutStore = useLayoutStore();
  const routeStore = useRouteStore();
  const rightMenuVisible = ref(false);

  // 右键激活的 tab
  const rightMenuActiveTab = ref<TabProps>(defaultTab);

  // 菜单功能状态
  const contextMenuCondition = reactive<ContextMenuCondition>({
    refresh: false,
    current: false,
    left: false,
    right: false,
    other: false,
    all: false,
  });

  // 右键菜单位置（动态计算）
  const rightMenuLeft = ref(0);
  const rightMenuTop = ref(0);

  // 当前激活的 tab
  const activeTab = computed(() => getTabByPath(route.meta._fullPath || route.path) || defaultTab);

  const { tabNavList } = storeToRefs(layoutStore);

  const { isMobile, refreshPage } = useCommon();
  const { refreshIFrame } = useMittBus();

  /**
   * 标签栏拖拽排序
   *
   * @param rootClassName 根元素类名
   * @param dragClassName 拖拽元素类名
   */
  const tabsDragSort = (rootClassName: string, dragClassName: string) => {
    // 移动端不支持拖拽
    if (isMobile.value) return;
    const tabDom = document.querySelector(rootClassName) as HTMLElement;

    if (!tabDom) return;

    Sortable.create(tabDom, {
      draggable: dragClassName,
      animation: 300,
      onEnd({ newIndex, oldIndex }) {
        const tabsList = [...tabNavList.value];
        const currRow = tabsList.splice(oldIndex as number, 1)[0];

        tabsList.splice(newIndex as number, 0, currRow);
        // 在 store 更新标签栏数据
        layoutStore.$patch({ tabNavList: tabsList });
      },
    });
  };

  /**
   * 判断当前 tab 是否激活
   */
  const isActive = (tab: TabProps) => {
    const fullPath = getRouteFullPath(route);
    return [tab.path, tab.path + "/"].includes(fullPath);
  };

  /**
   * 根据路径获取 tab
   */
  const getTabByPath = (path: string) => layoutStore.getTab(path);
  /**
   * 切换 tab 的关闭与未关闭状态，如果切换为未关闭，则移动到未关闭的 tab 列表末尾
   */
  const toggleFixed = (path: string) => layoutStore.toggleClose(path);
  /**
   * 根据 route 获取 tab
   */
  const createTabByRoute = (route: RouteLocationNormalizedLoaded) => {
    return {
      path: getRouteFullPath(route),
      name: (route.name as string) || route.path,
      title: formatTitle(route),
      icon: route.meta.icon || "",
      close: !route.meta.isAffix,
      meta: route.meta,
    };
  };

  /**
   * 获取 tab 的完整地址，因为携带不同的参数可以引起多个重复的标签，如果重复标签的参数 tabExcludesUrlKey 里只返回不带参数的 path，确保存储的标签唯一
   */
  const getRouteFullPath = (r: RouteLocationNormalizedLoaded) => {
    const fullPath = r.fullPath ?? r.meta._fullPath;
    if (r.path !== route.path || r.path === HOME_URL) return fullPath;

    const tabExcludesUrlKey = serviceConfig.cache.tabExcludesUrlKey;
    if (tabExcludesUrlKey.includes("*")) return fullPath;

    const urlParams = getUrlParams();
    if (urlParams.size) {
      // 如果存在 key=value，则判断是否完全匹配 key
      if ([...urlParams.keys()].some(key => tabExcludesUrlKey.includes(key))) {
        return r.meta._fullPath;
      }
    }

    return fullPath;
  };

  /**
   * 初始化固定在标签栏的 tabs
   */
  const initAffixTabs = () => {
    routeStore.flatRouteList.forEach(item => {
      if (item.meta.isAffix && !item.meta.isFull) {
        const tabParam = createTabByRoute(item as RouteLocationNormalizedLoaded);
        layoutStore.addTab(tabParam);
        item.meta.isKeepAlive && layoutStore.addKeepAliveName(item.name as string);
      }
    });
  };

  /**
   * 添加一个 tab
   */
  const addTabByRoute = () => {
    const tab = createTabByRoute(route);
    layoutStore.addTab(tab);

    if (route.name) route.meta.isKeepAlive && layoutStore.addKeepAliveName(route.name as string);
  };

  /**
   * 初始化标签页的右键菜单
   */
  const initContextMenu = (tab: TabProps) => {
    const tabNavListValue = tabNavList.value;
    const tabLength = tabNavListValue.length;
    const currentIndex = tabNavListValue.findIndex(t => t.path === tab.path);

    // 如果选择的是固定在标签栏的标签
    if (!tab.close) {
      if (currentIndex === 0) {
        // 如果只有一个固定标签，则判断右边是否有标签
        if (tabLength === 1) {
          multiMenuChange(["current", "left", "right", "other", "all"], false);
          multiMenuChange(["refresh"], true);
        } else {
          multiMenuChange(["all"], true);
          multiMenuChange(["current", "left", "right", "other"], false);
        }
      } else {
        // 如果左右都是固定的或者最后一个标签，则只显示刷新
        if (
          tabLength - 1 === currentIndex ||
          (!tabNavListValue[currentIndex - 1].close && !tabNavListValue[currentIndex + 1].close)
        ) {
          multiMenuChange(["current", "left", "right", "other", "all"], false);
          multiMenuChange(["refresh"], true);
        } else {
          multiMenuChange(["current", "left"], false);
          multiMenuChange(["refresh", "right", "other", "all"], true);
        }
      }
    } else {
      // 不是固定的标签
      if (currentIndex === 0) {
        // 如果是第一个标签页，且只有一个标签页
        multiMenuChange(["current", "left", "right", "other", "all"], false);
        multiMenuChange(["refresh"], true);
      } else if (currentIndex === 1 && tabLength === 2) {
        // 左侧的菜单是首页，右侧不存在别的菜单
        multiMenuChange(["right", "other"], false);
        multiMenuChange(["current", "all"], true);
        multiMenuChange(["left"], tabNavListValue[0].close);
      } else if (currentIndex === 1 && tabLength !== 2) {
        // 左侧的菜单是首页，右侧存在别的菜单
        multiMenuChange(["left"], tabNavListValue[0].close);
        multiMenuChange(["refresh", "current", "right", "other", "all"], true);
      } else if (tabLength - 1 === currentIndex && currentIndex !== 0) {
        // 当前 tab 是所有 tab 中的最后一个
        multiMenuChange(["right"], false);
        multiMenuChange(["refresh", "current", "left", "other", "all"], true);
      } else multiMenuChange(["refresh", "current", "left", "right", "other", "all"], true);
    }

    // 如果没有选择当前的标签，则不允许刷新
    if (tab.path !== route.fullPath && currentIndex !== 0) contextMenuCondition.refresh = false;
    else contextMenuCondition.refresh = true;
  };

  const multiMenuChange = (menuList: Partial<ContextMenu>[], status: boolean) => {
    menuList.forEach(menu => {
      contextMenuCondition[menu] = status;
    });
  };

  /**
   * 打开右键菜单，并初始化菜单布局、内容
   */
  const openRightMenu = (e: MouseEvent, tab: TabProps, tabNavRef: HTMLElement | null) => {
    initContextMenu(tab);

    const menuMinWidth = 0;
    const offsetLeft = tabNavRef?.getBoundingClientRect().left || 0; // margin-left 的数值
    const offsetWidth = tabNavRef?.offsetWidth || 0; //  width 数值
    const maxLeft = offsetWidth - menuMinWidth;
    const left = e.clientX - offsetLeft + 14;

    if (left > maxLeft) rightMenuLeft.value = maxLeft;
    else rightMenuLeft.value = left;

    rightMenuTop.value = e.offsetY + 12;
    rightMenuVisible.value = true;
    rightMenuActiveTab.value = tab;
  };

  /**
   * 关闭 tab，并尝试激活到上一个 tab
   */
  const closeTab = async (tab: TabProps) => {
    if (tab.meta.beforeClose && isFunction(tab.meta.beforeClose)) {
      const isClose = await tab.meta.beforeClose(route);

      if (isClose) closeSelectedTab(tab);
    } else if (tab.meta.beforeCloseName && tab.meta.beforeCloseName in beforeClose) {
      const isClose = await beforeClose[tab.meta.beforeCloseName](route);

      if (isClose) closeSelectedTab(tab);
    } else closeSelectedTab(tab);
  };

  /**
   * 关闭选择的 tab
   */
  const closeSelectedTab = (tab: TabProps) => {
    layoutStore.removeTab(tab.path);

    if (isActive(tab)) toLastTab();
  };

  /**
   * 刷新选中的 tab
   */
  const refreshSelectedTab = async (tab: TabProps) => {
    if (tab.meta?.iframeSrc) refreshIFrame();
    else {
      layoutStore.removeKeepAliveName(tab.name);

      refreshPage(false);
      await nextTick();

      layoutStore.addKeepAliveName(tab.name);
      refreshPage(true);
    }
  };

  /**
   * 关闭左侧的 tab
   */
  const closeLeftTab = async (tab: TabProps) => {
    layoutStore.removeLeftTab(tab);
  };
  /**
   * 关闭右侧的 tab
   */
  const closeRightTab = async (tab: TabProps) => {
    layoutStore.removeRightTab(tab);

    if (route.path !== tab.path) router.push(tab.path).catch(err => console.warn(err));
  };

  /**
   * 关闭除当前选中 tab 的其他 tab
   */
  const closeOthersTabs = (tab: TabProps) => {
    layoutStore.removeOtherTabs(tab);

    if (route.path !== tab.path) router.push(tab.path).catch(err => console.warn(err));
  };

  /**
   * 关闭除固定在 tabNav 的所有其他 tabs
   */
  const closeAllTabs = () => {
    layoutStore.removeAllTabs();
    toLastTab();
  };

  /**
   * 跳转到最后一个 tab
   */
  const toLastTab = () => {
    // 获取最后一个 tab 数据
    const lastTab = tabNavList.value.slice(-1)[0];
    const path = lastTab?.path || routeStore.homeRoute?.meta?._fullPath;
    path && router.push(path).catch(err => console.warn(err));
  };

  return {
    tabNavList,
    activeTab,
    rightMenuActiveTab,
    rightMenuVisible,
    contextMenuCondition,
    rightMenuLeft,
    rightMenuTop,

    isActive,
    tabsDragSort,
    initAffixTabs,
    getTabByPath,
    createTabByRoute,
    addTabByRoute,
    toggleFixed,
    getRouteFullPath,
    openRightMenu,
    initContextMenu,
    closeTab,
    closeSelectedTab,
    closeLeftTab,
    closeRightTab,
    refreshSelectedTab,
    closeOthersTabs,
    closeAllTabs,
  };
};
