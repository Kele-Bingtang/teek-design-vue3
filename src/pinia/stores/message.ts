import { defineStore } from "pinia";
import { ref } from "vue";
import { hasReadList, recycleList, unreadList } from "@/mock/message";

export interface MessageItem {
  id: string;
  title: string;
  content: string;
  description?: string;
  createTime: string;
  loading?: boolean;
}

export const useMessageStore = defineStore("messageStore", () => {
  const unreadMessageList = ref<MessageItem[]>([]);
  const hasReadMessageList = ref<MessageItem[]>([]);
  const recycleMessageList = ref<MessageItem[]>([]);

  const getMessageList = () => {
    return new Promise(resolve => {
      // 模拟请求消息
      setMessageUnReadList(unreadList);
      setMessageHasReadList(hasReadList);
      setMessageRecycleList(recycleList);
      resolve("");
    });
  };

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

  const setMessageUnReadList = (unreadList: MessageItem[]) => {
    unreadList = unreadList.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    unreadMessageList.value = unreadList;
  };

  const setMessageHasReadList = (hasReadList: MessageItem[]) => {
    hasReadList = hasReadList
      .map(item => {
        item.loading = false;
        return item;
      })
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    hasReadMessageList.value = hasReadList;
  };

  const setMessageRecycleList = (recycleList: MessageItem[]) => {
    recycleList = recycleList
      .map(item => {
        item.loading = false;
        return item;
      })
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    recycleMessageList.value = recycleList;
  };

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
