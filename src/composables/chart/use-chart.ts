import type { ShallowRef, MaybeRef } from "vue";
import type { EChartsOption } from "echarts";
import type { ChartThemeConfig, UseChartOptions } from "@/components/chart/types";
import { useTemplateRef, shallowRef, watch, nextTick, onMounted, onBeforeUnmount, onUnmounted, unref } from "vue";
import { storeToRefs } from "pinia";
import * as echarts from "echarts";
import { getCssVar } from "@/common/utils";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/pinia";

// 图表默认配置
export const useChartOps = (): ChartThemeConfig => {
  const ns = useNamespace();

  return {
    /** 高度 */
    chartHeight: "16rem",
    /** 字体大小 */
    fontSize: 13,
    /** 字体颜色 */
    fontColor: "#999",
    /** 主题颜色 */
    themeColor: getCssVar(ns.cssVarNameEl("color-primary-light-1")),
    /** 颜色组 */
    colors: [
      getCssVar(ns.cssVarNameEl("color-primary-light-1")),
      "#4ABEFF",
      "#EDF2FF",
      "#14DEBA",
      "#FFAF20",
      "#FA8A6C",
      "#FFAF20",
    ],
  };
};

// 常量定义
const RESIZE_DELAYS = [50, 100, 200, 350] as const;
const LAYOUT_RESIZE_DELAYS = [50, 100, 200] as const;
const RESIZE_DEBOUNCE_DELAY = 100;

export function useChart(options: UseChartOptions = {}) {
  const { initOptions, initDelay = 0, threshold = 0.1, autoTheme = true, instanceName = "chartInstance" } = options;

  const settingStore = useSettingStore();
  const { isDark, menu, theme } = storeToRefs(settingStore);

  const chartInstance = useTemplateRef<HTMLElement>(instanceName);
  const chart = shallowRef<echarts.ECharts | null>(null);
  let pendingOptions: EChartsOption | null = null;
  let isDestroyed = false;

  const {
    getAxisLineStyle,
    getSplitLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getAnimationConfig,
    getTooltipStyle,
    getLegendStyle,
    getGridWithLegend,
  } = useChartStyleFn();
  const { handleResize, clearTimers, requestAnimationResize, debouncedResize, multiDelayResize } =
    useChartResize(chart);

  const { createIntersectionObserver, cleanIntersectionObserver } = useIntersectionObserver(
    chartInstance,
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isDestroyed && pendingOptions) {
          // 使用 requestAnimationFrame 确保在下一帧初始化图表
          requestAnimationFrame(() => {
            if (!isDestroyed && pendingOptions) {
              try {
                // 元素变为可见，初始化图表
                if (!chart.value) chart.value = echarts.init(entry.target as HTMLElement);

                // 触发自定义事件，让组件处理动画逻辑
                const event = new CustomEvent("chartVisible", {
                  detail: { options: pendingOptions },
                });
                entry.target.dispatchEvent(event);

                pendingOptions = null;
                cleanIntersectionObserver();
              } catch (error) {
                console.error("图表初始化失败:", error);
              }
            }
          });
        }
      });
    },
    threshold
  );

  // 收缩菜单时，重新计算图表大小
  watch(
    () => menu.value.collapsed,
    () => multiDelayResize(RESIZE_DELAYS)
  );

  // 布局变化触发或主题色变化触发图表重新渲染
  watch(
    () => theme.value.primaryColor,
    () => {
      nextTick(requestAnimationResize);
      setTimeout(() => multiDelayResize(LAYOUT_RESIZE_DELAYS), 0);
    }
  );

  // 主题变化时重新设置图表选项
  if (autoTheme) {
    watch(isDark, () => {
      if (chart.value) {
        // 使用 requestAnimationFrame 优化主题更新
        requestAnimationFrame(() => {
          if (chart.value) {
            const currentOptions = chart.value.getOption();
            if (currentOptions) updateChart(currentOptions as EChartsOption);
          }
        });
      }
    });
  }

  // 检查容器是否可见
  const isContainerVisible = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
  };

  // 图表初始化核心逻辑
  const performChartInit = (options: EChartsOption) => {
    if (!chart.value && chartInstance.value && !isDestroyed) chart.value = echarts.init(chartInstance.value);
    if (chart.value && !isDestroyed) {
      chart.value.setOption(options);
      pendingOptions = null;
    }
  };

  // 初始化图表
  const initChart = (options: EChartsOption = {}) => {
    if (!chartInstance.value || isDestroyed) return;

    const mergedOptions = { ...initOptions, ...options };

    try {
      if (isContainerVisible(chartInstance.value)) {
        // 容器可见，正常初始化
        if (initDelay > 0) {
          setTimeout(() => performChartInit(mergedOptions), initDelay);
        } else {
          performChartInit(mergedOptions);
        }
      } else {
        // 容器不可见，保存选项并设置监听器
        pendingOptions = mergedOptions;
        createIntersectionObserver();
      }
    } catch (error) {
      console.error("图表初始化失败:", error);
    }
  };

  // 更新图表
  const updateChart = (options: EChartsOption) => {
    if (!chart.value) return;

    try {
      if (!chart.value) {
        // 如果图表不存在，先初始化
        initChart(options);
        return;
      }
      chart.value.setOption(options);
    } catch (error) {
      console.error("图表更新失败:", error);
    }
  };

  // 销毁图表
  const destroyChart = () => {
    isDestroyed = true;

    if (chart.value) {
      try {
        chart.value.dispose();
      } catch (error) {
        console.error("图表销毁失败:", error);
      } finally {
        chart.value = null;
      }
    }

    clearTimers();
    cleanIntersectionObserver();
    pendingOptions = null;
  };

  // 获取图表实例
  const getChartInstance = () => chart;

  // 获取图表是否已初始化
  const isChartInitialized = () => chart !== null;

  onMounted(() => {
    window.addEventListener("resize", debouncedResize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", debouncedResize);
  });

  onUnmounted(() => {
    destroyChart();
  });

  return {
    isDark,
    chartInstance,
    initChart,
    updateChart,
    handleResize,
    destroyChart,
    getChartInstance,
    isChartInitialized,
    getAxisLineStyle,
    getSplitLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getAnimationConfig,
    getTooltipStyle,
    getLegendStyle,
    useChartOps,
    getGridWithLegend,
  };
}

