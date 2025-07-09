<script setup lang="ts">
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { myAgentData } from "./data/my-agent";
import { myApplyData } from "./data/my-apply";
import { myDoneData } from "./data/my-done";
import { myFollowData } from "./data/my-follow";

export type FlowType = "myAgent" | "myApply" | "myDone" | "myFollow" | "";

const ns = useNamespace("flow");

const emit = defineEmits<{
  click: [type: FlowType];
}>();

const selectedType = ref<FlowType>();

const handleClick = (type: FlowType) => {
  if (selectedType.value !== type) selectedType.value = type;
  else selectedType.value = "";

  emit("click", selectedType.value);
};
</script>

<template>
  <div :class="ns.b()" class="tk-card-minimal pd-24 flx-align-center-between">
    <div
      class="box flx-column-center gap-10"
      :class="ns.is('active', selectedType === 'myAgent')"
      @click="handleClick('myAgent')"
    >
      <span class="count">{{ myAgentData.length }}</span>
      <div class="flx-align-center">
        我的代办
        <el-icon>
          <ArrowDown v-if="selectedType !== 'myAgent'" />
          <ArrowUp v-else />
        </el-icon>
      </div>
    </div>

    <div
      class="box flx-column-center gap-10"
      :class="ns.is('active', selectedType === 'myApply')"
      @click="handleClick('myApply')"
    >
      <span class="count">{{ myApplyData.length }}</span>
      <div class="flx-align-center">
        我的申请
        <el-icon>
          <ArrowDown v-if="selectedType !== 'myApply'" />
          <ArrowUp v-else />
        </el-icon>
      </div>
    </div>

    <div
      class="box flx-column-center gap-10"
      :class="ns.is('active', selectedType === 'myDone')"
      @click="handleClick('myDone')"
    >
      <span class="count">{{ myDoneData.length }}</span>
      <div class="flx-align-center">
        我的已办
        <el-icon>
          <ArrowDown v-if="selectedType !== 'myDone'" />
          <ArrowUp v-else />
        </el-icon>
      </div>
    </div>
    <div
      class="box flx-column-center gap-10"
      :class="ns.is('active', selectedType === 'myFollow')"
      @click="handleClick('myFollow')"
    >
      <span class="count">{{ myFollowData.length }}</span>
      <div class="flx-align-center">
        我的关注
        <el-icon>
          <ArrowDown v-if="selectedType !== 'myFollow'" />
          <ArrowUp v-else />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(flow) {
  height: 100%;

  .count {
    margin-left: -16px;
    font-size: 20px;
    font-weight: 600;
  }

  .box {
    cursor: pointer;

    &:hover {
      color: cssVar(color-primary);
    }

    @include is(active) {
      color: cssVar(color-primary);
    }
  }

  .el-icon {
    margin-left: 4px;
  }
}
</style>
