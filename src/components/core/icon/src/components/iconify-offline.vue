<script setup lang="ts" name="IconifyOffline">
import type { IconifyIcon } from "@iconify/vue";
import { onMounted, useId } from "vue";
import { Icon, addIcon } from "@iconify/vue";

defineOptions({ name: "IconifyOffline" });

const props = defineProps<{ icon: IconifyIcon }>();

onMounted(() => {
  const id = useId();
  addIcon(`iconify-${id}`, props.icon as IconifyIcon);
});
</script>

<template>
  <Icon :icon :style="{ outline: 'none' }" v-bind="$attrs" />
</template>
