<script setup lang="ts" name="seamlessScroll">
import { SeamlessScroll } from "@/components";

const scroll = useTemplateRef("scroll");

const listData = ref([
  {
    title: "无缝滚动第一行无缝滚动第一行！！！！！！！！！！",
  },
  {
    title: "无缝滚动第二行无缝滚动第二行！！！！！！！！！！",
  },
  {
    title: "无缝滚动第三行无缝滚动第三行！！！！！！！！！！",
  },
  {
    title: "无缝滚动第四行无缝滚动第四行！！！！！！！！！！",
  },
  {
    title: "无缝滚动第五行无缝滚动第五行！！！！！！！！！！",
  },
  {
    title: "无缝滚动第六行无缝滚动第六行！！！！！！！！！！",
  },
  {
    title: "无缝滚动第七行无缝滚动第七行！！！！！！！！！！",
  },
  {
    title: "无缝滚动第八行无缝滚动第八行！！！！！！！！！！",
  },
  {
    title: "无缝滚动第九行无缝滚动第九行！！！！！！！！！！",
  },
]);

const classOption = reactive({
  direction: "top",
});

function changeDirection(val: string) {
  (scroll.value as any).reset();
  classOption.direction = val;
}
</script>

<template>
  <el-space fill>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>无缝滚动示例</span>
          <el-button class="button" link type="primary" @click="changeDirection('top')">
            <span :style="{ color: classOption.direction === 'top' ? 'red' : '' }">向上滚动</span>
          </el-button>
          <el-button class="button" link type="primary" @click="changeDirection('bottom')">
            <span
              :style="{
                color: classOption.direction === 'bottom' ? 'red' : '',
              }"
            >
              向下滚动
            </span>
          </el-button>
          <el-button class="button" link type="primary" @click="changeDirection('left')">
            <span :style="{ color: classOption.direction === 'left' ? 'red' : '' }">向左滚动</span>
          </el-button>
          <el-button class="button" link type="primary" @click="changeDirection('right')">
            <span :style="{ color: classOption.direction === 'right' ? 'red' : '' }">向右滚动</span>
          </el-button>
        </div>
      </template>
      <SeamlessScroll ref="scroll" :data="listData" :class-option="classOption" class="warp">
        <ul class="item">
          <li v-for="(item, index) in listData" :key="index">
            <span class="title" v-text="item.title" />
          </li>
        </ul>
      </SeamlessScroll>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="data">滚动数据。`any[]` 类型，默认为 `undefined`</el-descriptions-item>
        <el-descriptions-item label="classOption">滚动配置。`ClassOption` 类型，必穿</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="ClassOption 配置项 📚" :column="1" border>
        <el-descriptions-item label="key">ref key。`number` 类型，默认为 `undefined`</el-descriptions-item>
        <el-descriptions-item label="step">步长。`number` 类型，默认为 `1`</el-descriptions-item>
        <el-descriptions-item label="limitMoveNum">
          启动无缝滚动最小数据数。`number` 类型，默认为 `5`
        </el-descriptions-item>
        <el-descriptions-item label="hoverStop">
          是否启用鼠标 hover 控制。`boolean` 类型，默认为 `true`
        </el-descriptions-item>
        <el-descriptions-item label="direction">
          bottom 往下 top 往上(默认) left 向左 right 向右。`string` 类型，默认为 `"top"`
        </el-descriptions-item>
        <el-descriptions-item label="singleHeight">
          单条数据高度有值 hoverStop 关闭。`number` 类型，默认为 `0`
        </el-descriptions-item>
        <el-descriptions-item label="singleWidth">
          单条数据宽度有值 hoverStop 关闭。`number` 类型，默认为 `0`
        </el-descriptions-item>
        <el-descriptions-item label="waitTime">单步停止等待时间。`number` 类型，默认为 `1000`</el-descriptions-item>
        <el-descriptions-item label="switchOffset">偏移量。`number` 类型，默认为 `30`</el-descriptions-item>
        <el-descriptions-item label="autoPlay">是否自动播放。`boolean` 类型，默认为 `true`</el-descriptions-item>
        <el-descriptions-item label="navigation">是否暂停播放。`boolean` 类型，默认为 `false`</el-descriptions-item>
        <el-descriptions-item label="switchSingleStep">单步距离。`number` 类型，默认为 `134`</el-descriptions-item>
        <el-descriptions-item label="switchDelay">切换模式延迟。`number` 类型，默认为 `400`</el-descriptions-item>
        <el-descriptions-item label="switchDisabledClass">
          滚动元素的 class。`string` 类型，默认为 `"disabled"`
        </el-descriptions-item>
        <el-descriptions-item label="isSingleRemUnit">
          singleWidth/singleHeight 是否开启 rem 度量。`boolean` 类型，默认为 `false`
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="Emits 事件 📚" :column="1" border>
        <el-descriptions-item label="scrollEnd">滚动结束事件。`() => void` 类型</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
.card-header {
  display: flex;
  align-items: center;

  span {
    margin-right: 20px;
  }
}

.warp {
  width: 360px;
  height: 270px;
  margin: 0 auto;
  overflow: hidden;

  ul {
    padding: 0;
    margin: 0 auto;
    list-style: none;

    li,
    a {
      display: flex;
      justify-content: space-between;
      height: 30px;
      font-size: 15px;
      line-height: 30px;
    }
  }
}
</style>
