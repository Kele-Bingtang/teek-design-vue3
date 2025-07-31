<script setup lang="ts">
import type { CSSProperties } from "vue";
import type { SeamlessScrollEmits, SeamlessScrollProps } from "./types";
import { computed, nextTick, ref } from "vue";
import { tryOnMounted, tryOnUnmounted, templateRef, useDebounceFn } from "@vueuse/core";
import * as utilsMethods from "./utils";

defineOptions({ name: "SeamlessScroll" });

const { animationFrame } = utilsMethods;
animationFrame();

const props = defineProps<SeamlessScrollProps>();

const emits = defineEmits<SeamlessScrollEmits>();

const xPos = ref<number>(0);
const yPos = ref<number>(0);
const delay = ref<number>(0);
const height = ref<number>(0);
// 外容器宽度
const width = ref<number>(0);
// 内容实际宽度
const realBoxWidth = ref<number>(0);
const realBoxHeight = ref<number>(0);
const copyHtml = ref("");
// single 单步滚动的定时器
let singleWaitTime: NodeJS.Timeout | null = null;
// move 动画的 animationFrame 定时器
let reqFrame = -1;
let startPos = { x: 0, y: 0 };
// 记录 touchStart 时候的 posY
let startPosY = -1;
// 记录 touchStart 时候的 posX
let startPosX = -1;
// mouseenter mouseleave 控制 scrollMove() 的开关
let isHover = false;
let ease = "ease-in";

const { classOption } = props;

if (classOption["key"] === undefined) {
  classOption["key"] = 0;
}

const wrap = templateRef<HTMLElement | null>(`wrap${classOption["key"]}`, null);
const slotList = templateRef<HTMLElement | null>(`slotList${classOption["key"]}`, null);
const realBox = templateRef<HTMLElement | null>(`realBox${classOption["key"]}`, null);

const leftSwitchState = computed(() => {
  return xPos.value < 0;
});

const rightSwitchState = computed(() => {
  return Math.abs(xPos.value) < realBoxWidth.value - width.value;
});

const defaultOption = computed(() => {
  return {
    // 步长
    step: 1,
    // 启动无缝滚动最小数据数
    limitMoveNum: 5,
    // 是否启用鼠标 hover 控制
    hoverStop: true,
    // bottom 往下 top 往上(默认) left 向左 right 向右
    direction: "top",
    // 开启移动端touch
    openTouch: true,
    // 单条数据高度有值 hoverStop 关闭
    singleHeight: 0,
    // 单条数据宽度有值 hoverStop 关闭
    singleWidth: 0,
    // 单步停止等待时间
    waitTime: 1000,
    // 偏移量
    switchOffset: 30,
    // 是否自动播放
    autoPlay: true,
    // 是否暂停播放
    navigation: false,
    // 单步距离
    switchSingleStep: 134,
    // 切换模式延迟
    switchDelay: 400,
    // 滚动元素的 class
    switchDisabledClass: "disabled",
    // singleWidth/singleHeight 是否开启 rem 度量
    isSingleRemUnit: false,
  };
});

const options = computed(() => {
  return Object.assign({}, defaultOption.value, classOption);
});

// 左侧切换按钮的 class
const leftSwitchClass = computed(() => {
  return leftSwitchState.value ? "" : options.value.switchDisabledClass;
});

// 右侧切换按钮的 class
const rightSwitchClass = computed(() => {
  return rightSwitchState.value ? "" : options.value.switchDisabledClass;
});

// 左侧切换按钮的样式
const leftSwitch = computed((): CSSProperties => {
  return {
    position: "absolute",
    margin: `${height.value / 2}px 0 0 -${options.value.switchOffset}px`,
    transform: "translate(-100%,-50%)",
  };
});

// 右侧切换按钮的样式
const rightSwitch = computed((): CSSProperties => {
  return {
    position: "absolute",
    margin: `${height.value / 2}px 0 0 ${width.value + options.value.switchOffset}px`,
    transform: "translateY(-50%)",
  };
});

// 是否水平滚动
const isHorizontal = computed(() => {
  return options.value.direction !== "bottom" && options.value.direction !== "top";
});

// 浮动样式
const float = computed((): CSSProperties => {
  return isHorizontal.value ? { float: "left", overflow: "hidden" } : { overflow: "hidden" };
});

// 位置样式
const pos = computed(() => {
  return {
    transform: `translate(${xPos.value}px,${yPos.value}px)`,
    transition: `all ${ease} ${delay.value}ms`,
    overflow: "hidden",
  };
});

// 是否暂停播放
const navigation = computed(() => {
  return options.value.navigation;
});

// 是否自动播放
const autoPlay = computed(() => {
  if (navigation.value) return false;
  return options.value.autoPlay;
});

// 是否可以滚动
const scrollSwitch = computed(() => {
  // 从 props 解构出来的 属性 不再具有响应性.
  return (props.data as any).length >= options.value.limitMoveNum;
});

// 是否启用鼠标 hover 控制
const hoverStopSwitch = computed(() => {
  return options.value.hoverStop && autoPlay.value && scrollSwitch.value;
});

