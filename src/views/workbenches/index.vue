<script setup lang="ts">
import type { FlowType } from "./components/flow/index.vue";
import { ref } from "vue";
import { useMediaQuery } from "@vueuse/core";
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

// 与 styles 里的 @media (max-width: $device-phone-large) 对应
const isPhoneLarge = useMediaQuery("(max-width: 768px)");

const handleClick = (type: FlowType) => {
  activeType.value = type;
};
</script>

<template>
  <div :class="[ns.b(), ns.is('full', $route.meta.isFull)]">
    <div>
      <Flow @click="handleClick" />
    </div>

    <div v-if="isPhoneLarge" v-show="activeType" class="column-2">
      <FlowTable :type="activeType" />
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

    <div v-if="!isPhoneLarge" v-show="activeType" class="column-2">
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
@use "./index";
</style>
