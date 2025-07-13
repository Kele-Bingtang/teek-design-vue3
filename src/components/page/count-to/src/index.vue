<script setup lang="ts">
import type { CountToEmits, CountToProps } from "./types";
import { ref, watch, onMounted, onUnmounted, useTemplateRef } from "vue";
import CountUp from "countup";
import { useNamespace } from "@/composables";

defineOptions({ name: "CountTo" });

const ns = useNamespace("count-to");

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

const emits = defineEmits<CountToEmits>();

const countInstance = useTemplateRef("countInstance");
const counter = ref<any>();
const unitText = ref("");

const { initCountUp } = useInitCountUp();
const { loopAnimation, restart } = useLoopAnimation();

watch(
  () => props.endVal,
  value => {
    props.autoplay && update(value);
  }
);

/**
 * 初始化 countup 实例
 */
function useInitCountUp() {
  /**
   * 初始化 countup 实例
   */
  const initCountUp = () => {
    const countInstanceConst = countInstance.value;

    if (!countInstanceConst) return;
    const endVal = getValue(props.endVal);
    counter.value = new (CountUp as any)(countInstanceConst, props.startVal, endVal, props.decimals, props.duration, {
      useEasing: props.useEasing,
      useGrouping: props.useGroup,
      separator: props.separator,
      decimal: props.decimal,
    });
    emits("init", counter.value);
  };

  /**
   * 获取值
   * @param val 值
   */
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

  /**
   * 转换值
   * @param val 值
   */
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

  /**
   * 处理值
   * @param val 值
   * @param len 长度
   */
  const getHandleVal = (val: number, len: number) => {
    return {
      endVal: parseInt(val / Math.pow(10, props.unit[len - 1].value) + ""),
      unitText: props.unit[len - 1].label,
    };
  };

  return { initCountUp };
}

/**
 * 使用循环动画
 */
function useLoopAnimation() {
  const finished = ref(false);
  let loopCount = 0;
  let delayId: number = 0;
  /**
   * 延迟执行回调函数
   * @param cb 回调函数
   * @param seconds 秒
   */
  const delay = (cb: () => unknown, seconds = 1) => {
    let startTime: number;
    function count(timestamp: number) {
      if (!startTime) startTime = timestamp;

      const diff = timestamp - startTime;
      if (diff < seconds * 1000) {
        delayId = requestAnimationFrame(count);
      } else {
        cb();
      }
    }
    delayId = requestAnimationFrame(count);
  };

  /**
   * 循环动画
   */
  const loopAnimation = () => {
    loopCount++;
    counter.value.start(() => {
      const isTruly = typeof props.loop === "boolean" && props.loop;
      if (isTruly || props.loop > loopCount) {
        delay(() => {
          counter.value.reset();
          loopAnimation();
        }, props.delay);
      } else {
        finished.value = true;
      }
    });
  };

  /**
   * 重新开始
   */
  const restart = () => {
    initCountUp();
    setTimeout(() => {
      loopAnimation();
    }, props.delay);
  };

  watch(finished, flag => {
    if (flag) {
      emits("finished");
    }
  });

  onUnmounted(() => {
    cancelAnimationFrame(delayId);
  });

  return { loopAnimation, restart };
}

/**
 * 更新
 */
const update = (val?: number) => {
  counter.value.update(val ?? props.endVal);
};

/**
 * 暂停
 */
const pause = () => {
  counter.value.pauseResume();
};

/**
 * 重置
 */
const reset = () => {
  counter.value.reset();
};

onMounted(() => {
  if (props.autoplay) {
    initCountUp();
    setTimeout(() => {
      loopAnimation();
    }, props.delay);
  }
});

onUnmounted(() => {
  counter.value?.reset();
});

defineExpose({
  restart,
  pause,
  reset,
  init: initCountUp,
  update,
});
</script>

<template>
  <div :class="ns.b()">
    <slot name="prefix">
      <span v-if="prefix">{{ prefix }}</span>
    </slot>
    <p :class="ns.e('outer')">
      <span ref="countInstance" :class="[countClass]">{{ init }}</span>
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
