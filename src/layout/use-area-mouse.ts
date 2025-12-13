import type { WatchStopHandle } from "vue";
import { useMouse, useScroll } from "@vueuse/core";
import { useSettingStore } from "@/pinia";
import { HeaderShowModeEnum, MenuShowModeEnum } from "@/common/enums";
import { UpdateInMenuAreaStateKey } from "@/common/config";
import { addUnit } from "@/common/utils";

/**
 * 监听鼠标是否在菜单区域
 */
export const useMenuAreaMouse = (offset = 0) => {
  const inMenuArea = ref(true);

  let menuStopWatcher: WatchStopHandle | null = null;

  const settingStore = useSettingStore();
  const { x: mouseX } = useMouse();

  const { menu } = storeToRefs(settingStore);

  // 支持子组件手动设置菜单区域状态（菜单折叠触发器组件用到）
  provide(UpdateInMenuAreaStateKey, (state?: boolean) => (inMenuArea.value = state ?? !inMenuArea.value));

  // 侧边栏（菜单）样式
  const asideStyle = computed(() => {
    const { enabled, showMode, showModeAutoFixed, collapseWidth } = menu.value;

    if (!enabled) return {};

    // 开启固定菜单栏生效样式
    const defaultStyle = showModeAutoFixed ? { position: "fixed", left: 0, zIndex: 99 } : {};

    // 菜单显示模式的样式创建工厂
    const styleCreateFactory = {
      [MenuShowModeEnum.Static]: {
        active: () => ({}),
        inactive: () => ({}),
      },
      // 自动折叠模式，需要移入区域打开菜单，移出区域收起菜单
      [MenuShowModeEnum.AutoCollapse]: {
        active: () => {
          settingStore.expandSideMenu();
          return { ...defaultStyle };
        },
        inactive: () => {
          settingStore.collapseSideMenu();
          return { ...defaultStyle, width: addUnit(collapseWidth) };
        },
      },
      // 折叠隐藏模式，根据是否在菜单区域内决定宽度
      [MenuShowModeEnum.AutoHidden]: {
        active: () => ({ ...defaultStyle }),
        inactive: () => ({ ...defaultStyle, width: 0 }),
      },
    };

    const key = inMenuArea.value ? "active" : "inactive";

    return styleCreateFactory[showMode][key]?.() ?? {};
  });

  // 非侧边栏（右侧内容区）样式
  const rightContentStyle = computed(() => {
    const { enabled, showMode, showModeAutoFixed, collapseWidth } = menu.value;

    if (!enabled) return {};

    // 如果开启固定菜单栏，且是折叠模式，则右侧内容区样式需要 marginLeft 折叠菜单的宽度
    return showModeAutoFixed && showMode === MenuShowModeEnum.AutoCollapse
      ? { marginLeft: addUnit(collapseWidth) }
      : {};
  });

  /**
   * 开启菜单区域鼠标移入移出监听
   */
  const start = () => {
    menuStopWatcher = watch(mouseX, newVal => {
      const { width, collapsed, collapseWidth, showMode } = menu.value;
      let targetWidth = collapsed ? collapseWidth : width;

      // 如果是自动隐藏模式且当前菜单是折叠状态，则鼠标移到左侧 20px 触发菜单展开
      if (showMode === MenuShowModeEnum.AutoHidden && !inMenuArea.value) {
        if (collapsed) targetWidth = collapseWidth / 4;
        else targetWidth = width / 4;
      }

      // 避免鼠标移到菜单外时菜单直接收起，这里添加 30 阈值，整合可以移到折叠菜单触发器位置
      if (newVal > targetWidth + 30 + offset) inMenuArea.value = false;
      else inMenuArea.value = true;
    });
  };

  /**
   * 关闭菜单区域鼠标移入移出监听
   */
  const stop = () => {
    menuStopWatcher?.();
    inMenuArea.value = true;
  };

  watch(
    () => menu.value.showMode,
    newVal => {
      // 切换菜单显示模式立即取消之前的监听，然后根据新的菜单显示模式选择是否开启
      stop();
      if (newVal !== MenuShowModeEnum.Static) start();
    },
    { immediate: true }
  );

  onScopeDispose(() => {
    stop();
  });

  return { inMenuArea: readonly(inMenuArea), asideStyle, rightContentStyle, start, stop };
};

