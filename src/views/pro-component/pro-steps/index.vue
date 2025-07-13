<script lang="ts" setup>
import { ProSteps } from "@/components";

const data: any = [
  { title: "已完成", description: "这是一段较长的描述", status: "success", width: 200 },
  { title: "驳回", description: "这是一段较长的描述", status: "error", width: 200 },
  { title: "未开始", description: "这是一段较长的描述", status: "wait", width: 200 },
];
</script>

<template>
  <el-card shadow="never">
    <p>横向</p>
    <div class="flex-center">
      <div style="width: 600px">
        <ProSteps :type="'basic'" :data="data"></ProSteps>
      </div>
    </div>
    <p style="margin-top: 100px">竖向</p>
    <div style="margin-left: 50px">
      <ProSteps :type="'column'" :data="data"></ProSteps>
    </div>
    <p>点状式</p>
    <div class="flex-center">
      <div style="width: 600px">
        <ProSteps :type="'dotted-row'" :data="data"></ProSteps>
      </div>
    </div>
    <p style="margin-top: 150px">箭头式</p>
    <!-- <ArrowSteps style="margin-left: 120px" :type="'dotted-row'" :data="data"></ArrowSteps> -->
  </el-card>
</template>
