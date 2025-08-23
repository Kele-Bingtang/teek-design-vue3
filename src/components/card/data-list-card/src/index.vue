<!-- 数据列表卡片 -->
<script setup lang="ts">
import type { DataListCardEmits, DataListCardProps } from "./types";
import { computed } from "vue";
import { ElScrollbar, ElButton } from "element-plus";
import { useNamespace } from "@/composables";

defineOptions({ name: "DataListCard" });

const itemHeight = 66;

const props = withDefaults(defineProps<DataListCardProps>(), {
  subtitle: "",
  maxCount: 5,
  showMoreButton: false,
});

const ns = useNamespace("data-list-card");

const maxHeight = computed(() => `${itemHeight * props.maxCount}px`);

const emit = defineEmits<DataListCardEmits>();

const handleMore = () => emit("more");
</script>

<template>
  <div :class="[ns.b(), ns.join('card-minimal')]">
    <div :class="ns.e('header')">
      <p :class="ns.em('header', 'title')">{{ title }}</p>
      <p :class="ns.em('header', 'subtitle')">{{ subtitle }}</p>
    </div>

    <el-scrollbar :style="{ height: maxHeight }">
      <div v-for="(item, index) in list" :key="index" :class="ns.e('item')" class="flx-align-center">
        <div v-if="item.icon" :class="[ns.em('item', 'icon'), item.class]" class="flx-center">
          <Icon :icon="item.icon" :size="20" class="icon-teek" />
        </div>

        <div :class="ns.e('item-content')" class="flx-1">
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
