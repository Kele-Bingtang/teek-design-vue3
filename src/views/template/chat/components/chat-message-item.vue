<script setup lang="ts">
import { useNamespace } from "@/composables";

const ns = useNamespace("chat-message-item");

interface ChatMessageItemProps {
  message: Recordable;
}

defineProps<ChatMessageItemProps>();
</script>

<template>
  <div :class="[ns.b(), ns.is(message?.isMe ? 'right' : 'left')]">
    <el-avatar :size="32" :src="message?.avatar" :class="ns.e('avatar')" />

    <div :class="ns.e('content')">
      <div :class="ns.e('info')">
        <span class="sender">{{ message?.sender }}</span>
        <span class="time">{{ message?.time }}</span>
      </div>
      <div class="text">{{ message?.content }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./styles/chat-message-item";
</style>
