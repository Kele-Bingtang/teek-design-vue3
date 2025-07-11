<script setup lang="ts">
import { useNamespace } from "@/composables";
import { Tooltip } from "@/components";
import { todayViewData } from "./data";

defineOptions({ name: "HotRecommend" });

const ns = useNamespace("hot-recommend");

const limit = 15;

const data = todayViewData.slice(0, limit);

const handleClick = (item: (typeof todayViewData)[0]) => {
  item.hasRead = true;
  console.log(item);
};

const handleMore = () => {
  console.log("跳转更多热点推荐");
};
</script>

<template>
  <div :class="ns.b()" class="tk-card-minimal">
    <div class="flx-align-center-between" :class="ns.e('header')">
      <h2>热点推荐</h2>
      <el-button size="small" link @click="handleMore">更多 ></el-button>
    </div>

    <div
      v-for="(item, index) in data"
      :key="item.title"
      @click="handleClick(item)"
      :class="ns.e('item')"
      class="flx-align-center gap-10 sle"
    >
      <i class="index" :class="`index-${index + 1}`">{{ index + 1 }}</i>
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

@include b(hot-recommend) {
  height: 100%;
  @include e(header) {
    margin-bottom: 16px;

    h2 {
      font-size: 20px;
      font-weight: 600;
    }
  }

  @include e(item) {
    height: 26px;
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

    .index {
      font-size: 16px;
      font-style: italic;
      font-weight: 600;
      color: cssVar("text-gray-400");
      border-radius: 8px 0;

      &.index-1,
      &.index-2,
      &.index-3 {
        color: cssVar("warning");
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
  }
}
</style>
