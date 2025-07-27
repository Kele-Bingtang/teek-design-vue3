<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { useWebSocketStore, SocketStatus } from "@/pinia/stores/websocket";

// 初始化 WebSocket Store
const webSocketStore = useWebSocketStore();

// 连接URL
const connectionUrl = ref("wss://echo.websocket.org");

// 活动标签页
const activeTab = ref("normal");

// 普通消息表单
const normalMessageForm = ref({
  content: "",
});

// 重要消息表单
const importantMessageForm = ref({
  content: "",
  timeout: 5000,
});

// 消息列表
const messageList = ref<
  Array<{
    timestamp: string;
    type: "info" | "success" | "warning" | "error" | "sent" | "received";
    content: string;
  }>
>([]);

// 重连计数
const reconnectCount = ref(0);

// 发送消息计数
const sentMessageCount = ref(0);

// 接收消息计数
const receivedMessageCount = ref(0);

// 连接WebSocket
const connectWebSocket = () => {
  if (!connectionUrl.value) {
    ElMessage.warning("请输入 WebSocket 服务器地址");
    return;
  }

  webSocketStore.connect(connectionUrl.value);
  ElMessage.success("已尝试连接到 WebSocket 服务器");
};

// 断开WebSocket连接
const disconnectWebSocket = () => {
  webSocketStore.disconnect();
  ElMessage.info("已断开 WebSocket 连接");
};

// 发送普通消息
const sendNormalMessage = () => {
  if (!normalMessageForm.value.content) {
    ElMessage.warning("请输入消息内容");
    return;
  }

  webSocketStore.sendMessage(normalMessageForm.value.content);

  messageList.value.push({
    timestamp: new Date().toLocaleTimeString(),
    type: "sent",
    content: normalMessageForm.value.content,
  });

  sentMessageCount.value++;
  normalMessageForm.value.content = "";
};

// 发送重要消息（模拟确认机制）
const sendImportantMessage = async () => {
  if (!importantMessageForm.value.content) {
    ElMessage.warning("请输入消息内容");
    return;
  }

  // 在实际应用中，这里会调用一个带有确认机制的方法
  ElMessage.info(`发送重要消息: ${importantMessageForm.value.content}`);

  // 模拟发送消息
  webSocketStore.sendMessage(importantMessageForm.value.content);

  messageList.value.push({
    timestamp: new Date().toLocaleTimeString(),
    type: "sent",
    content: `[重要] ${importantMessageForm.value.content}`,
  });

  sentMessageCount.value++;

  // 模拟等待确认
  ElNotification({
    title: "消息发送",
    message: `重要消息已发送，等待确认中...`,
    type: "info",
    duration: 2000,
  });

  // 模拟确认超时处理
  setTimeout(() => {
    ElNotification({
      title: "确认超时",
      message: "未收到服务器确认，消息可能需要重发",
      type: "warning",
      duration: 3000,
    });
  }, importantMessageForm.value.timeout);

  importantMessageForm.value.content = "";
};

// 清空消息
const clearMessages = () => {
  messageList.value = [];
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
    ElMessage.success("WebSocket连接成功");

    messageList.value.push({
      timestamp: new Date().toLocaleTimeString(),
      type: "success",
      content: "WebSocket连接已建立",
    });
  });

  // 监听消息事件
  webSocketStore.addEventListener<string>("message", data => {
    messageList.value.push({
      timestamp: new Date().toLocaleTimeString(),
      type: "received",
      content: data,
    });

    receivedMessageCount.value++;
  });

  // 监听连接关闭事件
  webSocketStore.addEventListener("close", () => {
    ElMessage.info("WebSocket连接已关闭");

    messageList.value.push({
      timestamp: new Date().toLocaleTimeString(),
      type: "info",
      content: "WebSocket连接已断开",
    });
  });

  // 监听错误事件
  webSocketStore.addEventListener("error", error => {
    ElMessage.error("WebSocket连接发生错误");

    messageList.value.push({
      timestamp: new Date().toLocaleTimeString(),
      type: "error",
      content: `WebSocket错误: ${JSON.stringify(error)}`,
    });
  });
});

