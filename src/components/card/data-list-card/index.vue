<!-- 数据列表卡片 -->
<script setup lang="ts">
import { useNamespace } from "@/composables";
import type { DataListCardEmits, DataListCardProps } from "./types";

defineOptions({ name: "DataListCard" });

const ITEM_HEIGHT = 66;
const DEFAULT_MAX_COUNT = 5;

const props = withDefaults(defineProps<DataListCardProps>(), {
  maxCount: DEFAULT_MAX_COUNT,
});

const ns = useNamespace("data-list-card");

const maxHeight = computed(() => `${ITEM_HEIGHT * props.maxCount}px`);

const emit = defineEmits<DataListCardEmits>();

const handleMore = () => emit("more");
</script>

<template>
  <div :class="[ns.b(), ns.join('card-secondary')]">
    <div :class="ns.e('header')">
      <p :class="ns.em('header', 'title')">{{ title }}</p>
      <p :class="ns.em('header', 'subtitle')">{{ subtitle }}</p>
    </div>

    <el-scrollbar :style="{ height: maxHeight }">
      <div v-for="(item, index) in list" :key="index" :class="ns.e('item')">
        <div v-if="item.icon" :class="[ns.em('item', 'icon'), item.class]">
          <Icon :icon="item.icon" :size="20" class="icon-sys" />
        </div>

        <div :class="ns.e('item-content')">
          <div :class="ns.em('item-content', 'title')">{{ item.title }}</div>
          <div :class="ns.em('item-content', 'status')">{{ item.status }}</div>
        </div>

        <div :class="ns.em('item', 'time')">{{ item.time }}</div>
      </div>
    </el-scrollbar>

    <el-button :class="ns.e('more-btn')" v-if="showMoreButton" v-waves @click="handleMore">查看更多</el-button>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
