<script setup lang="ts">
import { ref } from "vue";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { myAgentData } from "./data/my-agent";
import { myApplyData } from "./data/my-apply";
import { myDoneData } from "./data/my-done";
import { myFollowData } from "./data/my-follow";

export type FlowType = "myAgent" | "myApply" | "myDone" | "myFollow" | "";

interface FlowConfig {
  type: FlowType;
  label: string;
  data: Recordable[];
}

const ns = useNamespace("flow");

const emit = defineEmits<{
  click: [type: FlowType];
}>();

const selectedType = ref<FlowType>();

// 配置化数据，便于维护和扩展
const flowConfig = ref<FlowConfig[]>([
  { type: "myAgent", label: "我的代办", data: myAgentData },
  { type: "myApply", label: "我的申请", data: myApplyData },
  { type: "myDone", label: "我的已办", data: myDoneData },
  { type: "myFollow", label: "我的关注", data: myFollowData },
]);

const handleClick = (type: FlowType) => {
  if (selectedType.value !== type) selectedType.value = type;
  else selectedType.value = "";

  emit("click", selectedType.value);
};
</script>

<template>
  <div :class="ns.b()" class="tk-card-minimal pd-24 flx-align-center-between">
    <div
      v-for="item in flowConfig"
      :key="item.type"
      class="box"
      :class="ns.is('active', selectedType === item.type)"
      @click="handleClick(item.type)"
    >
      <div class="flx-column-center gap-10">
        <span class="count">{{ item.data.length }}</span>
        <div class="flx-align-center">{{ item.label }}</div>
      </div>
      <el-icon>
        <ArrowDown v-if="selectedType !== item.type" />
        <ArrowUp v-else />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(flow) {
  height: 100%;

  .count {
    font-size: 20px;
    font-weight: 600;
  }

  .box {
    display: flex;
    align-items: flex-end;
    cursor: pointer;

    &:hover {
      color: cssVar(color-primary);
    }

    @include is(active) {
      color: cssVar(color-primary);
    }

    .#{$el-namespace}-icon {
      margin-left: 4px;
    }
  }
}
</style>
