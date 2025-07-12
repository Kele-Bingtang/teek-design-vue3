import { defineStore } from "pinia";
import { ref } from "vue";
import { hasReadList, recycleList, unreadList } from "@/mock/message/message";

export interface MessageItem {
  /** 消息 ID */
  id: string;
  /** 消息标题 */
  title: string;
  /** 消息内容 */
  content: string;
  /** 消息描述 */
  description?: string;
  /** 创建时间 */
  createTime: string;
  /** 是否加载中 */
  loading?: boolean;
}

export const useMessageStore = defineStore("messageStore", () => {
  const unreadMessageList = ref<MessageItem[]>([]);
  const hasReadMessageList = ref<MessageItem[]>([]);
  const recycleMessageList = ref<MessageItem[]>([]);

  /**
   * 获取消息列表
   */
  const getMessageList = () => {
    return new Promise(resolve => {
      // 模拟请求消息
      setMessageUnReadList(unreadList);
      setMessageHasReadList(hasReadList);
      setMessageRecycleList(recycleList);
      resolve("");
    });
  };

  /**
   * 标记消息已读
   *
   * @param id 消息 ID
   */
  const messageHasRead = ({ id }: { id: string }) => {
    return new Promise(resolve => {
      moveMessage({
        to: "hasReadMessageList",
        from: "unreadMessageList",
        id,
      });
      resolve("");
    });
  };

  /**
   * 删除已读消息
   *
   * @param id 消息 ID
   */
  const removeReadMessage = ({ id }: { id: string }) => {
    return new Promise(resolve => {
      moveMessage({
        to: "recycleMessageList",
        from: "hasReadMessageList",
        id,
      });
      resolve("");
    });
  };

  /**
   * 恢复回收站消息
   *
   * @param id 消息 ID
   */
  const restoreRecycleMessage = ({ id }: { id: string }) => {
    return new Promise(resolve => {
      moveMessage({
        to: "hasReadMessageList",
        from: "recycleMessageList",
        id,
      });
      resolve("");
    });
  };

  /**
   * 设置未读消息列表
   *
   * @param unreadList 未读消息列表
   */
  const setMessageUnReadList = (unreadList: MessageItem[]) => {
    unreadList = unreadList.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    unreadMessageList.value = unreadList;
  };

  /**
   * 设置已读消息列表
   *
   * @param hasReadList 已读消息列表
   */
  const setMessageHasReadList = (hasReadList: MessageItem[]) => {
    hasReadList = hasReadList
      .map(item => {
        item.loading = false;
        return item;
      })
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    hasReadMessageList.value = hasReadList;
  };

  /**
   * 设置回收站消息列表
   *
   * @param recycleList 回收站消息列表
   */
  const setMessageRecycleList = (recycleList: MessageItem[]) => {
    recycleList = recycleList
      .map(item => {
        item.loading = false;
        return item;
      })
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    recycleMessageList.value = recycleList;
  };

  /**
   * 移动消息
   *
   * @param messageRoute 消息路由
   */
  const moveMessage = (messageRoute: {
    to: "hasReadMessageList" | "recycleMessageList";
    from: "unreadMessageList" | "hasReadMessageList" | "recycleMessageList";
    id: string;
  }) => {
    const messageStore = useMessageStore();
    const { from, to, id } = messageRoute;
    const index = messageStore[from].findIndex((item: MessageItem) => item.id === id);
    const messageItem = messageStore[from].splice(index, 1)[0];

    messageItem.loading = false;
    messageStore[to].unshift(messageItem);
  };

  return {
    unreadMessageList,
    hasReadMessageList,
    recycleMessageList,

    getMessageList,
    messageHasRead,
    removeReadMessage,
    restoreRecycleMessage,
  };
});
