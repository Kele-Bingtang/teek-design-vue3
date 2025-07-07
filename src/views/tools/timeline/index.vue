<script setup lang="ts" name="TimeLine">
import { markRaw } from "vue";
import { useFlicker } from "./flicker";

const { lastBuildTime } = __APP_INFO__;
const activities: Recordable[] = [
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
  <el-card shadow="never" class="tk-card-minimal">
    <template #header>
      <span class="font-medium">时间线</span>
    </template>

    <div style="display: flex; gap: 20px">
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
            Teek Design Vue3 基于 Vue3、TypeScript、Vite、Pinia、Element-Plus 搭建的现代 Template 管理系统模板。
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.message {
  width: 300px;
  word-break: break-all;
}
</style>
