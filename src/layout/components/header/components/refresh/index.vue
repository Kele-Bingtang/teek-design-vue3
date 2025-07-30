<script setup lang="ts">
import { RefreshRight } from "@element-plus/icons-vue";
import { useNamespace, useMittBus } from "@/composables";

defineOptions({ name: "Refresh" });

const ns = useNamespace("refresh");
const { refreshPage, refreshIFrame } = useMittBus();

const route = useRoute();

const handleRefresh = () => {
  route.meta?.iframeSrc ? refreshIFrame() : refreshPage();
};
</script>

<template>
  <div :class="ns.b()" class="flx-center" @click.stop="handleRefresh">
    <Icon :icon="RefreshRight" />
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
