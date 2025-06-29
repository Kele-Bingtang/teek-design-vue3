<script setup lang="ts">
import {
  StatsCard,
  ProgressCard,
  LineChartCard,
  DonutChartCard,
  BarChartCard,
  DataListCard,
  TimelineListCard,
} from "@/components";
import { useNamespace } from "@/composables";

const ns = useNamespace();

const statsCards = [
  {
    id: 1,
    title: "销售产品",
    count: 1235,
    description: "鞋子、牛仔裤、派对服装、手表",
    icon: "&#xe812;",
    iconColor: ns.cssVar("primary"),
    iconSize: 20,
    iconBgColor: ns.cssVar("info"),
    textColor: ns.cssVar("primary"),
    backgroundColor: ns.cssVar("bg-primary"),
    showArrow: false,
  },
  {
    id: 2,
    title: "活跃用户",
    count: 5000,
    description: "日活跃用户超过5,000+",
    icon: "&#xe724;",
    iconColor: ns.cssVar("warning"),
    iconSize: 20,
    iconBgColor: ns.cssVar("success"),
    textColor: ns.cssVar("warning"),
    backgroundColor: ns.cssVar("bg-warning"),
    showArrow: false,
  },
  {
    id: 3,
    title: "总收入",
    count: 35000,
    description: "月收入超过¥350,000+",
    icon: "&#xe70e;",
    iconColor: ns.cssVar("secondary"),
    iconSize: 20,
    iconBgColor: ns.cssVar("secondary"),
    textColor: ns.cssVar("secondary"),
    backgroundColor: ns.cssVar("bg-secondary"),
    showArrow: false,
  },
  {
    id: 4,
    title: "客户评价",
    count: 4800,
    description: "平均评分4.8/5",
    icon: "&#xe82d;",
    iconColor: ns.cssVar("error"),
    iconSize: 20,
    iconBgColor: ns.cssVar("error"),
    textColor: ns.cssVar("error"),
    backgroundColor: ns.cssVar("bg-error"),
    showArrow: false,
  },
];

const progressCards = [
  {
    id: 1,
    title: "完成进度",
    percentage: 75,
    color: ns.cssVar("success"),
    icon: "&#xe812;",
    iconColor: ns.cssVar("success"),
    iconBgColor: ns.cssVar("bg-success"),
    iconSize: 20,
  },
  {
    id: 2,
    title: "项目进度",
    percentage: 65,
    color: ns.cssVar("primary"),
    icon: "&#xe724;",
    iconColor: ns.cssVar("primary"),
    iconBgColor: ns.cssVar("bg-primary"),
    iconSize: 20,
  },
  {
    id: 3,
    title: "学习进度",
    percentage: 45,
    color: ns.cssVar("error"),
    icon: "&#xe724;",
    iconColor: ns.cssVar("error"),
    iconBgColor: ns.cssVar("bg-error"),
    iconSize: 20,
  },
  {
    id: 4,
    title: "任务进度",
    percentage: 90,
    color: ns.cssVar("secondary"),
    icon: "&#xe724;",
    iconColor: ns.cssVar("secondary"),
    iconBgColor: ns.cssVar("bg-secondary"),
    iconSize: 20,
  },
];

const dataList = [
  {
    title: "新加坡之行",
    status: "进行中",
    time: "5分钟",
    class: ns.join("bg-primary"),
    icon: "&#xe6f2;",
  },
  {
    title: "归档数据",
    status: "进行中",
    time: "10分钟",
    class: ns.join("bg-secondary"),
    icon: "&#xe806;",
  },
  {
    title: "客户会议",
    status: "待处理",
    time: "15分钟",
    class: ns.join("bg-warning"),
    icon: "&#xe6fb;",
  },
  {
    title: "筛选任务团队",
    status: "进行中",
    time: "20分钟",
    class: ns.join("bg-danger"),
    icon: "&#xe813;",
  },
  {
    title: "发送信封给小王",
    status: "已完成",
    time: "20分钟",
    class: ns.join("bg-success"),
    icon: "&#xe70c;",
  },
];

const timelineData = [
  {
    time: "上午 09:30",
    status: "rgb(73, 190, 255)",
    content: "收到 John Doe 支付的 385.90 美元",
  },
  {
    time: "上午 10:00",
    status: "rgb(54, 158, 255)",
    content: "新销售记录",
    code: "ML-3467",
  },
  {
    time: "上午 12:00",
    status: "rgb(103, 232, 207)",
    content: "向 Michael 支付了 64.95 美元",
  },
  {
    time: "下午 14:30",
    status: "rgb(255, 193, 7)",
    content: "系统维护通知",
    code: "MT-2023",
  },
  {
    time: "下午 15:45",
    status: "rgb(255, 105, 105)",
    content: "紧急订单取消提醒",
    code: "OR-9876",
  },
  {
    time: "下午 17:00",
    status: "rgb(103, 232, 207)",
    content: "完成每日销售报表",
  },
];