export const useChartResize = (chart: ShallowRef<echarts.ECharts | null>) => {
  let resizeTimeoutId: number | null = null;
  let resizeFrameId: number | null = null;

  // 处理窗口大小变化
  const handleResize = () => {
    if (chart?.value) {
      try {
        chart.value.resize();
      } catch (error) {
        console.error("图表resize失败:", error);
      }
    }
  };

  // 清理定时器的统一方法
  const clearTimers = () => {
    if (resizeTimeoutId) {
      clearTimeout(resizeTimeoutId);
      resizeTimeoutId = null;
    }
    if (resizeFrameId) {
      cancelAnimationFrame(resizeFrameId);
      resizeFrameId = null;
    }
  };

  // 使用 requestAnimationFrame 优化 resize 处理
  const requestAnimationResize = () => {
    if (resizeFrameId) {
      cancelAnimationFrame(resizeFrameId);
    }
    resizeFrameId = requestAnimationFrame(() => {
      handleResize();
      resizeFrameId = null;
    });
  };

  // 防抖的 resize 处理（用于窗口 resize 事件）
  const debouncedResize = () => {
    if (resizeTimeoutId) {
      clearTimeout(resizeTimeoutId);
    }
    resizeTimeoutId = window.setTimeout(() => {
      requestAnimationResize();
      resizeTimeoutId = null;
    }, RESIZE_DEBOUNCE_DELAY);
  };

  // 多延迟 resize 处理 - 统一方法
  const multiDelayResize = (delays: readonly number[]) => {
    // 立即调用一次，快速响应
    nextTick(requestAnimationResize);

    // 使用延迟时间，确保图表正确适应变化
    delays.forEach(delay => {
      setTimeout(requestAnimationResize, delay);
    });
  };

  return { clearTimers, handleResize, requestAnimationResize, debouncedResize, multiDelayResize };
};

/**
 * 获取 Chart 的默认样式
 */
