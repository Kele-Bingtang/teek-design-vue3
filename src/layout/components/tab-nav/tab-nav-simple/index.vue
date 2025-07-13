<script setup lang="ts">
import { computed } from "vue";
import { useSettingStore } from "@/pinia";
import ClassicTabNav from "../tab-nav-classic/index.vue";

defineOptions({ name: "SimpleTabNav" });

const settingStore = useSettingStore();

const type = computed(() => settingStore.tabNavMode as "simple" | "classic");
</script>

<template>
  <ClassicTabNav :type />
</template>
