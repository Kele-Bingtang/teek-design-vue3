import { shallowRef, ref } from "vue";
import { ElNotification } from "element-plus";
import { defineStore } from "pinia";

export const SocketStatus = {
  Connecting: "正在连接", // 表示正在连接，这是初始状态
  Connected: "连接已建立", // 表示连接已经建立
  Disconnecting: "连接正在关闭", // 表示连接正在关闭
  Disconnected: "连接已断开", // 表示连接已经关闭
};

// 定义事件类型
export type WebSocketEvent = "open" | "close" | "error" | "message";

// 定义事件回调函数类型
type WebSocketEventCallback<T = any> = (data: T) => void;

let heartBeatTimer: Nullable<NodeJS.Timeout> = null; // 心跳定时器实例
const heartBeatData = JSON.stringify({ type: "ping" }); // 心跳数据
const heartBeatInterval = 10000; // 心跳间隔，单位为毫秒
let heartBeatSendCount = 0; // 心跳次数
let heartBeatErrorCount = 0; // 错误次数
const maxHeartBeatErrorCount = 2; // 允许的最大错误次数，超出后则不再尝试连接

// 消息队列
const messageQueue: any[] = [];
let isSending = false;

export const useWebSocketStore = defineStore("webSocketStore", () => {
  const websocket = shallowRef<Nullable<WebSocket>>(null); // websocket 实例
  const status = ref(SocketStatus.Disconnected);
  const websocketUrl = ref(""); // socket 地址
  const eventListeners = new Map<WebSocketEvent, WebSocketEventCallback[]>();

  /**
   * 连接 WebSocket
   *
   * @param url WebSocket 地址
   */
  const connect = (url: string) => {
    // 防止重复调用方法导致重复连接
    if (status.value === SocketStatus.Connected || status.value === SocketStatus.Connecting) return;

    status.value = SocketStatus.Connecting;
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
      emitEvent("open", openEvent);
      // 连接成功后发送队列中的消息
      processMessageQueue();
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

      emitEvent("message", messageEvent.data);
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
      emitEvent("close", closeEvent);
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
      emitEvent("error", errorEvent);
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
      if (ws.readyState === WebSocket.OPEN || status.value === SocketStatus.Connected) {
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
   * WebSocket 重连 - 使用指数退避策略
   */
  const reconnect = () => {
    /**
     * 如果失败次数小于等于最大失败次数，则重新连接
     * 如果失败次数大于最大失败次数，则不再尝试连接
     */
    if (heartBeatErrorCount <= maxHeartBeatErrorCount) {
      heartBeatTimer && clearInterval(heartBeatTimer);

      // 计算延迟时间（指数退避）
      const delay = Math.min(1000 * 2 ** heartBeatErrorCount, 10000);

      setTimeout(() => {
        // 重新连接 Websocket
        connect(websocketUrl.value);
      }, delay);

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
    if (!ws) {
      // 如果没有连接，将消息加入队列
      messageQueue.push(data);
      return;
    }

    // 如果正在发送队列中的消息，也加入队列
    if (isSending) {
      messageQueue.push(data);
      return;
    }

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    } else {
      // 如果连接未准备好，加入队列等待
      messageQueue.push(data);
    }
  };

  /**
   * 处理消息队列
   */
  const processMessageQueue = () => {
    const ws = websocket.value;
    if (!ws || messageQueue.length === 0) return;

    isSending = true;

    const sendNext = () => {
      if (messageQueue.length === 0) {
        isSending = false;
        return;
      }

      const message = messageQueue.shift();
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        setTimeout(sendNext, 10); // 稍微延迟发送下一条消息
      } else {
        // 如果连接断开，把消息放回队列
        messageQueue.unshift(message);
        isSending = false;
      }
    };

    sendNext();
  };

  /**
   * 添加事件监听器
   */
  const addEventListener = <T = any>(event: WebSocketEvent, callback: WebSocketEventCallback<T>) => {
    if (!eventListeners.has(event)) {
      eventListeners.set(event, []);
    }
    eventListeners.get(event)?.push(callback);
  };

  /**
   * 移除事件监听器
   */
  const removeEventListener = <T = any>(event: WebSocketEvent, callback: WebSocketEventCallback<T>) => {
    const listeners = eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback as any);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  };

  /**
   * 触发事件
   */
  const emitEvent = <T = any>(event: WebSocketEvent, data?: T) => {
    const listeners = eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error("WebSocket事件处理出错:", error);
        }
      });
    }
  };

  return {
    websocket,
    status,
    websocketUrl,
    connect,
    disconnect,
    sendMessage,
    addEventListener,
    removeEventListener,
  };
});
