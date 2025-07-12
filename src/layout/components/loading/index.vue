<script setup lang="ts">
import { useNamespace } from "@/composables";

defineOptions({ name: "Loading" });

const ns = useNamespace("layout-loading");
</script>

<template>
  <div :class="ns.b()" class="flx-column-center">
    <div :class="ns.e('wrap')">
      <span class="dot dot-spin">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
