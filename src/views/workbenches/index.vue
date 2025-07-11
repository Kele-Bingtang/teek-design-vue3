<script setup lang="ts">
import type { FlowType } from "./components/flow/index.vue";
import { getNowDate } from "@/common/utils";
import { useNamespace } from "@/composables";
import Flow from "./components/flow/index.vue";
import FlowTable from "./components/flow/table.vue";
import BulletinBoard from "./components/bulletin-board/index.vue";
import TodayView from "./components/today-view/index.vue";
import HotRecommend from "./components/hot-recommend/index.vue";
import SimpleNotebook from "./components/simple-notebook/index.vue";
import CommonLinks from "./components/common-links/index.vue";
import Calendar from "./components/calendar/index.vue";

const ns = useNamespace("workbenches");

const activeType = ref<FlowType>("");

const handleClick = (type: FlowType) => {
  activeType.value = type;
};
</script>

<template>
  <div :class="ns.b()">
    <div>
      <Flow @click="handleClick" />
    </div>

    <div>
      <div class="tk-card-minimal welcome">
        <h2 class="title">欢迎使用 Teek 工作台</h2>
        <p class="time">当前时间：{{ getNowDate() }}</p>
      </div>
    </div>

    <div class="row-5 flx-column gap-10">
      <BulletinBoard :class="ns.e('bulletin-board')" />
      <SimpleNotebook :class="ns.e('simple-notebook')" />
      <Calendar :class="ns.e('calendar')" />
    </div>

    <div v-show="activeType" class="column-2">
      <FlowTable :type="activeType" />
    </div>

    <div class="row-2">
      <TodayView :class="ns.e('today-view')" />
    </div>

    <div class="row-2">
      <HotRecommend :class="ns.e('hot-recommend')" />
    </div>

    <div class="column-2">
      <CommonLinks :class="ns.e('common-links')" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(workbenches) {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: auto;
  grid-auto-flow: dense;
  gap: 10px;
  align-items: start;

  > div {
    height: 100%;
  }

  .column-2 {
    grid-column-start: span 2;
  }

  .row-2 {
    grid-row-start: span 2;
  }

  .row-5 {
    grid-row-start: span 5;
  }

  .welcome {
    height: 100%;

    .title {
      font-size: 20px;
      font-weight: 600;
    }

    .time {
      margin-top: 10px;
      font-size: 14px;
    }
  }

  // 响应式 grid 布局
  @media (max-width: $device-laptop) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .column-2 {
      grid-column-start: span 1;
    }
  }

  @media (max-width: $device-phone-large) {
    grid-template-columns: repeat(1, minmax(0, 1fr));

    .column-2 {
      grid-column-start: span 1;
    }

    .row-2 {
      grid-row-start: span 1;
    }

    .row-5 {
      grid-row-start: span 1;
    }
  }
}
</style>
