<script setup lang="ts" name="CountToDemo">
import { CountTo } from "@/components";
import { useNamespace } from "@/composables";

const ns = useNamespace("count-to-demo");

const customUnit = [
  { value: 3, label: "千多" },
  { value: 4, label: "万多" },
  { value: 5, label: "十万多" },
];

const countRef = useTemplateRef("countRef");
const asyncEndVal = ref(199);
let timer: ReturnType<typeof setInterval> | null;
const countToParams = reactive({
  startVal: 0,
  endVal: 1999,
  duration: 4,
  decimals: 0,
  separator: ",",
  suffix: " Year",
  prefix: "Be ",
  loop: 1,
});

const startVal = computed(() => {
  if (countToParams.startVal) {
    return countToParams.startVal;
  } else {
    return 0;
  }
});

const endVal = computed(() => {
  if (countToParams.endVal) {
    return countToParams.endVal;
  } else {
    return 0;
  }
});
const duration = computed(() => {
  if (countToParams.duration) {
    return countToParams.duration;
  } else {
    return 100;
  }
});

const decimals = computed(() => {
  if (countToParams.decimals) {
    if (countToParams.decimals < 0 || countToParams.decimals > 20) {
      alert("decimals 值应该在 0 - 20 区间内");
      return 0;
    }
    return countToParams.decimals;
  } else {
    return 0;
  }
});

const separator = computed(() => countToParams.separator);
const suffix = computed(() => countToParams.suffix);
const prefix = computed(() => countToParams.prefix);
const loop = computed(() => countToParams.loop);

onMounted(() => {
  init();
});

onActivated(() => {
  init();
});

