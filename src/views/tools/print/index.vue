<script setup lang="ts" name="Print">
import { Print } from "@/common/utils";
import ChartLine from "@/views/dashboard/console/index.vue";
import { simpleData } from "@/mock/table";

const value = ref("1");

const options = [
  {
    value: "1",
    el: ".el-table",
    label: "Table",
  },
  {
    value: "2",
    el: ".echart",
    label: "Echart",
  },
  {
    value: "3",
    el: ".img",
    label: "Image",
  },
];

function onPrint() {
  const el = options.filter(v => v.value === value.value)[0]?.el;
  Print(el).toPrint;
}

const tableData = ref(simpleData);
</script>

<template>
  <el-space fill>
    <el-card shadow="never" class="print-container">
      <template #header>
        <div class="card-header">
          <span>打印功能（报表、图表、图片）</span>
          <div>
            <el-select v-model="value" class="m-2" placeholder="Select" size="small" style="width: 100px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button size="small" type="primary" @click="onPrint">打印</el-button>
          </div>
        </div>
      </template>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <p>Table</p>
          <el-table border :data="tableData" class="el-table">
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="title" min-width="250px" label="标题"></el-table-column>
          </el-table>
        </el-col>

        <el-divider />

        <el-col :xs="17" :sm="17" :md="17" :lg="17" :xl="17">
          <p>Echart</p>
          <ChartLine class="echart" />
        </el-col>

        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <p>Image</p>
          <img src="https://cdn.jsdelivr.net/gh/Kele-Bingtang/static/user/avatar1.png" alt="avatars" class="img" />
        </el-col>
      </el-row>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
.print-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .img {
    width: 300px;
    height: 300px;
  }
}
</style>
