<!-- 利用 el-tooltip 实现文字超出时显示省略号并气泡提示，否则不气泡提示，支持 el-tooltip 的所有属性 -->
<!-- 使用: Tooltip 组件内必须包裹仅且一个 html 标签，外层 div 标签需要具有宽度
    <div>
      <Tooltip><span>...</span></Tooltip>
    </div>
 -->
<script setup lang="ts">
import { isArray } from "@/common/utils";
import { useSlots, ref, computed, onMounted, onUpdated, onBeforeMount } from "vue";
import { ElTooltip } from "element-plus";

defineOptions({ name: "Tooltip" });

interface TooltipProps {
  line?: number; // 多少行文字溢出开始省略并气泡提示
  realTime?: boolean; // 是否实时的判断文字是否溢出（鼠标悬停触发一次）
  try?: number; // 组件初始化后，尝试多少次判断文字是否溢出（鼠标悬停触发一次），相比较 realTime，这是有次数的限制
}

const props = withDefaults(defineProps<TooltipProps>(), {
  line: 1,
  realTime: false,
  try: 0,
});

let tryNumber = -1;
const slots = useSlots() as any;
let slotDom = slots.default();
const slotInstance = useTemplateRef("slotInstance");
const showTip = ref<boolean>(false);
const content = ref<any>([]);
const isFirstMounted = ref(false);
const line = computed(() => props.line);

const className = computed(() => {
  if (props.line === 1) return "sle";
  else return "line-clamp";
});

const childrenIsArray = (arr: any, content: Array<string>) => {
  arr.forEach((v: any) => {
    if (isArray(v.children)) childrenIsArray(v.children, content);
    else content.push(v.children);
  });
};

const slotDomIsSingleElArray = (slotDom: any) => {
  if (isArray(slotDom.children)) childrenIsArray(slotDom.children, content.value);
  else content.value = [slotDom.children];
};

const getContent = () => {
  if (slotDom.length > 1) {
    slotDom.forEach((v: any) => {
      slotDomIsSingleElArray(v);
    });
  } else slotDomIsSingleElArray(slotDom[0]);
};

const compareWidth = () => {
  // 如果已经溢出，则不需要处理
  if (showTip.value) return;
  if (!props.realTime) {
    if (tryNumber > props.try) return;
    tryNumber = tryNumber + 1;
  }
  content.value = [];

  if (line.value === 1) {
    const parentW = slotInstance.value?.offsetWidth ?? 0;
    if (parentW === 0) return;
    const childW = (slotInstance.value?.firstElementChild as any).offsetWidth ?? 0;
    childW > parentW ? (showTip.value = true) : (showTip.value = false);
    if (showTip.value) getContent();
  } else {
    getContent();
    // childW 为文本在页面中所占的宽度，创建 span 标签，加入到页面，获取不换行时的 span 标签 宽度，最后在移除 span 标签
    const tempTag = document.createElement("span");
    tempTag.innerText = content.value.join("") ?? "";
    tempTag.className = "tooltip-slot";
    tempTag.style.whiteSpace = "nowrap";
    slotInstance.value?.appendChild(tempTag);
    const tooTipSlot = slotInstance.value?.querySelector(".tooltip-slot");
    const childW = (tooTipSlot && (tooTipSlot as HTMLSpanElement).offsetWidth) || 0;
    tooTipSlot && tooTipSlot.remove();
    const parentW = slotInstance.value?.offsetWidth ?? 0;
    if (parentW === 0) return;
    // 当文本宽度大于容器宽度两倍时，代表文本显示超过两行
    childW > parentW ? (showTip.value = true) : (showTip.value = false);
  }
};

onMounted(() => {
  isFirstMounted.value = true;
  compareWidth();
  if (props.try > 0) slotInstance.value?.addEventListener("mouseover", compareWidth);
  else slotInstance.value?.removeEventListener("mouseout", compareWidth);
});

onUpdated(() => {
  if (isFirstMounted.value) isFirstMounted.value = false;
  else {
    slotDom = slots.default();
    tryNumber = 0;
    compareWidth();
  }
});

onBeforeMount(() => {
  slotInstance.value?.removeEventListener("mouseout", compareWidth);
});
</script>

<template>
  <template v-if="showTip">
    <el-tooltip placement="top" v-bind="$attrs">
      <template #content>{{ content.join("") }}</template>
      <div ref="slotInstance" :class="className">
        <slot></slot>
      </div>
    </el-tooltip>
  </template>
  <template v-else>
    <div ref="slotInstance" :class="className">
      <slot></slot>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.line-clamp {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: v-bind(line); /* 这里是超出几行省略 */
}
</style>
