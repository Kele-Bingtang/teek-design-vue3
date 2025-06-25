// https://github.com/pure-admin/vue-pure-admin/blob/main/src/utils/message.ts 进行封装
import type { VNode } from "vue";
import type { MessageHandler } from "element-plus";
import { ElMessage } from "element-plus";
import { isFunction, isString } from "./is";

type MessageStyle = "el" | "antd";
type MessageTypes = "info" | "success" | "warning" | "error";
type MessageProps = string | VNode | (() => VNode);

interface MessageParams {
  /** 消息 */
  message: MessageProps;
  /** 消息类型，可选 `info` 、`success` 、`warning` 、`error` ，默认 `info` */
  type?: MessageTypes;
  /** 自定义图标，该属性会覆盖 `type` 的图标 */
  icon?: any;
  /** 是否将 `message` 属性作为 `HTML` 片段处理，默认 `false` */
  dangerouslyUseHTMLString?: boolean;
  /** 消息风格，可选 `el` 、`antd` ，默认 `antd` */
  customClass?: MessageStyle;
  /** 显示时间，单位为毫秒。设为 `0` 则不会自动关闭，`element-plus` 默认是 `3000` */
  duration?: number;
  /** 是否显示关闭按钮，默认值 `false` */
  showClose?: boolean;
  /** 文字是否居中，默认值 `false` */
  center?: boolean;
  /** `Message` 距离窗口顶部的偏移量，默认 `20` */
  offset?: number;
  /** 设置组件的根元素，默认 `document.body` */
  appendTo?: string | HTMLElement;
  /** 合并内容相同的消息，不支持 `VNode` 类型的消息，默认值 `false` */
  grouping?: boolean;
  /** 关闭时的回调函数, 参数为被关闭的 `message` 实例 */
  onClose?: () => unknown;
  plain?: boolean;
}

/** 用法非常简单，参考 src/views/components/message/index.vue 文件 */

/**
 * Message 消息提示函数
 * 支持两种形式：
 * 1. 有一个参数，且参数是个消息内容 + 配置的对象：message({})
 * 2. 有两个参数，第一个参数是消息内容，第二个是配置对象：message("", {})
 */
function message(params: MessageProps | MessageParams, extra?: Omit<MessageParams, "message">): MessageHandler {
  return messageType(params, extra, "info");
}

/**
 * 等价于 ElMessage.info({})
 * 支持两种形式：
 * 1. message.info({})
 * 2 message.info("", {})
 */
message.info = (params: MessageProps | Omit<MessageParams, "type">, extra?: Omit<MessageParams, "message">) => {
  return messageType(params, extra, "info");
};

/**
 * 等价于 ElMessage.success({})
 * 支持两种形式：
 * 1. message.success({})
 * 2 message.success("", {})
 */
message.success = (params: MessageProps | Omit<MessageParams, "type">, extra?: Omit<MessageParams, "message">) => {
  return messageType(params, extra, "success");
};

/**
 * 等价于 ElMessage.warning({})
 * 支持两种形式：
 * 1. message.warning({})
 * 2 message.warning("", {})
 */
message.warning = (params: MessageProps | Omit<MessageParams, "type">, extra?: Omit<MessageParams, "message">) => {
  return messageType(params, extra, "warning");
};

/**
 * 等价于 ElMessage.error({})
 * 支持两种形式：
 * 1. message.error({})
 * 2 message.error("", {})
 */
message.error = (params: MessageProps | Omit<MessageParams, "type">, extra?: Omit<MessageParams, "message">) => {
  return messageType(params, extra, "error");
};

function messageType(
  params: MessageProps | MessageParams | Omit<MessageParams, "type">,
  extra?: Omit<MessageParams, "message">,
  t: MessageTypes = "info" // t 就是传参的 type
) {
  if (isMessageProps(params)) {
    if (extra) {
      const {
        icon,
        type = t,
        dangerouslyUseHTMLString = false,
        customClass = "el",
        duration = 3000,
        showClose = false,
        offset = 20,
        appendTo = document.body,
        grouping = false,
        onClose,
        plain,
      } = extra;
      return ElMessage({
        message: params,
        type,
        icon,
        dangerouslyUseHTMLString,
        duration,
        showClose,
        offset,
        appendTo,
        grouping,
        customClass: customClass === "antd" ? "antd-message" : customClass,
        onClose: () => (isFunction(onClose) ? onClose() : null),
        plain,
      });
    }
    return ElMessage({
      message: params,
      type: t,
      plain: true,
    });
  } else {
    const {
      message,
      icon,
      dangerouslyUseHTMLString = false,
      customClass = "el",
      duration = 3000,
      showClose = false,
      offset = 20,
      appendTo = document.body,
      grouping = false,
      onClose,
    } = params;

    let type = t;
    if (isMessageParams(params)) type = params.type || t;

    return ElMessage({
      message,
      type,
      icon,
      dangerouslyUseHTMLString,
      duration,
      showClose,
      offset,
      appendTo,
      grouping,
      // antd-message 在 style 的 index.scss 和 element-dark.scss 下
      customClass: customClass === "antd" ? "antd-message" : customClass,
      onClose: () => (isFunction(onClose) ? onClose() : null),
    });
  }
}

function isMessageProps(value: MessageProps | MessageParams): value is MessageProps {
  return isString(value) || !(value as MessageParams)?.message;
}

function isMessageParams(params: MessageParams | Omit<MessageParams, "type">): params is MessageParams {
  return !!(params as MessageParams).type;
}
/**
 * 关闭所有 `Message` 消息提示函数
 */
const closeAllMessage = (): void => ElMessage.closeAll();

export { message, closeAllMessage };
