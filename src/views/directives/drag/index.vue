<script setup lang="ts" name="Drag"></script>

<template>
  <div class="drag-container">
    <h2>拖拽指令</h2>
    <p>在标签上加 v-draggable，就可以对该标签进行拖拽，只能加在基础标签，自定义标签不支持</p>
    <div v-draggable class="drag-box">我可以拖拽哦~</div>
  </div>
</template>

<style lang="scss" scoped>
.drag-container {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 10px 12px;
  background-color: #ffffff;

  .drag-box {
    position: absolute;
    top: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 300px;
    font-size: 23px;
    font-weight: bold;
    color: cssVarEl(color-primary-light-3);
    background: cssVarEl(color-primary-light-9);
    border-radius: 50%;
  }
}
</style>
