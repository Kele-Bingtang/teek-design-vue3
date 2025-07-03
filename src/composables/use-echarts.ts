import type * as echarts from "echarts";
import { onActivated, onBeforeUnmount, onDeactivated } from "vue";
import { useDebounceFn } from "@vueuse/core";

/**
 * 使用 Echarts(只是为了添加图表响应式)
 * @param myChart Echarts实 例(必传)
 * @param options 绘制 Echarts 的参数(必传)
 * */
export const useEcharts = (myChart: echarts.ECharts, options: echarts.EChartsCoreOption) => {
  if (options && typeof options === "object") {
    myChart.setOption(options);
  }
  const echartsResize = useDebounceFn(() => {
    myChart && myChart.resize();
  }, 100);

  window.addEventListener("resize", echartsResize);

  onBeforeUnmount(() => {
    window.removeEventListener("resize", echartsResize);
    myChart.dispose();
  });

  onActivated(() => {
    window.addEventListener("resize", echartsResize);
  });

  onDeactivated(() => {
    window.removeEventListener("resize", echartsResize);
    myChart.dispose();
  });
};
