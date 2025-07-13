<script setup lang="ts">
import { Picture, Paperclip } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";

const ns = useNamespace("chat-input");

interface ChatInputEmits {
  send: [value: string];
}

const emit = defineEmits<ChatInputEmits>();

/** v-model 绑定 */
const modelValue = defineModel<string>({ default: "" });

/**
 * 发送消息
 */
const handleSend = () => {
  if (!modelValue.value.trim()) return;
  emit("send", modelValue.value.trim());
};
</script>

<template>
  <div :class="ns.b()">
    <el-input
      v-model="modelValue"
      type="textarea"
      :rows="3"
      placeholder="输入消息"
      resize="none"
      @keyup.enter.prevent="handleSend"
    >
      <template #append>
        <div :class="ns.e('actions')">
          <el-button :icon="Paperclip" circle plain />
          <el-button :icon="Picture" circle plain />
          <el-button type="primary" @click="handleSend" v-waves>发送</el-button>
        </div>
      </template>
    </el-input>

    <div :class="ns.e('input-actions')">
      <div :class="ns.e('left')">
        <i class="iconfont-sys">&#xe634;</i>
        <i class="iconfont-sys">&#xe809;</i>
      </div>
      <el-button type="primary" @click="handleSend" v-waves>发送</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./styles/chat-input";
</style>
