import { defineStore } from "pinia";
import { ElNotification } from "element-plus";

export const SocketStatus = {
  Connecting: "正在连接", // 表示正在连接，这是初始状态
  Connected: "连接已建立", // 表示连接已经建立
  Disconnecting: "连接正在关闭", // 表示连接正在关闭
  Disconnected: "连接已断开", // 表示连接已经关闭
};

let heartBeatTimer: Nullable<NodeJS.Timeout> = null; // 心跳定时器实例
const heartBeatData = JSON.stringify({ type: "ping" }); // 心跳数据
const heartBeatInterval = 10000; // 心跳间隔，单位为毫秒
let heartBeatSendCount = 0; // 心跳次数
let heartBeatErrorCount = 0; // 错误次数
const maxHeartBeatErrorCount = 2; // 允许的最大错误次数，超出后则不再尝试连接

export const useWebSocketStore = defineStore("webSocketStore", () => {
  const websocket = shallowRef<Nullable<WebSocket>>(null); // websocket 实例
  const status = ref(SocketStatus.Disconnected);
  const websocketUrl = ref(""); // socket 地址

  const connect = (url: string) => {
    // 防止重复调用方法导致重复连接
    if (status.value === SocketStatus.Connected || status.value === SocketStatus.Connecting) return;

    websocket.value = new WebSocket(url);
    websocketUrl.value = url;

    websocketOpen();
    websocketClose();
    websocketError();
    startHeartBeat();
    websocketMessage();
  };

  /**
   * WebSocket 连接成功事件
   */
  const websocketOpen = () => {
    const ws = websocket.value;
    if (!ws) return;

    ws.onopen = openEvent => {
      console.log("连接 websocket 成功", openEvent);
      status.value = SocketStatus.Connected;
      restartHeartBeat();
    };
  };

  /**
   * WebSocket 接收数据
   */
  const websocketMessage = () => {
    const ws = websocket.value;
    if (!ws) return;

    ws.onmessage = messageEvent => {
      if (messageEvent.data.indexOf("heartbeat") > 0) restartHeartBeat();
      if (messageEvent.data.indexOf("ping") > 0) return;

      ElNotification.success({
        title: "消息",
        message: messageEvent.data,
        duration: 3000,
      });
      return messageEvent.data;
    };
  };

  /**
   * WebSocket 断开链接
   */
  const websocketClose = () => {
    const ws = websocket.value;
    if (!ws) return;

    ws.onclose = closeEvent => {
      console.log("断开连接", closeEvent);
      status.value = SocketStatus.Disconnected;
    };
  };

  /**
   * WebSocket 连接失败事件
   */
  const websocketError = () => {
    const ws = websocket.value;
    if (!ws) return;

    ws.onerror = errorEvent => {
      status.value = SocketStatus.Disconnected;
      console.log("连接 websocket 失败", errorEvent);
    };
  };

  /**
   * WebSocket 心跳发送
   */
  const startHeartBeat = () => {
    const ws = websocket.value;
    if (!ws) return;

    heartBeatTimer = setInterval(() => {
      // 如果连接正常则发送心跳
      if (ws.readyState === 1 || status.value === SocketStatus.Connected) {
        ws.send(heartBeatData);
        // 心跳次数 +1
        heartBeatSendCount = heartBeatSendCount + 1;
      } else reconnect(); // 重连
    }, heartBeatInterval);
  };

  /**
   * WebSocket 重新开始心跳
   */
  const restartHeartBeat = () => {
    heartBeatSendCount = 0;
    heartBeatErrorCount = 0;
    heartBeatTimer && clearInterval(heartBeatTimer);
    startHeartBeat();
  };

  /**
   * WebSocket 重连
   */
  const reconnect = () => {
    /**
     * 如果失败次数小于等于最大失败次数，则重新连接
     * 如果失败次数大于最大失败次数，则不再尝试连接
     */
    if (heartBeatErrorCount <= maxHeartBeatErrorCount) {
      heartBeatTimer && clearInterval(heartBeatTimer);

      // 重新连接 Websocket
      connect(websocketUrl.value);

      // 失败次数 +1
      heartBeatErrorCount = heartBeatErrorCount + 1;
      console.log("socket 重连次数", heartBeatErrorCount);
    } else {
      console.log("重试次数已用完");
      heartBeatTimer && clearInterval(heartBeatTimer);
    }
  };

  /**
   * 断开 WebSocket 连接
   */
  const disconnect = () => {
    const ws = websocket.value;
    if (!ws) return;

    if (ws && (ws.OPEN || ws.CONNECTING)) {
      console.log("socket 断开连接");

      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;

      websocket.value = null;
      status.value = SocketStatus.Disconnected;
    }
  };

  /**
   * WebSocket 发送数据给服务器
   * @param data 数据
   */
  const sendMessage = (data: any) => {
    const ws = websocket.value;
    if (!ws) return;

    ws.send(data);
  };

  return {
    websocket,
    status,
    websocketUrl,
    connect,
    disconnect,
    sendMessage,
  };
});
