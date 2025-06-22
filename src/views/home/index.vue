<script setup lang="ts" name="Home">
import { ElRow, ElCol, ElCard } from "element-plus";
import CardItem from "./components/card-item.vue";
import { CountTo } from "@/components";
import ChartPie from "./components/chart-pie.vue";
import ChartBar from "./components/chart-bar.vue";
import ChartLineBar from "./components/chart-line-bar.vue";
import ChartLine from "./components/chart-line.vue";
import { Avatar, UserFilled, Share, Comment } from "@element-plus/icons-vue";

const cardInfo = [
  { title: "访问人数", icon: Avatar, count: 1803, color: "#2d8cf0" },
  { title: "累计用户", icon: UserFilled, count: 232, color: "#19be6b" },
  { title: "分享统计", icon: Share, count: 657, color: "#ed3f14" },
  { title: "消息数量", icon: Comment, count: 12, color: "#E46CBB" },
];

const pieData = [
  { name: "直接访问", value: 335 },
  { name: "邮件营销", value: 310 },
  { name: "联盟广告", value: 234 },
  { name: "视频广告", value: 135 },
  { name: "搜索引擎", value: 1548 },
];

const barData = [
  { title: "搜索引擎", data: [862, 1018, 964, 1026, 1679, 1600, 1570] },
  { title: "百度", data: [620, 732, 701, 734, 1090, 1130, 1120] },
  { title: "谷歌", data: [120, 132, 101, 134, 290, 230, 220] },
  { title: "Bing", data: [60, 72, 71, 74, 190, 130, 110] },
  { title: "其他", data: [62, 82, 91, 84, 109, 110, 120] },
];

const lineBarData = [
  { category: "2022-10-01", lineData: "200", barData: "150", lineName: "访问量", barName: "用户量" },
  { category: "2022-10-02", lineData: "585", barData: "341", lineName: "访问量", barName: "用户量" },
  { category: "2022-10-03", lineData: "476", barData: "330", lineName: "访问量", barName: "用户量" },
  { category: "2022-10-04", lineData: "346", barData: "340", lineName: "访问量", barName: "用户量" },
  { category: "2022-10-05", lineData: "498", barData: "197", lineName: "访问量", barName: "用户量" },
  { category: "2022-10-06", lineData: "579", barData: "546", lineName: "访问量", barName: "用户量" },
  { category: "2022-10-07", lineData: "361", barData: "160", lineName: "访问量", barName: "用户量" },
];
</script>

<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :xs="12" :sm="12" :md="8" :lg="6" v-for="(info, i) in cardInfo" :key="`info-${i}`" class="card-col">
        <CardItem shadow="hover" :icon="info.icon" :color="info.color" :icon-size="48">
          <div class="card-title">{{ info.title }}</div>
          <CountTo :start-val="0" :end-val="info.count" :duration="2.7" class="count-style" />
        </CardItem>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :lg="8" class="chart-col">
        <el-card>
          <ChartPie :data="pieData" title="用户访问来源" subTitle="统计" />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="8" class="chart-col">
        <el-card>
          <ChartBar :data="barData" />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="8" class="chart-col">
        <el-card>
          <ChartLineBar :data="lineBarData" />
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-card>
        <ChartLine />
      </el-card>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;

.home-container {
  @include el-joins(card) {
    width: 100%;
  }

  .card-col {
    margin-bottom: 20px;

    .card-title {
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: bold;
      color: rgb(0 0 0 / 45%);
    }

    .count-style {
      font-size: 36px;
      font-weight: bold;
    }
  }

  .chart-col {
    margin-bottom: 20px;
  }
}
</style>
