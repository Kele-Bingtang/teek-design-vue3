<script setup lang="ts" name="TimeLine">
import { markRaw } from "vue";
import { useFlicker } from "@/components";

const { lastBuildTime } = __APP_INFO__;
const activities = [
  {
    content: "支持圆点闪动",
    timestamp: lastBuildTime,
    icon: markRaw(useFlicker()),
  },
  {
    content: "支持方形闪动",
    timestamp: lastBuildTime,
    icon: markRaw(useFlicker({ borderRadius: 0, background: "#67C23A" })),
  },
  {
    content: "支持默认颜色",
    timestamp: lastBuildTime,
  },
  {
    content: "支持自定义颜色",
    timestamp: lastBuildTime,
    color: "#F56C6C",
  },
  {
    content: "支持自定义图标",
    timestamp: lastBuildTime,
    type: "primary",
    icon: "Loading",
  },
];
</script>

<template>
  <el-space fill>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="font-medium">时间线</span>
        </div>
      </template>
      <div style="display: flex">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :icon="activity.icon"
            :color="activity.color"
            :timestamp="activity.timestamp"
            :type="activity.type"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>

        <el-timeline class="pl-40">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :icon="activity.icon"
            :color="activity.color"
            :timestamp="activity.timestamp"
            placement="bottom"
            :type="activity.type"
          >
            <div class="message">
              teek-design-vue3 是基于 Vue3.x、TypeScript、Vite6、Pinia、Element-Plus 编写的一套后台管理系统
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
.message {
  position: relative;
  box-sizing: border-box;
  width: 200px;
  padding: 5px 12px;
  line-height: 18px;
  color: #ffffff;
  word-break: break-all;
  background-color: var(--#{$el-namespace}-color-primary);
  border-color: var(--#{$el-namespace}-color-primary);
  border-radius: 6px;
}

.message::after {
  position: absolute;
  top: 8px;
  left: -10px;
  width: 0;
  height: 0;
  overflow: hidden;
  content: "";
  border-color: var(--#{$el-namespace}-color-primary) transparent transparent;
  border-style: solid dashed dashed;
  border-width: 10px;
}
</style>
