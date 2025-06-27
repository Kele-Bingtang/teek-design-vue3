<!-- 统计卡片 -->
<script setup lang="ts">
import type { StatsCardProps } from "./types";
import { ArrowRight } from "@element-plus/icons-vue";
import { CountTo } from "@/components";
import { useNamespace } from "@/composables";
import { addUnit } from "@/common/utils";

defineOptions({ name: "StatsCard" });

withDefaults(defineProps<StatsCardProps>(), {
  icon: "",
  title: "",
  count: 0,
  description: "",
  iconColor: "",
  iconBgColor: "",
  iconBgRadius: 50,
  iconSize: 30,
  textColor: "",
  backgroundColor: "",
  showArrow: false,
});

const ns = useNamespace("stats-card");
</script>

<template>
  <div :class="[ns.b(), ns.join('card-secondary'), 'flx-align-center']" :style="{ backgroundColor: backgroundColor }">
    <div
      v-if="icon"
      :class="[ns.e('icon'), 'flx-center']"
      :style="{ backgroundColor: iconBgColor, borderRadius: addUnit(iconBgRadius) }"
    >
      <Icon :icon="icon" :size="iconSize" :color="iconColor" />
    </div>

    <div :class="ns.e('content')">
      <p v-if="title || $slots['title']" :class="ns.e('title')" :style="{ color: textColor }">
        <slot name="title">{{ title }}</slot>
      </p>

      <CountTo v-if="count" :class="ns.e('count')" :end-val="count" :duration="1" />

      <p v-if="description || $slots['description']" :class="ns.e('description')" :style="{ color: textColor }">
        <slot name="description">{{ description }}</slot>
      </p>
    </div>
    <div v-if="showArrow" :class="ns.e('arrow')">
      <Icon :icon="ArrowRight" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
