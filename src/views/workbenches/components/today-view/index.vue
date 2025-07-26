<script setup lang="ts">
import { ref } from "vue";
import { useNamespace } from "@/composables";
import { Tooltip, PointTag } from "@/components";
import { todayViewData } from "./data";

defineOptions({ name: "TodayView" });

interface TodayViewItem {
  title: string;
  tag: string;
  hasRead: boolean;
  time: string;
}

const ns = useNamespace("today-view");

const limit = 15;

const data = ref<TodayViewItem[]>(todayViewData.slice(0, limit));

const handleClick = (item: TodayViewItem) => {
  item.hasRead = true;
  console.log(item);
};

const handleMore = () => {
  console.log("跳转更多今日看点");
};
</script>

<template>
  <div :class="ns.b()" class="tk-card-minimal">
    <div class="flx-align-center-between" :class="ns.e('header')">
      <h2>今日看点</h2>
      <el-button size="small" link @click="handleMore">更多 ></el-button>
    </div>

    <div
      v-for="item in data.slice(0, limit)"
      :key="item.title"
      @click="handleClick(item)"
      :class="[ns.e('item'), ns.has('read', item.hasRead)]"
      class="flx-align-center gap-10 sle"
    >
      <PointTag v-if="!item.hasRead" type="danger" :size="6" :offset="0" />
      <el-tag type="info">{{ item.tag }}</el-tag>
      <Tooltip class="title" placement="top">
        <span>{{ item.title }}</span>
      </Tooltip>
      <div class="time">{{ item.time }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(today-view) {
  height: 100%;
  @include e(header) {
    margin-bottom: 16px;

    h2 {
      font-size: 20px;
      font-weight: 600;
    }
  }

  @include e(item) {
    margin-bottom: 10px;
    cursor: pointer;
    border-radius: 4px;
    transition: all cssVarEl(transition-duration-fast) cssVar(easing);

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      color: cssVar("color-primary");
      background-color: cssVar("gray-100");

      .el-tag {
        color: cssVar("color-primary");
        background-color: cssVar("gray-200");
      }
    }

    .title {
      width: 100%;

      span {
        font-size: 14px;
        font-weight: 500;
      }
    }

    .time {
      font-size: 12px;
      color: cssVar("text-gray-600");
    }

    @include has(read) {
      color: cssVar("text-gray-500");

      .el-tag {
        color: cssVar("text-gray-500");
      }
    }
  }
}
</style>
