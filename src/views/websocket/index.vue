<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { useWebSocketStore, SocketStatus } from "@/pinia/stores/websocket";

// 初始化 WebSocket Store
const webSocketStore = useWebSocketStore();

// 消息表单
const messageForm = ref({
  content: "",
});

// 消息历史记录
const messageHistory = ref<
  Array<{
    timestamp: string;
    type: string;
    content: string;
  }>
>([]);

// 连接 WebSocket
const connectWebSocket = () => {
  // 这里使用一个公共的 WebSocket 测试服务
  const url = "wss://echo.websocket.org";
  webSocketStore.connect(url);

  ElMessage.success("已尝试连接到 WebSocket 服务器");
};

// 断开 WebSocket 连接
const disconnectWebSocket = () => {
  webSocketStore.disconnect();
  ElMessage.info("已断开 WebSocket 连接");
};

// 发送消息
const sendMessage = () => {
  if (!messageForm.value.content) {
    ElMessage.warning("请输入消息内容");
    return;
  }

  webSocketStore.sendMessage(messageForm.value.content);

  // 添加到消息历史
  messageHistory.value.push({
    timestamp: new Date().toLocaleString(),
    type: "发送",
    content: messageForm.value.content,
  });

  messageForm.value.content = "";
};

// 清空消息记录
const clearMessages = () => {
  messageHistory.value = [];
};

// 获取状态标签类型
const getStatusTagType = () => {
  switch (webSocketStore.status) {
    case SocketStatus.Connected:
      return "success";
    case SocketStatus.Connecting:
      return "warning";
    case SocketStatus.Disconnected:
      return "danger";
    default:
      return "info";
  }
};

// 组件挂载时添加事件监听器
onMounted(() => {
  // 监听连接成功事件
  webSocketStore.addEventListener("open", () => {
    ElMessage.success("WebSocket 连接成功");

    messageHistory.value.push({
      timestamp: new Date().toLocaleString(),
      type: "系统",
      content: "WebSocket 连接已建立",
    });
  });

  // 监听消息事件
  webSocketStore.addEventListener<string>("message", data => {
    messageHistory.value.push({
      timestamp: new Date().toLocaleString(),
      type: "接收",
      content: data,
    });
  });

  // 监听连接关闭事件
  webSocketStore.addEventListener("close", () => {
    ElMessage.info("WebSocket 连接已关闭");

    messageHistory.value.push({
      timestamp: new Date().toLocaleString(),
      type: "系统",
      content: "WebSocket 连接已断开",
    });
  });

  // 监听错误事件
  webSocketStore.addEventListener("error", error => {
    ElMessage.error("WebSocket 连接发生错误");

    messageHistory.value.push({
      timestamp: new Date().toLocaleString(),
      type: "系统",
      content: `WebSocket 错误: ${JSON.stringify(error)}`,
    });
  });
});

// 组件卸载前移除事件监听器
onUnmounted(() => {
  // 可以在这里移除事件监听器（如果需要的话）
  // webSocketStore.removeEventListener('open', handler)
});
</script>

<template>
  <div class="websocket-demo">
    <el-card class="mb-3 tk-card-minimal">
      <template #header>
        <div class="card-header">
          <span>WebSocket 连接状态</span>
        </div>
      </template>
      <div class="connection-status">
        <el-tag :type="getStatusTagType()">{{ webSocketStore.status }}</el-tag>
        <el-button
          class="ml-3"
          type="primary"
          :disabled="webSocketStore.status === SocketStatus.Connected"
          @click="connectWebSocket"
        >
          连接
        </el-button>
        <el-button
          class="ml-2"
          type="danger"
          :disabled="webSocketStore.status !== SocketStatus.Connected"
          @click="disconnectWebSocket"
        >
          断开
        </el-button>
      </div>
    </el-card>

    <el-card class="mb-3 tk-card-minimal">
      <template #header>
        <div class="card-header">
          <span>发送消息</span>
        </div>
      </template>
      <el-form :model="messageForm" label-width="80px">
        <el-form-item label="消息内容">
          <el-input v-model="messageForm.content" placeholder="请输入要发送的消息" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="tk-card-minimal">
      <template #header>
        <div class="card-header">
          <span>消息记录</span>
        </div>
      </template>
      <el-table :data="messageHistory" style="width: 100%" max-height="400">
        <el-table-column prop="timestamp" label="时间" width="180" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="content" label="内容" />
      </el-table>
      <div class="mt-3 text-right">
        <el-button @click="clearMessages">清空记录</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@use "./shared";

.websocket-demo {
  .connection-status {
    display: flex;
    align-items: center;
  }
}
</style>
