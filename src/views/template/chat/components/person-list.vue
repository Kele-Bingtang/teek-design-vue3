<script setup lang="ts">
import { ref } from "vue";
import PersonItem from "./person-item.vue";
import { useNamespace } from "@/composables/core/use-namespace";
import type { Person } from "../types";
const ns = useNamespace("chat-person-list");

interface PersonListProps {
  personList: Person[];
  selectedPerson: Person | null;
}

interface PersonListEmits {
  select: [person: Person];
}

const props = defineProps<PersonListProps>();
const emit = defineEmits<PersonListEmits>();

/** 搜索框内容 */
const searchQuery = ref("");
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('header')">
      <div :class="ns.e('user-info')">
        <el-avatar :size="50" :src="props.selectedPerson?.avatar" />
        <div :class="ns.e('user-details')">
          <div class="name">{{ props.selectedPerson?.name }}</div>
          <div class="email">{{ props.selectedPerson?.email }}</div>
        </div>
      </div>

      <div :class="ns.e('search-box')">
        <el-input v-model="searchQuery" placeholder="搜索联系人" prefix-icon="Search" clearable />
      </div>
      <slot name="dropdown" />
    </div>

    <el-scrollbar>
      <PersonItem
        v-for="item in props.personList"
        :key="item.id"
        :person="item"
        :active="props.selectedPerson?.id === item.id"
        @click="emit('select', item)"
      />
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
@use "./styles/chat-person-list";
</style>
