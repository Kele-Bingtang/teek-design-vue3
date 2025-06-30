<!-- 时间轴列表卡片 -->
<script setup lang="ts">
import type { TimelineProps } from "./types";
import { useNamespace } from "@/composables";

defineOptions({ name: "TimelineListCard" });

// 常量配置
const itemHeight = 65;

const props = withDefaults(defineProps<TimelineProps>(), {
  title: "",
  subtitle: "",
  maxCount: 5,
  timelineItemProps: () => ({}),
});

const ns = useNamespace("timeline-list-card");

// 计算最大高度
const maxHeight = computed(() => `${itemHeight * props.maxCount}px`);
</script>

<template>
  <div :class="[ns.b(), ns.join('card-minimal')]">
    <div :class="ns.e('header')">
      <p :class="ns.em('header', 'title')">
        <slot>{{ title }}</slot>
      </p>
      <p :class="ns.em('header', 'subtitle')">
        <slot>{{ subtitle }}</slot>
      </p>
    </div>

    <el-scrollbar :style="{ height: maxHeight }">
      <el-timeline>
        <el-timelineItem
          v-for="item in list"
          :key="item.time"
          :timestamp="item.time"
          placement="top"
          :color="item.status"
          :center="true"
          v-bind="timelineItemProps"
        >
          <div :class="[ns.e('item'), 'flx-align-center']">
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
@use "./index";
</style>
