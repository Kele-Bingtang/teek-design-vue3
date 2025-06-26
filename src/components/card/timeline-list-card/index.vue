<!-- 时间轴列表卡片 -->
<script setup lang="ts">
import { useNamespace } from "@/composables";
import type { TimelineProps } from "./types";

defineOptions({ name: "TimelineListCard" });

// 常量配置
const ITEM_HEIGHT = 65;
const TIMELINE_PLACEMENT = "top";
const DEFAULT_MAX_COUNT = 5;

// Props 定义和验证
const props = withDefaults(defineProps<TimelineProps>(), {
  title: "",
  subtitle: "",
  maxCount: DEFAULT_MAX_COUNT,
});

const ns = useNamespace("timeline-list-card");

// 计算最大高度
const maxHeight = computed(() => `${ITEM_HEIGHT * props.maxCount}px`);
</script>

<template>
  <div :class="[ns.b(), ns.join('card-secondary')]">
    <div :class="ns.e('header')">
      <p :class="ns.em('header', 'title')">{{ title }}</p>
      <p :class="ns.em('header', 'subtitle')">{{ subtitle }}</p>
    </div>

    <el-scrollbar :style="{ height: maxHeight }">
      <el-timeline>
        <el-timelineItem
          v-for="item in list"
          :key="item.time"
          :timestamp="item.time"
          :placement="TIMELINE_PLACEMENT"
          :color="item.status"
          :center="true"
        >
          <div :class="ns.e('item')">
            <div :class="ns.e('content')">
              <span :class="ns.em('content', 'text')">{{ item.content }}</span>
              <span v-if="item.code" :class="ns.em('content', 'code')">#{{ item.code }}</span>
            </div>
          </div>
        </el-timelineItem>
      </el-timeline>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(timeline-list-card) {
  padding: 30px;
  background-color: cssVar(main-bg-color);
  border-radius: cssVar(radius);

  @include e(header) {
    padding-bottom: 15px;

    @include m(title) {
      font-size: 18px;
      font-weight: 500;
      color: cssVar(gray-900);
    }

    @include m(subtitle) {
      font-size: 14px;
      color: cssVar(gray-500);
    }
  }

  :deep(.el-timeline-item__tail) {
    left: 5px;
  }

  :deep(.el-timeline-item__node--normal) {
    left: 0;
  }

  @include e(item) {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  @include e(content) {
    display: flex;
    gap: 8px;
    align-items: center;

    @include m(text) {
      font-size: 14px;
    }

    @include m(code) {
      font-size: 0.9em;
      color: var(--#{$el-namespace}-color-primary);
    }
  }
}
</style>
