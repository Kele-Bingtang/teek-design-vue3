export interface TooltipProps {
  /** 多少行文字溢出开始省略并气泡提示，默认 1 行 */
  line?: number;
  /** 是否实时的判断文字是否溢出（适用于元素默认隐藏，需要鼠标悬停触发的场景），默认 false */
  realTime?: boolean;
  /** 最大尝试判断次数（适用于元素默认隐藏，需要鼠标悬停触发的场景），仅当 realTime = false 时生效，默认 3 次 */
  maxTry?: number;
}
