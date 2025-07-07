<script setup lang="ts" name="ProfileTimeline">
import { Loading, SuccessFilled } from "@element-plus/icons-vue";

const timeline = [
  {
    timestamp: "2023/7/18",
    title: "一年工作",
    content: "不知不觉已经工作了一年，有酸甜苦辣，加油。",
    icon: Loading,
  },
  {
    timestamp: "2022/10/01",
    title: "学习编程 ing...",
    content: "参考了很多网站，研究大佬们优雅的代码，慢慢提升自己的技术。",
    icon: SuccessFilled,
  },
  {
    timestamp: "2022/07/18",
    title: "南方我又回来了",
    content: "北京还是太冷，我在公司园区的绿荫下，和朋友选择深圳。",
    icon: SuccessFilled,
  },
  {
    timestamp: "2022/06/30",
    title: "大学毕业，新梦的起点",
    content: "讨厌的毕业终究还是来临了，很多美好的记忆随风飘向北京。",
    icon: SuccessFilled,
  },
  {
    timestamp: "2018/09/08",
    title: "大学时代，梦的起点",
    content: "期待的大学生活，也许给我不一样的起点和更为广阔的终点。",
    icon: SuccessFilled,
  },
];
</script>

<template>
  <div class="timeline-container">
    <el-timeline reverse>
      <el-timeline-item
        v-for="(item, index) of timeline"
        :key="index"
        :timestamp="item.timestamp"
        :icon="item.icon"
        size="large"
        type="primary"
        placement="top"
      >
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<style lang="scss">
.timeline-container {
  padding: 10px;

  .#{$el-namespace}-timeline-item:first-child {
    .#{$el-namespace}-timeline-item__icon {
      animation: rotating 2s linear infinite;
    }
  }
}
</style>
