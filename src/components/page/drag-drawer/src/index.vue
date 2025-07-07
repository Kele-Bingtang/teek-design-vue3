<script setup lang="ts">
import type { StyleValue } from "vue";
import type { DragDrawerProps, DragDrawerEmits } from "./types";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { ElDrawer } from "element-plus";
import { useNamespace } from "@/composables";
import Trigger from "./trigger.vue";

defineOptions({ name: "DragDrawer" });

const ns = useNamespace("drag-drawer");

const props = withDefaults(defineProps<DragDrawerProps>(), {
  placement: "right",
  draggable: false,
  minWidth: 200,
  maxWidth: "auto",
  inner: false,
});

const emits = defineEmits<DragDrawerEmits>();

const drawerVisible = defineModel<boolean>({ required: true });
const drawerWidth = defineModel<number>("width", { default: 200 });

const canMove = ref(false);
const wrapperWidth = ref(0);
const wrapperLeft = ref(0);

const drawerInstance = useTemplateRef<InstanceType<typeof ElDrawer>>("drawerInstance");

const direction = computed(() => {
  if (props.placement === "right") return "rtl";
  if (props.placement === "left") return "ltr";
  if (props.placement === "top") return "ttb";
  if (props.placement === "bottom") return "btt";
  return "rtl";
});

const triggerStyle = computed(() => {
  let d = "right";
  if (direction.value === "rtl") d = "right";
  else if (direction.value === "ltr") d = "left";

  return {
    [d]: `${drawerWidth.value}px`,
    position: props.inner ? "absolute" : "fixed",
  } as StyleValue;
});

onMounted(() => {
  setWrapperWidth();
  document.addEventListener("mousemove", handleMousemove);
  document.addEventListener("mouseup", handleMouseup);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", handleMousemove);
  document.removeEventListener("mouseup", handleMouseup);
});

/**
 * 鼠标按下事件
 * @param event 鼠标事件
 */
const handleTriggerMousedown = (event: Event) => {
  event.preventDefault();
  canMove.value = true;
  emits("onResizeStart");

  // 防止鼠标选中抽屉中文字，造成拖动 trigger 触发浏览器原生拖动行为
  window.getSelection()?.removeAllRanges();
};

/**
 * 鼠标移动事件
 */
const handleMousemove = (event: any) => {
  if (!canMove.value) return;
  // 超出屏幕不允许拖拽
  if (event.pageX < 1 || event.pageX > window.innerWidth - 1) return;

  // 更新容器宽度和距离左侧页面距离，如果是 window 则距左侧距离为 0
  setWrapperWidth();

  const left = event.pageX - wrapperLeft.value;
  // 如果抽屉方向为右边，宽度计算需用容器宽度减去 left
  let width = direction.value === "rtl" ? wrapperWidth.value - left : left;
  // 限定最小宽度
  width = Math.max(width, props.minWidth);
  // 限定最大宽度
  width = Math.min(width, props.maxWidth === "auto" ? window.innerWidth - 1 : props.maxWidth);
  event.atMin = width;

  // 如果当前 width 不大于 100，视为百分比
  if (width <= 100) width = (width / wrapperWidth.value) * 100;
  drawerWidth.value = width;
  emits("onResize", event);
};

/**
 * 鼠标抬起事件
 */
const handleMouseup = () => {
  canMove.value = false;
  emits("onResizeEnd");
};

/**
 * 设置容器宽度
 */
const setWrapperWidth = () => {
  const { width, left } = drawerInstance.value?.$el?.nextElementSibling.firstElementChild?.getBoundingClientRect() || {
    width: 0,
    left: 0,
  };

  wrapperWidth.value = width;
  wrapperLeft.value = left;
};
</script>

<template>
  <div :class="ns.b()">
    <el-drawer
      ref="drawerInstance"
      v-model="drawerVisible"
      :size="drawerWidth"
      :direction="direction"
      v-bind="$attrs"
      :class="[ns.is('inner', inner), ns.no('select', canMove), direction]"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>

      <div v-if="draggable" :style="triggerStyle" :class="ns.e('trigger')" @mousedown="handleTriggerMousedown">
        <slot name="trigger">
          <Trigger />
        </slot>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