// 是否启用移动端 touch
const canTouchScroll = computed(() => {
  return options.value.openTouch;
});

// 基础字体大小
const baseFontSize = computed(() => {
  return options.value.isSingleRemUnit ? parseInt(window.getComputedStyle(document.documentElement, null).fontSize) : 1;
});

// 实际单步滚动宽度
const realSingleStopWidth = computed(() => {
  return options.value.singleWidth * baseFontSize.value;
});

// 实际单步滚动高度
const realSingleStopHeight = computed(() => {
  return options.value.singleHeight * baseFontSize.value;
});

// 步长
const step = computed(() => {
  let singleStep;
  const step = options.value.step;
  if (isHorizontal.value) {
    singleStep = realSingleStopWidth.value;
  } else {
    singleStep = realSingleStopHeight.value;
  }
  if (singleStep > 0 && singleStep % step > 0) {
    throw Error("如果设置了单步滚动，step需是单步大小的约数，否则无法保证单步滚动结束的位置是否准确");
  }
  return step;
});

/**
 * 重置
 */
const reset = () => {
  xPos.value = 0;
  yPos.value = 0;
  scrollCancel();
  scrollInitMove();
};

/**
 * 左侧切换按钮点击
 */
const leftSwitchClick = () => {
  if (!leftSwitchState.value) return;
  // 小于单步距离
  if (Math.abs(xPos.value) < options.value.switchSingleStep) {
    xPos.value = 0;
    return;
  }
  xPos.value += options.value.switchSingleStep;
};

/**
 * 右侧切换按钮点击
 */
const rightSwitchClick = () => {
  if (!rightSwitchState.value) return;
  // 小于单步距离
  if (realBoxWidth.value - width.value + xPos.value < options.value.switchSingleStep) {
    xPos.value = width.value - realBoxWidth.value;
    return;
  }
  xPos.value -= options.value.switchSingleStep;
};

/**
 * 取消滚动
 */
const scrollCancel = () => {
  cancelAnimationFrame(reqFrame);
};

/**
 * 触摸开始
 */
const touchStart = (e: any) => {
  if (!canTouchScroll.value) return;
  let timer;
  // touches数组对象获得屏幕上所有的touch，取第一个touch
  const touch = e.targetTouches[0];
  const { waitTime, singleHeight, singleWidth } = options.value;
  // 取第一个touch的坐标值
  startPos = {
    x: touch.pageX,
    y: touch.pageY,
  };
  // 记录touchStart时候的posY
  startPosY = yPos.value;
  // 记录touchStart时候的posX
  startPosX = xPos.value;
  if (!!singleHeight && !!singleWidth) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      scrollCancel();
    }, waitTime + 20);
  } else {
    scrollCancel();
  }
};

/**
 * 触摸移动
 */
const touchMove = (e: any) => {
  // 当屏幕有多个touch或者页面被缩放过，就不执行move操作
  if (!canTouchScroll.value || e.targetTouches.length > 1 || (e.scale && e.scale !== 1)) return;
  const touch = e.targetTouches[0];
  const { direction } = options.value;
  const endPos = {
    x: touch.pageX - startPos.x,
    y: touch.pageY - startPos.y,
  };
  // 阻止触摸事件的默认行为，即阻止滚屏
  e.preventDefault();
  // dir，1表示纵向滑动，0为横向滑动
  const dir = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1 : 0;
  if ((dir === 1 && direction === "bottom") || (dir === 1 && direction === "top")) {
    // 表示纵向滑动 && 运动方向为上下
    yPos.value = startPosY + endPos.y;
  } else if ((dir === 0 && direction === "left") || (dir === 0 && direction === "right")) {
    // 为横向滑动 && 运动方向为左右
    xPos.value = startPosX + endPos.x;
  }
};

/**
 * 触摸结束
 */
const touchEnd = () => {
  if (!canTouchScroll.value) return;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const direction = options.value.direction;
  delay.value = 50;
  if (direction === "top") {
    if (yPos.value > 0) yPos.value = 0;
  } else if (direction === "bottom") {
    const h = (realBoxHeight.value / 2) * -1;
    if (yPos.value < h) yPos.value = h;
  } else if (direction === "left") {
    if (xPos.value > 0) xPos.value = 0;
  } else if (direction === "right") {
    const w = realBoxWidth.value * -1;
    if (xPos.value < w) xPos.value = w;
  }
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    delay.value = 0;
    scrollMove();
  }, delay.value);
};

/**
 * 鼠标进入
 */
const enter = () => {
  if (hoverStopSwitch.value) scrollStopMove();
};

/**
 * 鼠标离开
 */
const leave = () => {
  if (hoverStopSwitch.value) scrollStartMove();
};

/**
 * 滚动移动
 */
