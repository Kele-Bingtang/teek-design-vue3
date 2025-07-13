<script setup lang="ts" name="ErrorLog">
import { computed, reactive, ref } from "vue";
import { ProDialog } from "@/components";
import { useNamespace } from "@/composables";
import { useErrorLogStore, type ErrorLog } from "@/pinia";

const ns = useNamespace("error-log");

const errorStore = useErrorLogStore();
const dialogErrorStackVisible = ref(false);

let clickCurrentRow = reactive<ErrorLog>({
  id: "",
  error: undefined,
  info: "",
  url: "",
  hasRead: false,
});

const errorLogs = computed(() => errorStore.errorLogs);

const getViewTime = (timestamp: number | undefined) => {
  if (!timestamp) return;

  const date = new Date(timestamp);
  const Y = date.getFullYear();
  const M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  const D = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
};

/**
 * 删除全部错误日志
 */
const clearAll = () => {
  errorStore.clearErrorLog();
};

/**
 * 查看一条错误日志
 */
const handleClick = (row: ErrorLog) => {
  clickCurrentRow = row;
  dialogErrorStackVisible.value = true;
  errorStore.readOneErrorLog(row.id);
};

/**
 * 删除一条错误日志
 */
const handleDelete = (row: ErrorLog) => {
  errorStore.deleteOneErrorLog(row);
};

/**
 * 添加一条错误日志
 */
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
  <div :class="[ns.b(), ns.join('card-minimal')]">
    <el-alert
      title="注意：错误日志不会在浏览器持久化存储，刷新页面即会丢失，如果需要，请在生产环境接入后端持久化存储"
      type="warning"
      :closable="false"
    ></el-alert>

    <div style="margin: 16px 0">
      <el-button type="success" @click="errorStore.readAllErrorLogs(true)">全部已读</el-button>
      <el-button type="primary" @click="addErrorLog">添加一条错误日志</el-button>

      <el-popconfirm placement="right" title="您确定删除全部日志吗？" @confirm="clearAll">
        <template #reference>
          <el-button type="danger" :disabled="errorLogs.length === 0">删除全部</el-button>
        </template>
      </el-popconfirm>
    </div>

    <el-table :data="errorLogs" border>
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="error.name" label="名字" width="220px"></el-table-column>
      <el-table-column prop="error.message" label="信息" width="280px"></el-table-column>
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
      <el-table-column prop="hasRead" label="状态" width="180px">
        <template #default="{ row }">
          <el-tag :type="row.hasRead ? 'success' : 'danger'">{{ row.hasRead ? "已读" : "未读" }}</el-tag>
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

    <ProDialog v-model="dialogErrorStackVisible" title="错误信息" width="70%" top="10vh">
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
    </ProDialog>
  </div>
</template>
