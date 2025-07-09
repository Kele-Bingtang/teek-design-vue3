<script setup lang="ts">
import { useNamespace } from "@/composables";
import { Tooltip } from "@/components";
import { todayViewData } from "./data";

defineOptions({ name: "TodayView" });

const ns = useNamespace("today-view");

const limit = 12;

const data = todayViewData.slice(0, limit);

const handleClick = (item: (typeof todayViewData)[0]) => {
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
      v-for="item in data"
      :key="item.title"
      @click="handleClick(item)"
      :class="ns.e('item')"
      class="flx-align-center gap-10 sle"
    >
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

    &:last-child {
      margin-bottom: 0;
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

    &:hover {
      color: cssVar("color-primary");
      background-color: cssVar("gray-100");

      .el-tag {
        color: cssVar("color-primary");
        background-color: cssVar("gray-200");
      }
    }
  }
}
</style>