const scrollMove = () => {
  // 鼠标移入时拦截scrollMove()
  if (isHover) return;
  // 进入move立即先清除动画 防止频繁touchMove导致多动画同时进行
  // scrollCancle();
  reqFrame = requestAnimationFrame(function () {
    // 实际高度
    const h = realBoxHeight.value / 2;
    // 宽度
    const w = realBoxWidth.value / 2;
    const { direction, waitTime } = options.value;
    if (direction === "top") {
      // 上
      if (Math.abs(yPos.value) >= h) {
        emits("scrollEnd");
        yPos.value = 0;
      }
      yPos.value -= step.value;
    } else if (direction === "bottom") {
      // 下
      if (yPos.value >= 0) {
        emits("scrollEnd");
        yPos.value = h * -1;
      }
      yPos.value += step.value;
    } else if (direction === "left") {
      // 左
      if (Math.abs(xPos.value) >= w) {
        emits("scrollEnd");
        xPos.value = 0;
      }
      xPos.value -= step.value;
    } else if (direction === "right") {
      // 右
      if (xPos.value >= 0) {
        emits("scrollEnd");
        xPos.value = w * -1;
      }
      xPos.value += step.value;
    }
    if (singleWaitTime) clearTimeout(singleWaitTime);
    if (realSingleStopHeight.value) {
      // 是否启动了单行暂停配置
      if (Math.abs(yPos.value) % realSingleStopHeight.value < step.value) {
        // 符合条件暂停waitTime
        singleWaitTime = setTimeout(() => {
          scrollMove();
        }, waitTime);
      } else {
        scrollMove();
      }
    } else if (realSingleStopWidth.value) {
      if (Math.abs(xPos.value) % realSingleStopWidth.value < step.value) {
        // 符合条件暂停waitTime
        singleWaitTime = setTimeout(() => {
          scrollMove();
        }, waitTime);
      } else {
        scrollMove();
      }
    } else {
      scrollMove();
    }
  });
};

/**
 * 初始化滚动
 */
const scrollInitMove = () => {
  nextTick(() => {
    const { switchDelay } = options.value;
    // 清空copy
    copyHtml.value = "";
    if (isHorizontal.value) {
      height.value = wrap.value?.offsetHeight || 0;
      width.value = wrap.value?.offsetWidth || 0;
      let slotListWidth = slotList.value?.offsetWidth || 0;
      // 水平滚动设置warp width
      if (autoPlay.value) {
        // 修正offsetWidth四舍五入
        slotListWidth = slotListWidth * 2 + 1;
      }
      const r = realBox.value;
      r && (r.style.width = slotListWidth + "px");
      realBoxWidth.value = slotListWidth;
    }

    if (autoPlay.value) {
      ease = "ease-in";
      delay.value = 0;
    } else {
      ease = "linear";
      delay.value = switchDelay;
      return;
    }

    // 是否可以滚动判断
    if (scrollSwitch.value) {
      let timer;
      if (timer) clearTimeout(timer);
      copyHtml.value = slotList.value?.innerHTML || "";
      setTimeout(() => {
        realBoxHeight.value = realBox.value?.offsetHeight || 0;
        scrollMove();
      }, 0);
    } else {
      scrollCancel();
      yPos.value = xPos.value = 0;
    }
  });
};

/**
 * 开始滚动
 */
const scrollStartMove = () => {
  // 开启scrollMove
  isHover = false;
  scrollMove();
};

/**
 * 停止滚动
 */
const scrollStopMove = () => {
  // 关闭scrollMove
  isHover = true;
  // 防止频频hover进出单步滚动,导致定时器乱掉
  if (singleWaitTime) clearTimeout(singleWaitTime);
  scrollCancel();
};

/**
 * 鼠标滚轮事件
 */
const wheel = (e: WheelEvent) => {
  if (options.value.direction === "left" || options.value.direction === "right") return;
  useDebounceFn(() => {
    e.deltaY > 0 ? (yPos.value -= step.value) : (yPos.value += step.value);
  }, 50)();
};

// watchEffect(() => {
//   const watchData = data;
//   if (!watchData) return;
//   nextTick(() => {
//     reset();
//   });

//   const watchAutoPlay = autoPlay.value;
//   if (watchAutoPlay) {
//     reset();
//   } else {
//     scrollStopMove();
//   }
// });

tryOnMounted(() => {
  scrollInitMove();
});

tryOnUnmounted(() => {
  scrollCancel();
  singleWaitTime && clearTimeout(singleWaitTime);
});

defineExpose({
  reset,
});
</script>

<template>
  <div :ref="'wrap' + classOption['key']">
    <div :style="leftSwitch" v-if="navigation" :class="leftSwitchClass" @click="leftSwitchClick">
      <slot name="left-switch" />
    </div>

    <div :style="rightSwitch" v-if="navigation" :class="rightSwitchClass" @click="rightSwitchClick">
      <slot name="right-switch" />
    </div>

    <div
      :ref="'realBox' + classOption['key']"
      :style="pos"
      @mouseenter="enter"
      @mouseleave="leave"
      @touchstart.passive="touchStart"
      @touchmove.passive="touchMove"
      @touchend="touchEnd"
      @mousewheel.passive="wheel"
    >
      <div :ref="'slotList' + classOption['key']" :style="float">
        <slot />
      </div>
      <div v-html="copyHtml" :style="float" />
    </div>
  </div>
</template>
