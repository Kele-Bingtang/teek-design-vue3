<script setup lang="ts">
import DragDrawerTrigger from "./drag-drawer-trigger.vue";
import { computed, onBeforeUnmount, onMounted, ref, type StyleValue } from "vue";
import { ElDrawer } from "element-plus";
import { useNamespace } from "@/composables";

defineOptions({ name: "DragDrawer" });

const ns = useNamespace("drag-drawer");

interface DragDrawerProps {
  placement?: string; // 抽屉打开位置
  draggable?: boolean; // 是否开启拖拽功能
  minWidth?: string | number; // 抽屉最小宽度
  inner?: boolean; // 是否在容器内使用抽屉
}

const props = withDefaults(defineProps<DragDrawerProps>(), {
  placement: "right",
  draggable: false,
  minWidth: 200,
  inner: false,
});

type DragDrawerEmits = {
  onResizeStart: [];
  onResize: [event: MouseEvent];
  onResizeEnd: [];
};

const emits = defineEmits<DragDrawerEmits>();

const drawerVisible = defineModel<boolean>({ required: true });
const drawerWidth = defineModel<number>("width", { default: 200 });
const drawerRef = useTemplateRef("drawerRef");
const canMove = ref(false);
const wrapperWidth = ref(0);
const wrapperLeft = ref(0);

const outerClasses = computed(() => {
  const classesArray = [props.inner ? "inner" : "", canMove.value ? "no-select" : ""];
  return classesArray.join(" ");
});

const direction = computed(() => {
  if (props.placement === "right") {
    return "rtl";
  } else if (props.placement === "left") {
    return "ltr";
  } else if (props.placement === "top") {
    return "ttb";
  } else if (props.placement === "bottom") {
    return "btt";
  }
  return "rtl";
});

const innerWidth = computed(() => {
  const width = props.minWidth as number;
  return width <= 100 ? (wrapperWidth.value * width) / 100 : width;
});

const triggerStyle = computed(() => {
  let d = "right";
  if (direction.value === "rtl") {
    d = "right";
  } else if (direction.value === "ltr") {
    d = "left";
  }
  // TODO：支持 top 和 bottom 移动
  // else if (this.direction === "ttb") {
  //   direction = "top";
  // } else if (this.direction === "btt") {
  //   direction = "bottom";
  // }
  return {
    [d]: `${innerWidth.value}px`,
    position: props.inner ? "absolute" : "fixed",
  } as StyleValue;
});

onMounted(() => {
  document.addEventListener("mousemove", handleMousemove);
  document.addEventListener("mouseup", handleMouseup);
  setWrapperWidth();
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", handleMousemove);
  document.removeEventListener("mouseup", handleMouseup);
});

const handleBeforeClose = () => {
  drawerVisible.value = false;
};

const handleTriggerMousedown = (event: Event) => {
  event.preventDefault();
  canMove.value = true;
  emits("onResizeStart");
  // 防止鼠标选中抽屉中文字，造成拖动 trigger 触发浏览器原生拖动行为
  (window as any).getSelection().removeAllRanges();
};

const handleMousemove = (event: any) => {
  if (!canMove.value) return;
  // 更新容器宽度和距离左侧页面距离，如果是 window 则距左侧距离为 0
  setWrapperWidth();
  const left = event.pageX - wrapperLeft.value;
  // 如果抽屉方向为右边，宽度计算需用容器宽度减去 left
  let width = direction.value === "rtl" ? wrapperWidth.value - left : left;
  // 限定做小宽度
  width = Math.max(width, parseFloat(props.minWidth as string));
  event.atMin = width === parseFloat(props.minWidth as string);
  // 如果当前 width 不大于 100，视为百分比
  if (width <= 100) width = (width / wrapperWidth.value) * 100;
  drawerWidth.value = width;
  emits("onResize", event);
};

const handleMouseup = () => {
  canMove.value = false;
  emits("onResizeEnd");
};

const setWrapperWidth = () => {
  const { width, left } = drawerRef.value && drawerRef.value.$el.nextElementSibling.getBoundingClientRect();
  wrapperWidth.value = width;
  wrapperLeft.value = left;
};
</script>

<template>
  <div :class="ns.b()">
    <el-drawer
      ref="drawerRef"
      v-model="drawerVisible"
      :size="width"
      :direction="direction"
      :before-close="handleBeforeClose"
      v-bind="$attrs"
      :class="outerClasses"
    >
      <template #header>
        <slot name="header"></slot>
      </template>
      <slot></slot>
      <div v-if="draggable" :style="triggerStyle" :class="ns.e('trigger')" @mousedown="handleTriggerMousedown">
        <slot name="trigger">
          <DragDrawerTrigger></DragDrawerTrigger>
        </slot>
      </div>
      <div v-if="$slots.footer" :class="ns.e('footer')">
        <slot name="footer"></slot>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(drag-drawer) {
  .no-select {
    pointer-events: none;
    user-select: none;

    @include e(trigger) {
      pointer-events: all;
    }
  }

  // #{$el-namespace} 默认为 el，如果组件迁移到其他项目，且项目架构与此项目不同，则请修改 #{$el-namespace} 为 el
  :deep(.no-select.#{$el-namespace}-drawer) {
    transition: none;
  }

  @include e(trigger) {
    top: 0;
    width: 0;
    height: 100%;
  }

  @include e(footer) {
    bottom: 0;
    left: 0;
    flex-grow: 1;
    width: 100%;
    padding: 10px 16px;
    background: #ffffff;
    border-top: 1px solid #e8e8e8;
  }

  :deep(.inner) {
    position: absolute;
    overflow: visible;

    & + .v-modal {
      position: absolute;
    }
  }
}
</style>
