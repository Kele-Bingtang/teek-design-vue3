<script lang="ts" setup>
import { ref } from "vue";
import { ProTableTransfer } from "@/components";

const list = ref([
  { id: 1, tool: "TCL-ST3500", desc: "SVN登录认证" },
  { id: 2, tool: "TCL-ST3500", desc: "桌面云使用期蓝屏" },
  { id: 3, tool: "TCL-ST3500", desc: "WeLink 开会期间电" },
  { id: 4, tool: "TCL-ST3500", desc: "TC机内存不足" },
  { id: 5, tool: "TCL-ST3600", desc: "SVN登录认证1" },
  { id: 6, tool: "TCL-ST3700", desc: "SVN登录认证2" },
  { id: 7, tool: "TCL-ST3800", desc: "SVN登录认证3" },
  { id: 8, tool: "TCL-ST3900", desc: "SVN登录认证4" },
  { id: 9, tool: "TCL-ST4000", desc: "SVN登录认证5" },
  { id: 10, tool: "TCL-ST4100", desc: "SVN登录认证6" },
  { id: 11, tool: "TCL-ST4200", desc: "SVN登录认证7" },
  { id: 12, tool: "TCL-ST4300", desc: "SVN登录认证8" },
  { id: 13, tool: "TCL-ST4400", desc: "SVN登录认证9" },
  { id: 14, tool: "TCL-ST4500", desc: "SVN登录认证10" },
  { id: 15, tool: "TCL-ST4600", desc: "SVN登录认证11" },
  { id: 16, tool: "TCL-ST4700", desc: "SVN登录认证12" },
  { id: 17, tool: "TCL-ST4800", desc: "SVN登录认证13" },
  { id: 18, tool: "TCL-ST4900", desc: "SVN登录认证14" },
  { id: 19, tool: "TCL-ST5000", desc: "SVN登录认证15" },
  { id: 20, tool: "TCL-ST5100", desc: "SVN登录认证16" },
]);

const column = [
  { type: "selection", prop: "selection", fixed: "left", width: 60 },
  { prop: "tool", label: "Tool", width: 130 },
  { prop: "desc", label: "Ticket Desc" },
];

const value = ref([]);

const change = (data: any) => {
  console.log("select", data, value.value);
};

const filterMethod = (queryString: string, row: any) => {
  return row.desc.toLowerCase().includes(queryString.toLowerCase());
};
</script>

<template>
  <el-card shadow="never">
    <ProTableTransfer
      :data="list"
      tableHeight="406"
      v-model="value"
      :filterMethod="filterMethod"
      :column="column"
      @change="change"
    ></ProTableTransfer>
  </el-card>
</template>

<style lang="scss" scoped>
.icon-search {
  margin-bottom: 10px;
}
</style>
