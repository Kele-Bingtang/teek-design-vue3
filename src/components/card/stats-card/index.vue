<!-- 统计卡片 -->
<script setup lang="ts">
import type { StatsCardProps } from "./types";
import { ArrowRight } from "@element-plus/icons-vue";
import { CountTo } from "@/components";
import { useNamespace } from "@/composables";

defineOptions({ name: "StatsCard" });

withDefaults(defineProps<StatsCardProps>(), {
  iconSize: 30,
  iconBgRadius: 50,
});

const ns = useNamespace("stats-card");
</script>

<template>
  <div :class="[ns.b(), ns.join('card-secondary')]" :style="{ backgroundColor: backgroundColor }">
    <div v-if="icon" :class="ns.e('icon')" :style="{ backgroundColor: iconBgColor, borderRadius: iconBgRadius + 'px' }">
      <Icon
        :icon="icon"
        :size="30"
        :style="{
          color: iconColor,
          fontSize: iconSize + 'px',
        }"
      />
    </div>

    <div :class="ns.e('content')">
      <p v-if="title" :class="ns.e('title')" :style="{ color: textColor }">
        {{ title }}
      </p>
      <CountTo v-if="count" :class="ns.e('count')" :endVal="count" :duration="1"></CountTo>
      <p v-if="description" :class="ns.e('description')" :style="{ color: textColor }">{{ description }}</p>
    </div>
    <div v-if="showArrow" :class="ns.e('arrow')">
      <Icon :icon="ArrowRight" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
