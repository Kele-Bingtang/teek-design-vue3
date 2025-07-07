<script setup lang="ts" name="DraggableListDemo">
import { DraggableList } from "@/components";
import type { DragClass } from "@/components";
import { list1, list2 } from "@/mock/drag-list";
import { ArrowRight, ArrowLeft } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";

const ns = useNamespace("draggable-list-demo");

const listData1 = ref(list1);
const listData2 = ref(list2);

const dragClass: DragClass = {
  left: ["drag-box", "left-drag-box"],
  right: ["drag-box", "right-drag-box"],
};

const handleList = ref<string[]>([]);

const handleChange = ({ src, target, oldIndex, newIndex }: any) => {
  handleList.value.push(`${src} => ${target}, ${oldIndex} => ${newIndex}`);
};
</script>

<template>
  <el-space fill :class="ns.b()">
    <el-card>
      <div :class="ns.e('box')">
        <DraggableList :left-list="listData1" :right-list="listData2" :drag-class="dragClass" @on-change="handleChange">
          <template #leftTitle>
            <h3>待办事项</h3>
          </template>

          <template #left="{ item }">
            <el-card>
              {{ item.name }}
            </el-card>
          </template>
          <template #leftIcon>
            <el-icon :style="{ color: ns.cssVarEl('color-primary') }"><ArrowRight /></el-icon>
          </template>

          <template #rightTitle>
            <h3>完成事项</h3>
          </template>
          <template #right="{ item }">
            <el-card>
              {{ item.name }}
            </el-card>
          </template>
          <template #rightIcon>
            <el-icon :style="{ color: ns.cssVarEl('color-primary') }"><ArrowLeft /></el-icon>
          </template>
        </DraggableList>
      </div>

      <el-card :class="ns.e('handle')">
        <template #header>
          <span>操作记录</span>
        </template>
        <div>
          <p v-for="(item, index) in handleList" :key="`handle_item_${index}`">{{ item }}</p>
        </div>
      </el-card>
      <el-card :class="ns.em('handle', 'show')">
        <pre>{{ listData1 }}</pre>
      </el-card>
      <el-card :class="ns.em('handle', 'show')">
        <pre>{{ listData2 }}</pre>
      </el-card>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="leftList">左侧宽度侧数据。`DragList[]` 类型，默认为 `[]`</el-descriptions-item>
        <el-descriptions-item label="rightList">右侧数据。`DragList[]` 类型，默认为 `[]`</el-descriptions-item>
        <el-descriptions-item label="leftTitle">左侧标题。`string` 类型，默认为 `""`</el-descriptions-item>
        <el-descriptions-item label="rightTitle">有侧标题。`string` 类型，默认为 `""`</el-descriptions-item>
        <el-descriptions-item label="leftWidth">左侧宽度。`string` 类型，默认为 `"48%"`</el-descriptions-item>
        <el-descriptions-item label="rightWidth">右侧宽度。`string` 类型，默认为 `"48%"`</el-descriptions-item>
        <el-descriptions-item label="dragClass">
          拖拽元素 class。`{ left: string[]; right: string[]; }` 类型，默认为 `{ left: [], right: [] }`
        </el-descriptions-item>
        <el-descriptions-item label="animation">动画时间。`number` 类型，默认为 `200`</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="Emits 事件 📚" :column="1" border>
        <el-descriptions-item label="onChange">
          拖拽改变事件。`(value: { src: string; target: string; oldIndex: number; newIndex: number }) => void` 类型
        </el-descriptions-item>
        <el-descriptions-item label="itemClick">
          数据 Item 点击事件。`(id: string, type: string) => void` 类型
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(draggable-list-demo) {
  @include e(box) {
    display: inline-block;
    width: 40%;
    height: 100%;
  }

  @include e(handle) {
    display: inline-block;
    width: 220px;
    height: 100%;

    p {
      display: block;
      padding: 4px 0;
    }

    @include m(show) {
      display: inline-block;
      width: 370px;
    }
  }
}
</style>

<style lang="scss">
@use "@styles/mixins/bem" as *;

@include b(draggable-list-demo) {
  @include el-joins(card) {
    width: 100%;
    height: 100%;

    @include el-joins(card__body) {
      display: flex;
      gap: 10px;
    }
  }
}
</style>
