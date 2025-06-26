<script setup lang="ts">
import CountUp from "countup";
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "CountTo" });

const ns = useNamespace("count-to");

interface Unit {
  value: number;
  label: string;
}

interface CountToProps {
  init?: number; // 初始值，后面会被 startVal 覆盖
  startVal?: number; // 起始值，即动画开始前显示的数值
  endVal: number; // 结束值，即动画结束后显示的数值
  prefix?: string; // 数值的前缀
  suffix?: string; // 数值的后缀
  decimals?: number; // 保留几位小数
  decimal?: string; // 分隔整数和小数的符号，默认是小数点
  duration?: number; // 动画持续的时间，单位是秒
  delay?: number; // 动画延迟开始的时间，单位是秒
  autoplay?: boolean; // 是否自动播放
  useEasing?: boolean; // 是否使用 easing 动画效果
  useGroup?: boolean; // 是否使用分组，分组后每三位会用一个符号分隔，即 1000 位 1,000
  separator?: string; // 用于分组（useGroup）的符号
  simplify?: boolean; // 是否简化显示，设为 true 后会使用 unit 单位来做相关省略
  unit?: Unit[]; // 自定义单位，如 { value: 3, label: "K+" }, { value: 6, label: "M+" } 即大于 3 位数小于 6 位数的用 k+ 来做省略 1000 即显示为 1K+
  countClass?: string; // count 数字的 class
  unitClass?: string; // 单位的 class
  loop?: number; // 循环次数
}

const props = withDefaults(defineProps<CountToProps>(), {
  init: 0,
  startVal: 0,
  prefix: "",
  suffix: "",
  decimals: 0,
  decimal: ".",
  duration: 3,
  delay: 0,
  autoplay: true,
  useEasing: true,
  useGroup: true,
  separator: ",",
  simplify: false,
  unit: () => [
    { value: 3, label: "K+" },
    { value: 6, label: "M+" },
    { value: 9, label: "B+" },
  ],
  countClass: "",
  unitClass: "",
  loop: 1,
});

type CountToEmits = {
  init: [counter: CountUp];
  finished: [];
};

const emits = defineEmits<CountToEmits>();

const countRef = useTemplateRef("countRef");
const counter = ref<any>();
const unitText = ref("");

// endVal change & autoplay: true, restart animate
watch(
  () => props.endVal,
  value => {
    if (props.autoplay) {
      counter.value.update(value);
    }
  }
);

onMounted(() => {
  if (props.autoplay) {
    initCountUp();
    setTimeout(() => {
      loopAnim();
    }, props.delay);
  }
});

onUnmounted(() => {
  cancelAnimationFrame(delayRafId);
  counter.value?.reset();
});

const initCountUp = () => {
  const countRefConst = countRef.value;

  if (!countRefConst) return;
  const endVal = getValue(props.endVal);
  counter.value = new (CountUp as any)(countRefConst, props.startVal, endVal, props.decimals, props.duration, {
    useEasing: props.useEasing,
    useGrouping: props.useGroup,
    separator: props.separator,
    decimal: props.decimal,
  });
  emits("init", counter.value);
};

const getValue = (val: number) => {
  let res = 0;
  if (props.simplify) {
    const { endVal, unitText: u } = transformValue(val);
    unitText.value = u;
    res = endVal;
  } else {
    res = val;
  }
  return res;
};

const transformValue = (val: number) => {
  const len = props.unit.length;
  let res = {
    endVal: 0,
    unitText: "",
  };
  if (val < Math.pow(10, props.unit[0].value)) res.endVal = val;
  else {
    for (let i = 1; i < len; i++) {
      if (val >= Math.pow(10, props.unit[i - 1].value) && val < Math.pow(10, props.unit[i].value)) {
        res = getHandleVal(val, i);
      }
    }
  }
  if (val > Math.pow(10, props.unit[len - 1].value)) {
    res = getHandleVal(val, len);
  }
  return res;
};

const getHandleVal = (val: number, len: number) => {
  return {
    endVal: parseInt(val / Math.pow(10, props.unit[len - 1].value) + ""),
    unitText: props.unit[len - 1].label,
  };
};

// loop animation
const finished = ref(false);
let loopCount = 0;
const loopAnim = () => {
  loopCount++;
  counter.value.start(() => {
    const isTruly = typeof props.loop === "boolean" && props.loop;
    if (isTruly || props.loop > loopCount) {
      useDelay(() => {
        counter.value.reset();
        loopAnim();
      }, props.delay);
    } else {
      finished.value = true;
    }
  });
};

let delayRafId: number = 0;
// delay to execute callback function
const useDelay = (cb: () => unknown, seconds = 1) => {
  let startTime: number;
  function count(timestamp: number) {
    if (!startTime) startTime = timestamp;

    const diff = timestamp - startTime;
    if (diff < seconds * 1000) {
      delayRafId = requestAnimationFrame(count);
    } else {
      cb();
    }
  }
  delayRafId = requestAnimationFrame(count);
};

watch(finished, flag => {
  if (flag) {
    emits("finished");
  }
});

const restart = () => {
  initCountUp();
  setTimeout(() => {
    loopAnim();
  }, props.delay);
};

const pause = () => {
  counter.value.pauseResume();
};

const reset = () => {
  counter.value.reset();
};

defineExpose({
  restart,
  pause,
  reset,
  init: initCountUp,
});
</script>

<template>
  <div :class="ns.b()">
    <slot name="prefix">
      <span v-if="prefix">{{ prefix }}</span>
    </slot>
    <p :class="ns.e('outer')">
      <span ref="countRef" :class="[countClass]">{{ init }}</span>
      <span :class="[unitClass]">{{ unitText }}</span>
    </p>
    <slot name="suffix">
      <span v-if="suffix">{{ suffix }}</span>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(count-to) {
  @include e(outer) {
    display: inline-block;
    margin: 0;
  }
}
</style>
