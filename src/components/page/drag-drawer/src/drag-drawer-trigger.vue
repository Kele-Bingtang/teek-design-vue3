<script setup lang="ts">
defineOptions({ name: "DragDrawerTrigger" });
</script>

<template>
  <div class="drag-drawer-move-trigger">
    <div class="drag-drawer-move-trigger-point">
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.drag-drawer-move-trigger {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 100px;
  line-height: 100px;
  cursor: col-resize;
  background: rgb(243 243 243);
  border-radius: 4px / 6px;
  box-shadow: 0 0 1px 1px rgb(0 0 0 / 20%);
  transform: translate(-50%, -50%);

  .drag-drawer-move-trigger-point {
    display: inline-block;
    width: 50%;
    transform: translateX(50%);

    i {
      display: block;
      padding-bottom: 2px;
      border-bottom: 1px solid rgb(192 192 192);
    }
  }
}
</style>