export const useChartStyleFn = () => {
  const settingStore = useSettingStore();
  const { isDark } = storeToRefs(settingStore);

  // 样式生成器 - 统一的样式配置
  const createLineStyle = (color: string, width = 1, type?: "solid" | "dashed") => ({
    color,
    width,
    ...(type && { type }),
  });

  // 坐标轴线样式
  const getAxisLineStyle = (show: boolean = true) => ({
    show,
    lineStyle: createLineStyle(isDark.value ? "#444" : "#EDEDED"),
  });

  // 分割线样式
  const getSplitLineStyle = (show: boolean = true) => ({
    show,
    lineStyle: createLineStyle(isDark.value ? "#444" : "#EDEDED", 1, "dashed"),
  });

  // 坐标轴标签样式
  const getAxisLabelStyle = (show: boolean = true) => {
    const { fontColor, fontSize } = useChartOps();
    return {
      show,
      color: fontColor,
      fontSize,
    };
  };

  // 坐标轴刻度样式
  const getAxisTickStyle = () => ({
    show: false,
  });

  // 获取动画配置
  const getAnimationConfig = (animationDelay: number = 50, animationDuration: number = 1500) => ({
    animationDelay: (idx: number) => idx * animationDelay + 200,
    animationDuration: (idx: number) => animationDuration - idx * 50,
    animationEasing: "quarticOut" as const,
  });

  // 获取统一的 tooltip 配置
  const getTooltipStyle = (trigger: "item" | "axis" = "axis", customOptions: any = {}) => ({
    trigger,
    backgroundColor: isDark.value ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
    borderColor: isDark.value ? "#333" : "#ddd",
    borderWidth: 1,
    textStyle: {
      color: isDark.value ? "#fff" : "#333",
    },
    ...customOptions,
  });

  // 获取统一的图例配置
  const getLegendStyle = (position: "bottom" | "top" | "left" | "right" = "bottom", customOptions: any = {}) => {
    const baseConfig = {
      textStyle: { color: isDark.value ? "#fff" : "#333" },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 20,
      ...customOptions,
    };

    // 根据位置设置不同的配置
    switch (position) {
      case "bottom":
        return { ...baseConfig, bottom: 0, left: "center", orient: "horizontal", icon: "roundRect" };
      case "top":
        return { ...baseConfig, top: 0, left: "center", orient: "horizontal", icon: "roundRect" };
      case "left":
        return { ...baseConfig, left: 0, top: "center", orient: "vertical", icon: "roundRect" };
      case "right":
        return { ...baseConfig, right: 0, top: "center", orient: "vertical", icon: "roundRect" };
      default:
        return baseConfig;
    }
  };

  // 根据图例位置计算 grid 配置
  const getGridWithLegend = (
    showLegend: boolean,
    legendPosition: "bottom" | "top" | "left" | "right" = "bottom",
    baseGrid: any = {}
  ) => {
    const defaultGrid = { top: 15, right: 15, bottom: 8, left: 0, containLabel: true, ...baseGrid };

    if (!showLegend) return defaultGrid;

    // 根据图例位置调整 grid
    switch (legendPosition) {
      case "bottom":
        return { ...defaultGrid, bottom: 40 };
      case "top":
        return { ...defaultGrid, top: 40 };
      case "left":
        return { ...defaultGrid, left: 120 };
      case "right":
        return { ...defaultGrid, right: 120 };
      default:
        return defaultGrid;
    }
  };

  return {
    getAxisLineStyle,
    getSplitLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getAnimationConfig,
    getTooltipStyle,
    getLegendStyle,
    getGridWithLegend,
  };
};

/**
 * 使用 IntersectionObserver 监听元素是否可见
 */
export const useIntersectionObserver = (
  observerDom: MaybeRef<HTMLElement | null>,
  callback: (entries: IntersectionObserverEntry[]) => void,
  threshold: number
) => {
  let intersectionObserver: IntersectionObserver | null = null;

  // 创建 IntersectionObserver
  const createIntersectionObserver = () => {
    const observerDomValue = unref(observerDom);
    if (intersectionObserver || !observerDomValue) return;

    intersectionObserver = new IntersectionObserver(callback, { threshold });
    intersectionObserver.observe(observerDomValue);
  };

  // 清理 IntersectionObserver
  const cleanIntersectionObserver = () => {
    if (intersectionObserver) {
      intersectionObserver.disconnect();
      intersectionObserver = null;
    }
  };

  return { createIntersectionObserver, cleanIntersectionObserver };
};
