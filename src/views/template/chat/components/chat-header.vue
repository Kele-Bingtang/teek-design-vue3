<script setup lang="ts">
import type { Person } from "../types";
import { useNamespace } from "@/composables/core/use-namespace";

const ns = useNamespace("chat-header");

interface ChatHeaderProps {
  /** 用户信息 */
  person?: Person;
  /** 是否在线 */
  isOnline: boolean;
}

defineProps<ChatHeaderProps>();
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('left')">
      <span class="name">{{ person?.name || "Robot" }}</span>
      <div :class="ns.e('status')">
        <div :class="['dot', ns.is('online', isOnline)]" />
        <span :class="'text'">{{ isOnline ? "在线" : "离线" }}</span>
      </div>
    </div>

    <div :class="ns.e('right')">
      <div class="btn">
        <Icon icon="&#xe776;"></Icon>
      </div>
      <div class="btn">
        <Icon icon="&#xe778;"></Icon>
      </div>
      <div class="btn">
        <Icon icon="&#xe6df;"></Icon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./styles/chat-header";
</style>