// 组件卸载前移除事件监听器
onUnmounted(() => {
  // 可以在这里移除事件监听器（如果需要的话）
});
</script>

<template>
  <div class="websocket-advanced-demo">
    <el-card class="mb-3 tk-card-minimal">
      <template #header>
        <div class="card-header">
          <span>WebSocket 高级功能演示</span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover" class="tk-card-minimal">
            <template #header>连接控制</template>
            <div class="connection-control">
              <el-tag :type="getStatusTagType()">{{ webSocketStore.status }}</el-tag>
              <div class="mt-3">
                <el-input v-model="connectionUrl" placeholder="请输入WebSocket服务器地址" class="mb-2" />
                <el-button
                  type="primary"
                  :disabled="webSocketStore.status === SocketStatus.Connected"
                  @click="connectWebSocket"
                >
                  连接
                </el-button>
                <el-button
                  type="danger"
                  :disabled="webSocketStore.status !== SocketStatus.Connected"
                  @click="disconnectWebSocket"
                  class="ml-2"
                >
                  断开
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="hover" class="tk-card-minimal">
            <template #header>连接统计</template>
            <div class="connection-stats">
              <el-descriptions :column="1" size="small">
                <el-descriptions-item label="重连次数">{{ reconnectCount }}</el-descriptions-item>
                <el-descriptions-item label="发送消息数">{{ sentMessageCount }}</el-descriptions-item>
                <el-descriptions-item label="接收消息数">{{ receivedMessageCount }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="mb-3 tk-card-minimal">
      <template #header>
        <div class="card-header">
          <span>消息发送</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="普通消息" name="normal">
          <el-form :model="normalMessageForm" label-width="80px">
            <el-form-item label="消息内容">
              <el-input v-model="normalMessageForm.content" placeholder="请输入要发送的消息" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="sendNormalMessage">发送</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="重要消息(需确认)" name="important">
          <el-alert
            title="重要消息会等待服务器确认，如果未收到确认会在一段时间后重发"
            type="info"
            show-icon
            class="mb-3"
          />
          <el-form :model="importantMessageForm" label-width="80px">
            <el-form-item label="消息内容">
              <el-input v-model="importantMessageForm.content" placeholder="请输入重要的消息内容" />
            </el-form-item>
            <el-form-item label="超时时间">
              <el-input-number v-model="importantMessageForm.timeout" :min="1000" :max="30000" :step="1000" />
              毫秒
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="sendImportantMessage">发送并等待确认</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-card class="tk-card-minimal">
      <template #header>
        <div class="card-header">
          <span>实时消息</span>
        </div>
      </template>

      <div class="message-console">
        <div v-for="(message, index) in messageList" :key="index" :class="['message-item', message.type]">
          <span class="timestamp">[{{ message.timestamp }}]</span>
          <span class="type">[{{ message.type }}]</span>
          <span class="content">{{ message.content }}</span>
        </div>
      </div>

      <div class="mt-3 text-right">
        <el-button @click="clearMessages">清空消息</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@use "./shared";
@use "@styles/mixins/function" as *;

.websocket-advanced-demo {
  .connection-control,
  .connection-stats {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 120px;
  }

  .message-console {
    height: 300px;
    padding: 10px;
    overflow-y: auto;
    background-color: cssVarEl(fill-color-light);
    border: 1px solid cssVarEl(border-color);
    border-radius: 4px;
  }

  .message-item {
    padding: 5px 0;
    font-family: monospace;
    border-bottom: 1px solid cssVarEl(border-color);

    &:last-child {
      border-bottom: none;
    }

    &.sent {
      color: cssVarEl(color-primary);
    }

    &.received {
      color: cssVarEl(color-success);
    }

    &.info {
      color: cssVarEl(color-info);
    }

    &.success {
      color: cssVarEl(color-success);
    }

    &.warning {
      color: cssVarEl(color-warning);
    }

    &.error {
      color: cssVarEl(color-danger);
    }
  }

  .timestamp {
    margin-right: 10px;
    color: cssVarEl(color-info);
  }

  .type {
    margin-right: 10px;
    font-weight: bold;
    color: cssVarEl(color-primary);
  }
}
</style>
