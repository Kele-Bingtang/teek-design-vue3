<script setup lang="ts" name="DynamicTable">
import FixedHeaderTable from "./fixedHeaderTable.vue";
import UnFixedHeaderTable from "./unFixedHeaderTable.vue";
</script>

<template>
  <div class="tk-card-minimal flx-column gap-10">
    <p>固定表头</p>
    <FixedHeaderTable />
    <p>不固定表头</p>
    <UnFixedHeaderTable />
  </div>
</template>