onDeactivated(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

const init = () => {
  timer = setInterval(() => {
    asyncEndVal.value += parseInt(Math.random() * 30 + "");
  }, 2000);
};

const start = () => {
  countRef.value && countRef.value.restart();
};
const pauseResume = () => {
  countRef.value && countRef.value.pause();
};
const reset = () => {
  countRef.value && countRef.value.reset();
};
</script>

<template>
  <el-space fill :class="ns.b()">
    <el-card shadow="never" class="tk-card-minimal">
      <template #header>
        <el-link
          href="https://github.com/inorganik/countUp.js"
          target="_blank"
          underline="never"
          style="font-size: 20px"
        >
          CountUp.js
        </el-link>
      </template>
    </el-card>

    <el-row :gutter="20">
      <el-col :sm="12" :md="8" :lg="4" :xl="4">
        <el-card shadow="hover" class="tk-card-minimal">
          <template #header>
            <span>基础用法</span>
          </template>
          <div class="count-to-content">
            <CountTo :start-val="0" :end-val="2727" count-class="count-text" />
          </div>
        </el-card>
      </el-col>

      <el-col :sm="12" :md="8" :lg="5" :xl="5">
        <el-card shadow="hover" class="tk-card-minimal">
          <template #header>
            <span>添加前缀和后缀</span>
          </template>
          <div class="count-to-content">
            <CountTo :start-val="0" :end-val="2727" prefix="Lucky " suffix=" Num" count-class="count-text" />
          </div>
        </el-card>
      </el-col>

      <el-col :sm="12" :md="8" :lg="7" :xl="7">
        <el-card shadow="hover" class="tk-card-minimal">
          <template #header>
            <span>保留 2 位小数点 & 循环三次</span>
          </template>
          <div class="count-to-content">
            <CountTo :start-val="0" :end-val="2727" :decimals="2" :loop="3" count-class="count-text" />
          </div>
        </el-card>
      </el-col>

      <el-col :sm="12" :md="8" :lg="8" :xl="8">
        <el-card shadow="hover" class="tk-card-minimal">
          <template #header>
            <span>动画持续 10 秒</span>
          </template>
          <div class="count-to-content">
            <CountTo
              :start-val="0"
              :end-val="2727"
              :decimals="2"
              :duration="10"
              :use-easing="false"
              count-class="count-text"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="count-to-row">
      <el-col :sm="12" :md="8" :lg="8" :xl="8">
        <el-card shadow="hover" class="tk-card-minimal">
          <template #header>
            <span>单位转换（自带）</span>
          </template>
          <div class="count-to-content">
            <CountTo
              :simplify="true"
              :end-val="27272"
              prefix="原始数据：27272 => "
              count-class="count-text"
              unit-class="unit-class"
            />
            <CountTo
              :simplify="true"
              :end-val="27272727"
              prefix="原始数据：27272727 => "
              count-class="count-text"
              unit-class="unit-class"
            />
            <CountTo
              :simplify="true"
              :end-val="27272727277"
              prefix="原始数据：27272727277 => "
              count-class="count-text"
              unit-class="unit-class"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :sm="12" :md="8" :lg="8" :xl="8">
        <el-card shadow="hover" class="tk-card-minimal">
          <template #header>
            <span>自定义单位</span>
          </template>
          <div class="count-to-content">
            <CountTo
              :simplify="true"
              :end-val="2727"
              :unit="customUnit"
              count-class="count-text"
              unit-class="unit-class"
            >
              <template #prefix>原始数据：2727 =>&nbsp;</template>
            </CountTo>

            <CountTo
              :simplify="true"
              :end-val="27272"
              :unit="customUnit"
              count-class="count-text"
              unit-class="unit-class"
            >
              <template #prefix>原始数据：27272 =>&nbsp;</template>
            </CountTo>

            <CountTo
              :simplify="true"
              :end-val="272727"
              count-class="count-text"
              :unit="customUnit"
              unit-class="unit-class"
            >
              <template #prefix>原始数据：272727 =>&nbsp;</template>
            </CountTo>
          </div>
        </el-card>
      </el-col>

      <el-col :sm="12" :md="8" :lg="8" :xl="8">
        <el-card shadow="hover" class="tk-card-minimal">
          <template #header>
            <span>异步更新数据</span>
          </template>
          <div class="count-to-content" style="line-height: 149px">
            <CountTo :end-val="asyncEndVal" count-class="count-text" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="count-to-row">
      <el-card shadow="hover" class="tk-card-minimal">
        <template #header>
          <span>
            完整 Demo： &lt;CountTo :start-val=&#x27;{{ startVal }}&#x27; :end-val=&#x27;{{ endVal }}&#x27;
            :duration=&#x27;{{ duration }}&#x27; :decimals=&#x27;{{ decimals }}&#x27; :separator=&#x27;{{
              separator
            }}&#x27; :prefix=&#x27;{{ prefix }}&#x27; :suffix=&#x27;{{ suffix }}&#x27; :autoplay=&#x27;false&#x27;
            :loop=&#x27;{{ loop }}&#x27; /&gt;
          </span>
        </template>
        <div class="count-to-content">
          <CountTo
            ref="countRef"
            :start-val="startVal"
            :end-val="endVal"
            :duration="duration"
            :decimals="decimals"
            :separator="separator"
            :prefix="prefix"
            :suffix="suffix"
            :autoplay="false"
            :loop="loop"
            class="count-demo"
          />
          <el-form :inline="true" :model="countToParams" class="demo-form-inline">
            <el-form-item label="起始值：">
              <el-input v-model="countToParams.startVal" placeholder="startVal"></el-input>
            </el-form-item>
            <el-form-item label="结束值：">
              <el-input v-model="countToParams.endVal" placeholder="endVal"></el-input>
            </el-form-item>
            <el-form-item label="持续时间：">
              <el-input v-model="countToParams.duration" placeholder="duration"></el-input>
            </el-form-item>
            <el-form-item label="保留小数：">
              <el-input v-model="countToParams.decimals" placeholder="decimals"></el-input>
            </el-form-item>
            <el-form-item label="分隔符：">
              <el-input v-model="countToParams.separator" placeholder="separator"></el-input>
            </el-form-item>
            <el-form-item label="前缀：">
              <el-input v-model="countToParams.prefix" placeholder="prefix"></el-input>
            </el-form-item>
            <el-form-item label="后缀：">
              <el-input v-model="countToParams.suffix" placeholder="suffix"></el-input>
            </el-form-item>
            <el-form-item label="循环：">
              <el-input v-model="countToParams.loop" placeholder="loop"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="start">Start</el-button>
              <el-button type="primary" @click="pauseResume">Pause/Resume</el-button>
              <el-button type="primary" @click="reset">Reset</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>

    <el-card shadow="never" class="tk-card-minimal">
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="init">
          初始值，后面会被 startVal 覆盖。`number` 类型，默认为 `0`
        </el-descriptions-item>
        <el-descriptions-item label="startVal">
          起始值，即动画开始前显示的数值。`number` 类型，默认为 `0`
        </el-descriptions-item>
        <el-descriptions-item label="endVal">
          结束值，即动画结束后显示的数值。`number` 类型，默认为 `undefined`
        </el-descriptions-item>
        <el-descriptions-item label="prefix">数值的前缀。`string` 类型，默认为 `""`</el-descriptions-item>
        <el-descriptions-item label="suffix">数值的后缀。`string` 类型，默认为 `""`</el-descriptions-item>
        <el-descriptions-item label="decimals">保留几位小数。`number` 类型，默认为 `0`</el-descriptions-item>
        <el-descriptions-item label="decimal">
          分隔整数和小数的符号，默认是小数点。`string` 类型，默认为 `"."`
        </el-descriptions-item>
        <el-descriptions-item label="duration">
          动画持续的时间，单位是秒。`number` 类型，默认为 `3`
        </el-descriptions-item>
        <el-descriptions-item label="delay">
          动画延迟开始的时间，单位是秒。`number` 类型，默认为 `0`
        </el-descriptions-item>
        <el-descriptions-item label="autoplay">
          是否自动播放，单位是秒。`boolean` 类型，默认为 `true`
        </el-descriptions-item>
        <el-descriptions-item label="useEasing">
          是否使用 easing 动画效果。`boolean` 类型，默认为 `true`
        </el-descriptions-item>
        <el-descriptions-item label="useGroup">
          是否使用分组，分组后每三位会用一个符号分隔，即 1000 位 1,000。`boolean` 类型，默认为 `true`
        </el-descriptions-item>
        <el-descriptions-item label="separator">
          用于分组（useGroup）的符号。`string` 类型，默认为 `","`
        </el-descriptions-item>
        <el-descriptions-item label="simplify">
          是否简化显示，设为 true 后会使用 unit 单位来做相关省略。`boolean` 类型，默认为 `false`
        </el-descriptions-item>
        <el-descriptions-item label="unit">
          自定义单位，如 { value: 3, label: "K+" }, { value: 6, label: "M+" } 即大于 3 位数小于 6 位数的用 k+ 来做省略
          1000 即显示为 1K+。`Unit[]` 类型，默认为 `[ { value: 3, label: "K+" }, { value: 6, label: "M+" }, { value: 9,
          label: "B+" }, ]`
        </el-descriptions-item>
        <el-descriptions-item label="countClass">count 数字的 class。`string` 类型，默认为 `""`</el-descriptions-item>
        <el-descriptions-item label="unitClass">单位的 class。`string` 类型，默认为 `""`</el-descriptions-item>
        <el-descriptions-item label="loop">循环次数。`number` 类型，默认为 `1`</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never" class="tk-card-minimal">
      <el-descriptions title="Emits 事件 📚" :column="1" border>
        <el-descriptions-item label="init">初始化后事件。`(counter: CountUp) => void` 类型</el-descriptions-item>
        <el-descriptions-item label="finished">数字渐变结束事件。`() => void` 类型</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never" class="tk-card-minimal">
      <el-descriptions title="Expose 参数 📚" :column="1" border>
        <el-descriptions-item label="restart">重启数字渐变函数。`(counter: CountUp) => void` 类型</el-descriptions-item>
        <el-descriptions-item label="pause">暂停数字渐变函数。`() => void` 类型</el-descriptions-item>
        <el-descriptions-item label="reset">重置数字渐变函数。`() => void` 类型</el-descriptions-item>
        <el-descriptions-item label="init">初始化数字渐变函数。`() => void` 类型</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(count-to-demo) {
  .count-to-content {
    text-align: center;
  }

  .count-demo {
    display: block;
    margin-bottom: 20px;
    font-size: 80px;
    font-weight: 500;
    color: cssVarEl(color-primary);
    text-align: center;
  }

  .el-row {
    row-gap: 10px;
  }

  :deep(.count-text),
  :deep(.unit-class) {
    font-size: 50px;
    color: cssVarEl(color-primary);
  }
}
</style>
