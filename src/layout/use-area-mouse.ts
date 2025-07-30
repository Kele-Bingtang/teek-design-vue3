import type { WatchStopHandle } from "vue";
import { useMouse } from "@vueuse/core";
import { useSettingStore } from "@/pinia";
import { MenuShowModeEnum } from "@/common/enums";
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
    menuStopWatcher = watch(
      () => mouseX.value,
      newVal => {
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
      }
    );
  };

  /**
   * 关闭菜单区域鼠标移入移出监听
   */
  const stop = () => menuStopWatcher?.();

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

  let headerStopWatcher: WatchStopHandle | null = null;

  const settingStore = useSettingStore();
  const { y: mouseY } = useMouse();

  const { header, tabNav } = storeToRefs(settingStore);

  /**
   * 开启顶栏区域鼠标移入移出监听
   */
  const start = () => {
    headerStopWatcher = watch(
      () => mouseY.value,
      newValue => {
        if (newValue > header.value.height + tabNav.value.height) inHeaderArea.value = false;
        else inHeaderArea.value = true;
      }
    );
  };

  /**
   * 关闭顶栏区域鼠标移入移出监听
   */
  const stop = () => headerStopWatcher?.();

  return { inHeaderArea: readonly(inHeaderArea), start, stop };
};
