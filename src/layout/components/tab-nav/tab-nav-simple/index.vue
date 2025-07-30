<script setup lang="ts">
import { computed } from "vue";
import { useSettingStore } from "@/pinia";
import ClassicTabNav from "../tab-nav-classic/index.vue";

defineOptions({ name: "SimpleTabNav" });

const settingStore = useSettingStore();

const { tabNav } = storeToRefs(settingStore);

const type = computed(() => tabNav.value.elementMode as "simple" | "classic");
</script>

<template>
  <ClassicTabNav :type />
</template>