/**
 * 监听鼠标是否在顶栏区域
 */
export const useHeaderAreaMouse = () => {
  const inHeaderArea = ref(true);
  // 内容区元素（支持滚动的元素）
  const pageContentDom = ref<HTMLElement | null>(null);

  let headerStopWatcher: WatchStopHandle | null = null;

  const settingStore = useSettingStore();
  const { y: mouseY } = useMouse();
  const { arrivedState, directions, isScrolling, y: scrollY } = useScroll(pageContentDom);

  const { header, tabNav } = storeToRefs(settingStore);

  // 计算顶栏高度 = Header 高度 + 标签栏高度
  const topStyle = computed(() => {
    if (inHeaderArea.value) {
      let headerHeight = 0;
      let tabNavHeight = 0;
      if (header.value.enabled) headerHeight = header.value.height;
      if (tabNav.value.enabled) tabNavHeight = tabNav.value.height;

      return { height: addUnit(headerHeight + tabNavHeight) };
    }
    return { height: 0 };
  });

  // 计算 Header 高度或标签栏高度
  const heightStyle = computed(() => {
    // inHeaderArea 为 true 时不需要返回实际的高度，因为 class 对应的样式里已经默设置了
    return inHeaderArea.value ? {} : { height: 0, minHeight: 0 };
  });

  const staticClass = computed(() => {
    if (header.value.showMode === HeaderShowModeEnum.Static) return "header-static";
    return "";
  });

  /**
   * 开启顶栏区域鼠标移入移出监听
   */
  const start = () => {
    // 自动隐藏模式
    if (header.value.showMode === HeaderShowModeEnum.AutoHidden) {
      headerStopWatcher = watch(mouseY, newValue => {
        const topHeight = header.value.height + tabNav.value.height;

        // 鼠标移出顶栏，则顶栏区域状态为 false
        if (newValue > topHeight) inHeaderArea.value = false;
        else inHeaderArea.value = true;
      });
      return;
    }

    // 滚动隐藏模式
    if (header.value.showMode === HeaderShowModeEnum.ScrollHidden) {
      // 初始化滚动的元素
      nextTick(() => {
        if (!pageContentDom.value) pageContentDom.value = document.querySelector(".page-content");
      });

      headerStopWatcher = watch(scrollY, newValue => {
        if (!isScrolling.value) return;
        const topHeight = header.value.height + tabNav.value.height;

        // 如果滚动条高度小于顶栏高度、处于顶栏、向上滚动，则认为为激活顶栏区域状态
        if (newValue < topHeight || arrivedState.top) inHeaderArea.value = true;
        if (directions.top) inHeaderArea.value = true;
        // 向下滚动则认为非顶栏区域状态
        else if (directions.bottom) inHeaderArea.value = false;
      });
    }
  };

  /**
   * 关闭顶栏区域鼠标移入移出监听
   */
  const stop = () => {
    headerStopWatcher?.();
    inHeaderArea.value = true;
    // 移出滚动的元素从而取消监听功能
    pageContentDom.value = null;
  };

  watch(
    () => header.value.showMode,
    newVal => {
      // 切换顶栏显示模式立即取消之前的监听，然后根据新的顶栏显示模式选择是否开启
      stop();
      if (![HeaderShowModeEnum.Static, HeaderShowModeEnum.Fixed].includes(newVal)) start();
    },
    { immediate: true }
  );

  onScopeDispose(() => {
    stop();
  });

  return {
    inHeaderArea: readonly(inHeaderArea),
    topStyle,
    heightStyle,
    staticClass,
    start,
    stop,
  };
};
