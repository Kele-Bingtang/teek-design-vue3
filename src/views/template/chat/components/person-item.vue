<script setup lang="ts">
import type { Person } from "../types";
import { useNamespace } from "@/composables";

const ns = useNamespace("chat-person-item");

interface PersonItemProps {
  person: Person;
  active: boolean;
}

interface PersonItemEmits {
  click: [person: Person];
}

defineProps<PersonItemProps>();

const emit = defineEmits<PersonItemEmits>();
</script>

<template>
  <div :class="[ns.b(), ns.is('active', active)]" @click="emit('click', person)">
    <div :class="ns.e('avatar-wrapper')">
      <el-avatar :size="40" :src="person.avatar">
        {{ person.name.charAt(0) }}
      </el-avatar>
      <div :class="[ns.e('status-dot'), ns.is('online', person.online)]" />
    </div>
    <div :class="ns.e('info')">
      <div :class="ns.e('info-top')">
        <span class="name">{{ person.name }}</span>
        <span class="last-time">{{ person.lastTime }}</span>
      </div>
      <div :class="ns.e('info-bottom')">
        <span class="email">{{ person.email }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./styles/chat-person-item";
</style>
