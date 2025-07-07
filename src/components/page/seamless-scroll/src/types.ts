export interface ClassOption {
  /** ref key */
  key?: number;
  /** 步长 */
  step?: number;
  /** 启动无缝滚动最小数据数 */
  limitMoveNum?: number;
  /** 是否启用鼠标hover控制 */
  hoverStop?: boolean;
  /** bottom 往下 top 往上(默认) left 向左 right 向右 */
  direction?: string;
  /** 开启移动端 touch */
  openTouch?: boolean;
  /** 单条数据高度有值 hoverStop 关闭 */
  singleHeight?: number;
  /** 单条数据宽度有值 hoverStop 关闭 */
  singleWidth?: number;
  /** 单步停止等待时间 */
  waitTime?: number;
  /** 偏移量 */
  switchOffset?: number;
  /** 是否自动播放 */
  autoPlay?: boolean;
  /** 是否暂停播放 */
  navigation?: boolean;
  /** 单步距离 */
  switchSingleStep?: number;
  /** 切换模式延迟 */
  switchDelay?: number;
  /** 滚动元素的 class */
  switchDisabledClass?: string;
  /** singleWidth/singleHeight 是否开启 rem 度量 */
  isSingleRemUnit?: boolean;
}

export interface SeamlessScrollProps {
  /** 数据 */
  data: Recordable[];
  /** 配置 */
  classOption: ClassOption;
}

export interface SeamlessScrollEmits {
  /** 滚动结束事件 */
  scrollEnd: [];
}
