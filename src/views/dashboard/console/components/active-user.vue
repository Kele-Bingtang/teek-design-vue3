<script setup lang="ts">
import { BarChart } from "@/components";
import { useNamespace } from "@/composables";

const ns = useNamespace();

const list = [
  { name: "总用户量", num: "32k" },
  { name: "总访问量", num: "128k" },
  { name: "日访问量", num: "1.2k" },
  { name: "周同比", num: "+5%" },
];
</script>

<template>
  <div class="tk-card-minimal active-user-card">
    <BarChart
      class="chart"
      barWidth="50%"
      height="13.7rem"
      :showAxisLine="false"
      :data="[160, 100, 150, 80, 190, 100, 175, 120, 160]"
      :xAxisData="['1', '2', '3', '4', '5', '6', '7', '8', '9']"
    />
    <div class="text">
      <h3 class="box-title">用户概述</h3>
      <p class="subtitle">
        比上周
        <span :class="ns.join('text-success')">+23%</span>
      </p>
      <p class="subtitle">我们为您创建了多个选项，可将它们组合在一起并定制为像素完美的页面</p>
    </div>
    <div class="list flx-align-center-between">
      <div v-for="(item, index) in list" :key="index">
        <p>{{ item.num }}</p>
        <p class="subtitle">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/function" as *;

.active-user-card {
  width: 100%;
  height: 420px;

  .chart {
    width: 100%;
    height: 220px;
    padding: 10px;
    border-radius: calc(cssVar(radius) / 2 + 4px) !important;
  }

  .text {
    margin-left: 3px;

    h3 {
      margin-top: 20px;
      font-size: 18px;
      font-weight: 500;
    }

    p {
      margin-top: 5px;
      font-size: 14px;

      &:last-of-type {
        height: 42px;
        margin-top: 5px;
      }
    }
  }

  .list {
    margin-left: 3px;

    > div {
      flex: 1;

      p {
        font-weight: 400;

        &:first-of-type {
          font-size: 24px;
          color: cssVar(text-gray-900);
        }

        &:last-of-type {
          font-size: 13px;
        }
      }
    }
  }
}

.dark {
  .card {
    .chart {
      background: none;
    }
  }
}

@media screen and (max-width: $device-phone) {
  .dark {
    .card {
      .chart {
        padding: 15px 0 0 !important;
      }
    }
  }
}
</style>
