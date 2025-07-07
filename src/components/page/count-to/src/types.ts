import type CountUp from "countup";

export interface CountToProps {
  /** 初始值，后面会被 startVal 覆盖 */
  init?: number;
  /** 起始值，即动画开始前显示的数值 */
  startVal?: number;
  /** 结束值，即动画结束后显示的数值 */
  endVal: number;
  /** 数值的前缀 */
  prefix?: string;
  /** 数值的后缀 */
  suffix?: string;
  /** 保留几位小数 */
  decimals?: number;
  /** 分隔整数和小数的符号，默认是小数点 */
  decimal?: string;
  /** 动画持续的时间，单位是秒 */
  duration?: number;
  /** 动画延迟开始的时间，单位是秒 */
  delay?: number;
  /** 是否自动播放 */
  autoplay?: boolean;
  /** 是否使用 easing 动画效果 */
  useEasing?: boolean;
  /** 是否使用分组，分组后每三位会用一个符号分隔，即 1000 位 1,000 */
  useGroup?: boolean;
  /** 用于分组（useGroup）的符号 */
  separator?: string;
  /** 是否简化显示，设为 true 后会使用 unit 单位来做相关省略 */
  simplify?: boolean;
  /** 自定义单位，如 { value: 3, label: "K+" }, { value: 6, label: "M+" } 即大于 3 位数小于 6 位数的用 k+ 来做省略 1000 即显示为 1K+ */
  unit?: Unit[];
  /** count 数字的 class */
  countClass?: string;
  /** 单位的 class */
  unitClass?: string;
  /** 循环次数 */
  loop?: number;
}

interface Unit {
  value: number;
  label: string;
}

export interface CountToEmits {
  init: [counter: CountUp];
  finished: [];
}
