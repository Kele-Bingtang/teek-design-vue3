<script setup lang="ts" name="ErrorLog">
import { useErrorLogStore, type ErrorLog } from "@/pinia";
import { computed, onActivated, onMounted, reactive, ref } from "vue";

const errorStore = useErrorLogStore();
const dialogErrorStackVisible = ref(false);

let clickCurrentRow = reactive<ErrorLog>({
  error: undefined,
  info: "",
  url: "",
  hasRead: false,
});

const errorLogs = computed(() => errorStore.errorLogs);

onMounted(() => {
  errorStore.setHasReadErrorLogsStatus(true);
});

onActivated(() => {
  errorStore.setHasReadErrorLogsStatus(true);
});

const getViewTime = (timestamp: number | undefined) => {
  if (!timestamp) {
    return;
  }
  const date = new Date(timestamp);
  const Y = date.getFullYear();
  const M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  const D = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
};

const clearAll = () => {
  errorStore.clearErrorLog();
};

const handleClick = (row: ErrorLog) => {
  clickCurrentRow = row;
  dialogErrorStackVisible.value = true;
};

const handleDelete = (row: ErrorLog) => {
  errorStore.deleteOneErrorLog(row);
};
const addErrorLog = () => {
  const letters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const errorMessage = letter + " is not undefined";
  throw new Error(errorMessage);
};
</script>

<template>
  <div class="error-log-container">
    <el-alert
      title="注意：页面错误日志不会在浏览器持久化存储，刷新页面即会丢失"
      description="如果你在本页面添加错误日志，那么右上角的红色文字不会变成 0，您需要离开该页面，再重新进入，才会将红色数字置为 0，代表已读"
      type="warning"
      :closable="false"
      style="margin-bottom: 10px"
    ></el-alert>
    <el-button type="primary" @click="addErrorLog" style="margin-bottom: 10px">添加一条错误日志</el-button>
    <el-popconfirm placement="right" title="您确定删除全部日志吗？" @confirm="clearAll">
      <template #reference>
        <el-button type="danger" :disabled="errorLogs.length === 0" style="margin-bottom: 10px">删除全部</el-button>
      </template>
    </el-popconfirm>
    <el-table :data="errorLogs" border>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="err.name" label="名字" width="220px"></el-table-column>
      <el-table-column prop="err.message" label="信息" width="280px"></el-table-column>
      <el-table-column prop="url" label="URL" width="380px"></el-table-column>
      <el-table-column prop="info" label="位置">
        <template #default="{ row }">
          <span v-if="row.vm && row.vm.$vnode">{{ row.vm.$vnode.tag }} error in {{ row.info }}</span>
          <span v-else>
            {{ row.info }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="时间" width="180px">
        <template #default="{ row }">
          {{ getViewTime(row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="190px">
        <template #default="{ row }">
          <el-button type="primary" @click="handleClick(row)">查看</el-button>
          <el-popconfirm title="您确定删除这个错误日志吗？" @confirm="handleDelete(row)">
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogErrorStackVisible" title="错误信息" width="50%" append-to-body>
      <el-table :data="[clickCurrentRow]" border>
        <el-table-column label="name" width="160px">
          <template #default="{ row }">
            {{ row.error.name }}
          </template>
        </el-table-column>
        <el-table-column label="message" width="160px">
          <template #default="{ row }">
            {{ row.error.message }}
          </template>
        </el-table-column>
        <el-table-column label="cause" width="160px">
          <template #default="{ row }">
            {{ row.error.cause }}
          </template>
        </el-table-column>
        <el-table-column label="stack">
          <template #default="{ row }">
            {{ row.error.stack }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
