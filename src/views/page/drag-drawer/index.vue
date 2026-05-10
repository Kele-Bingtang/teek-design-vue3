<script setup lang="ts" name="DragDrawerDemo">
import { ref } from "vue";
import { DragDrawer } from "@/components";
import { useNamespace } from "@/composables";

const ns = useNamespace("darg-drawer-demo");

const visible1 = ref(false);
const visible2 = ref(false);
const placement = ref("right");
const width1 = ref(200);
const width2 = ref(300);
const draggable = ref(true);

const handleResize = (event: any) => {
  const { atMin } = event;
  console.log(atMin);
};
</script>

<template>
  <el-space fill :class="ns.b()">
    <el-card shadow="never" class="tk-card-minimal">
      Element Plus v2.11.0 版本的抽屉组件(ElDrawer)已经支持拖拽大小功能，传入 resizable
      配置项即可开启，因此本功能不再维护。
    </el-card>
    <el-card shadow="never" class="tk-card-minimal">
      <div :class="ns.e('header')">
        <el-switch
          v-model="placement"
          active-text="右"
          inactive-text="左"
          active-value="right"
          inactive-value="left"
          :class="ns.em('header', 'switch')"
        ></el-switch>
        <el-switch v-model="draggable" active-text="是否可拖拽"></el-switch>
        <el-button @click="visible1 = true" type="primary" style="margin-left: 16px">打开容器内抽屉</el-button>
        <el-button @click="visible2 = true" type="primary" style="margin-left: 16px">打开全屏抽屉</el-button>
      </div>

      <div :class="ns.e('inner')">
        <DragDrawer
          v-model="visible1"
          :placement="placement"
          v-model:width="width1"
          :draggable="draggable"
          :inner="true"
          @on-resize="handleResize"
          title="我是标题"
        ></DragDrawer>
      </div>

      <DragDrawer
        v-model="visible2"
        :placement="placement"
        v-model:width="width2"
        :draggable="draggable"
        @on-resize="handleResize"
      >
        <template #header>
          <span>我是标题</span>
        </template>
      </DragDrawer>
    </el-card>

    <el-card shadow="never" class="tk-card-minimal">
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="v-model">是否打开抽屉。`boolean` 类型，默认为 `false`</el-descriptions-item>
        <el-descriptions-item label="v-model:width">
          抽屉初始化宽度。`string | number` 类型，默认为 `200`
        </el-descriptions-item>
        <el-descriptions-item label="placement">抽屉打开位置。`string` 类型，默认为 `"right"`</el-descriptions-item>
        <el-descriptions-item label="draggable">是否开启拖拽功能。`boolean` 类型，默认为 `false`</el-descriptions-item>
        <el-descriptions-item label="minWidth">抽屉最小宽度。`string | number` 类型，默认为 `200`</el-descriptions-item>
        <el-descriptions-item label="inner">是否在容器内使用抽屉。`boolean` 类型，默认为 `false`</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never" class="tk-card-minimal">
      <el-descriptions title="Emits 事件 📚" :column="1" border>
        <el-descriptions-item label="onResizeStart">拖拽启动事件。`() => void` 类型</el-descriptions-item>
        <el-descriptions-item label="onResize">拖拽过程事件。`(event: MouseEvent) => void` 类型</el-descriptions-item>
        <el-descriptions-item label="onResizeEnd">拖拽结束事件。`() => void` 类型</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(darg-drawer-demo) {
  @include e(header) {
    margin-bottom: 30px;

    @include m(switch) {
      margin-right: 30px;
    }
  }

  @include e(inner) {
    position: relative;
    width: 500px;
    height: 400px;
    background: cssVarEl(color-primary);
    border: 1px solid cssVarEl(color-primary);

    :deep(.#{$el-namespace}-overlay) {
      position: absolute;
    }
  }
}
</style>
