import { useRouter } from "vue-router";
import { useEventListener } from "@vueuse/core";
import { useRouteFn } from "@/composables";
import { isArray, isObject, isString } from "@/common/utils";
import { useLayoutStore, useUserStore } from "@/pinia";
import { useTabNav } from "../tab-nav/use-tab-nav";

// 通信时操作路由的行为
type IFrameActon = "open" | "close" | "refresh" | "add";

export interface IFrame {
  /** iframe 地址 */
  src: string;
  /** iframe 名称 */
  name: string;
  /** 是否展示 */
  show: boolean;
}

/**
 * 通信信息
 */
export interface IFrameMessage extends Partial<RouterConfigRaw> {
  /** 通信动作 */
  action: IFrameActon;
  /** 新增的路由，仅当 action 为 add 相关值时有效（必传） */
  routes?: RouterConfigRaw[];
}

/**
 * 接收 iframe 传来的消息，并进行逻辑处理
 */
export const useIFrame = (immediate = true) => {
  const isStart = ref(false);

  const { closeSelectedTab } = useTabNav();
  const { loadDynamicRoutes } = useRouteFn();
  const layoutStore = useLayoutStore();
  const userStore = useUserStore();

  const router = useRouter();

  let cleanup: ReturnType<typeof useEventListener>;

  /**
   * 接收 iframe 传来的消息，执行该消息（场景：把 teek 作为门户来嵌入各个系统）
   *
   * @param evt 通信数据
   */
  const watchFrameMessage = (evt: MessageEvent) => {
    const { data } = evt;
    let message = data;

    if (isString(message)) message = JSON.parse(data);

    if (isObject(message)) processFrameMessage(message as IFrameMessage);
    else if (isArray(message)) message.forEach(processFrameMessage);
  };

  /**
   * 处理 iframe 接收的消息
   *
   * @param message iframe 发送的消息
   */
  const processFrameMessage = (message: IFrameMessage) => {
    const { action = "", name, path, routes = [] } = message;

    // 打开一个路由
    if (action === "open") {
      if (name && router.hasRoute(name)) return router.push({ name });
      if (path) return router.push(path);
    }

    // 关闭路由，支持关闭多个路由
    if (action === "close" && name) {
      if (isArray(name)) return name.forEach(closeFrame);
      return closeFrame(name);
    }

    // 刷新一个路由：先关闭后打开路由
    if (action === "refresh" && name) {
      closeFrame(name);
      setTimeout(() => router.push({ name }), 1);
      return;
    }

    // 新增路由并跳转第一个路由
    if (action === "add") {
      loadDynamicRoutes(routes, userStore.roles);

      if (routes.length) router.push({ name: routes[0].name });
    }
  };

  /**
   * 关闭 iframe
   */
  const closeFrame = (name: string | symbol) => {
    const tab = layoutStore.tabNavList.find(tab => tab.name === name);
    tab && closeSelectedTab(tab);
  };

  /**
   * 开始监听 iframe 消息
   */
  const start = () => {
    if (isStart.value) return;
    cleanup = useEventListener("message", watchFrameMessage);
    isStart.value = true;
  };

  /**
   * 停止监听 iframe 消息
   */
  const stop = () => {
    cleanup?.();
  };

  if (immediate) start();

  return { start, stop };
};
