import type Grid from "./index.vue";

export type BreakPoint = "xs" | "sm" | "md" | "lg" | "xl";

export type Responsive = {
  /**
   * 偏移量
   *
   * @default 1
   */
  span?: number;
  /**
   * 占位量
   *
   * @default 0
   */
  offset?: number;
};

export interface GridProps {
  /**
   * 响应式布局
   *
   * @default '{ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }'
   */
  cols?: number | Record<BreakPoint, number>;
  /**
   * 是否开启折叠功能
   *
   * @default false
   */
  collapse?: boolean;
  /**
   * 可见的行数
   *
   * @default 1
   */
  showRow?: number;
  /**
   * 行和列间距
   *
   * @default 0
   */
  gap?: [number, number] | number;
}

export interface GridItemProps {
  /**
   * 偏移量
   *
   * @default 0
   */
  offset?: number;
  /**
   * 占位量
   *
   * @default 1
   */
  span?: number;
  /**
   * 是否使用最后的元素
   *
   * @default false
   */
  suffix?: boolean;
  /**
   * 宽度小于 768px 时的 span
   */
  xs?: Responsive;
  /**
   * 宽度小于 768px 大于 992px 时的 span
   */
  sm?: Responsive;
  /**
   * 宽度小于 992px 大于 1200px 时的 span
   */
  md?: Responsive;
  /**
   * 宽度小于 1200px 大于 1920px 时的 span
   */
  lg?: Responsive;
  /**
   * 宽度大于 1920px 时的 span
   */
  xl?: Responsive;
  /**
   * 是否开启折叠动画
   *
   * @default false
   */
  collapseTransition?: boolean;
  /**
   * 折叠动画持续时长(单位：ms)
   *
   * @default 300
   */
  collapseDuration?: number;
}

export type GridInstance = InstanceType<typeof Grid>;
