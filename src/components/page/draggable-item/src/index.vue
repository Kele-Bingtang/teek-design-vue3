<script setup lang="ts">
import Draggable from "vuedraggable";
import { useNamespace } from "@/composables";

defineOptions({ name: "DraggableItem" });

const ns = useNamespace("drag-item");

export interface DragItemList {
  id: string;
  name: string;
}

interface DraggableItemProps {
  title?: string; // 标题
  list?: DragItemList[]; // 数据列表
  titleBgColor?: string; // 标题背景色
  titleClass?: string; // 标题元素 class
  dragClass?: string; // 拖拽元素 class
}

withDefaults(defineProps<DraggableItemProps>(), {
  title: "header",
  list: () => [],
  titleBgColor: "",
  titleClass: "",
  dragClass: "",
});
</script>

<template>
  <div :class="ns.b()">
    <div :class="`${ns.e('header')} ${titleClass}`" :style="{ backgroundColor: titleBgColor }">
      <slot name="title">{{ title }}</slot>
    </div>
    <draggable :list="list" v-bind="$attrs" :class="`${ns.e('content')} ${dragClass}`" itemKey="id">
      <template #item="{ element }">
        <div :class="ns.em('content', 'item')">
          <slot name="content" :item="element">{{ element }}</slot>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(drag-item) {
  min-width: 300px;
  height: auto;
  min-height: 100px;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;

  @include e(header) {
    height: 50px;
    padding: 0 20px;
    overflow: hidden;
    line-height: 50px;
    color: #ffffff;
    text-align: center;
    background: #333333;
    border-radius: 3px 3px 0 0;
  }

  @include e(content) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: auto;
    min-height: 60px;
    overflow: hidden;
    border: 10px solid transparent;

    @include m(item) {
      box-sizing: border-box;
      width: 100%;
      height: 64px;
      padding: 5px 10px;
      margin: 5px 0;
      line-height: 54px;
      text-align: left;
      cursor: pointer;
      background-color: #ffffff;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 20%);
    }
  }
}
</style>
