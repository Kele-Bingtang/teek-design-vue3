<script setup lang="ts">
import type { Message } from "../types";
import { ref, watch, nextTick } from "vue";
import ChatMessageItem from "./chat-message-item.vue";
import { useNamespace } from "@/composables/core/use-namespace";

const ns = useNamespace("chat-messages");

/** 组件 props 类型 */
interface ChatMessagesProps {
  messages: Message[];
}

const props = defineProps<ChatMessagesProps>();

/** 消息列表容器 DOM */
const messageContainer = ref<HTMLElement | null>(null);

/**
 * 监听消息变化自动滚动到底部
 */
watch(
  () => props.messages,
  async () => {
    await nextTick();
    if (messageContainer.value) messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  },
  { deep: true }
);
</script>

<template>
  <div :class="ns.b()" ref="messageContainer">
    <template v-for="(message, index) in messages" :key="index">
      <ChatMessageItem :message="message" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use "./styles/chat-messages";
</style>