const handleMore = () => {};
</script>

<template>
  <el-space fill :size="30" class="card">
    <div>
      <h1 class="page-title">统计卡片（文字）</h1>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="card in statsCards" :key="card.id">
          <StatsCard
            :icon="card.icon"
            :title="card.title"
            :description="card.description"
            :iconSize="card.iconSize"
            :iconBgRadius="8"
            iconColor="#fff"
            :iconBgColor="card.iconBgColor"
            :showArrow="card.showArrow"
          />
        </el-col>
      </el-row>
    </div>

    <div>
      <h1 class="page-title">统计卡片（数字滚动）</h1>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="card in statsCards" :key="card.id">
          <StatsCard
            :icon="card.icon"
            :count="card.count"
            :description="card.description"
            :iconSize="card.iconSize"
            iconColor="#fff"
            :iconBgColor="card.iconBgColor"
            :showArrow="card.showArrow"
          />
        </el-col>
      </el-row>
    </div>

    <div>
      <h1 class="page-title">统计卡片（自定义样式）</h1>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="card in statsCards" :key="card.id">
          <StatsCard
            :icon="card.icon"
            :title="card.title"
            :description="card.description"
            :iconColor="card.iconColor"
            :textColor="card.textColor"
            :backgroundColor="card.backgroundColor"
            :showArrow="card.showArrow"
          />
        </el-col>
      </el-row>
    </div>

    <div>
      <h1 class="page-title">进度卡片</h1>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="card in progressCards" :key="card.id">
          <ProgressCard :percentage="card.percentage" :title="card.title" :color="card.color" />
        </el-col>
      </el-row>

      <h1 class="page-title">进度卡片（icon）</h1>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="card in progressCards" :key="card.id">
          <ProgressCard
            :percentage="card.percentage"
            :title="card.title"
            :color="card.color"
            :icon="card.icon"
            :iconColor="card.iconColor"
            :iconBgColor="card.iconBgColor"
            :iconSize="card.iconSize"
            :iconBgRadius="8"
          />
        </el-col>
      </el-row>
    </div>

    <div>
      <h1 class="page-title">图表卡片（小图表）</h1>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <LineChartCard
            :isMiniChart="true"
            :value="2545"
            label="新用户"
            date="过去7天"
            :percentage="1.2"
            :height="9.5"
            :chartData="[120, 132, 101, 134, 90, 230, 210]"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <BarChartCard
            :isMiniChart="true"
            :value="15480"
            label="浏览量"
            date="过去 14 天"
            :percentage="-4.15"
            :height="9.5"
            :barWidth="'45%'"
            :chartData="[120, 100, 150, 140, 90, 120, 130]"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <LineChartCard
            :isMiniChart="true"
            :value="2545"
            label="粉丝数"
            date="过去 30 天"
            :percentage="1.2"
            :height="9.5"
            :showAreaColor="true"
            :chartData="[150, 180, 160, 200, 180, 220, 240]"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <DonutChartCard
            :value="36358"
            title="粉丝量"
            :percentage="18"
            percentageLabel="较去年"
            :data="[50, 40]"
            :height="9.5"
            currentValue="2022"
            previousValue="2021"
            :radius="['50%', '70%']"
          />
        </el-col>
      </el-row>
    </div>

    <div>
      <h1 class="page-title">图表卡片（大图表）</h1>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <LineChartCard
            :value="2545"
            label="新用户"
            :percentage="1.2"
            :height="11"
            :chartData="[120, 132, 101, 134, 90, 230, 210]"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <BarChartCard
            :value="15480"
            label="浏览量"
            :percentage="-4.15"
            :height="11"
            :chartData="[120, 100, 150, 140, 90, 120, 130, 110]"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <LineChartCard
            :value="2545"
            label="粉丝数"
            :percentage="1.2"
            :height="11"
            :showAreaColor="true"
            :chartData="[150, 180, 160, 200, 180, 220, 240]"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <DonutChartCard
            :value="36358"
            title="粉丝量"
            :percentage="-18"
            percentageLabel="较2021年"
            :data="[70, 30]"
            :height="11"
            currentValue="12月"
            previousValue="11月"
          />
        </el-col>
      </el-row>
    </div>

    <div>
      <h1 class="page-title">数据列表卡片</h1>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :lg="8">
          <DataListCard :list="dataList" title="待办事项" subtitle="今日待处理任务" />
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <DataListCard
            :maxCount="4"
            :list="dataList"
            title="最近活动"
            subtitle="近期活动列表"
            :showMoreButton="true"
            @more="handleMore"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <TimelineListCard :list="timelineData" title="最近交易" subtitle="2024年12月20日" />
        </el-col>
      </el-row>
    </div>
  </el-space>
</template>

<style lang="scss" scoped>
.card {
  .page-title {
    margin: 20px 0 15px;
    font-size: 22px;
    font-weight: 500;

    &:first-child {
      margin-top: 0;
    }
  }
}
</style>
