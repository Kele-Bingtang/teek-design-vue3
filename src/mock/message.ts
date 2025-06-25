import type { MessageItem } from "@/pinia";
import { myHtml } from "./html";

export const unreadList: Array<MessageItem> = [
  {
    id: "01",
    title: "未读测试 01",
    content: myHtml({
      name: "名字 01",
      subject: "主题 01",
      message: "消息 01",
      email: "邮箱 01",
    }),
    createTime: "2022-10-10",
  },
  {
    id: "02",
    title: "未读测试 02",
    content: myHtml({
      name: "名字 02",
      subject: "主题 02",
      message: "消息 02",
      email: "邮箱 02",
    }),
    createTime: "2022-10-11",
  },
  {
    id: "03",
    title: "未读测试 03",
    content: myHtml({
      name: "名字 03",
      subject: "主题 03",
      message: "消息 03",
      email: "邮箱 03",
    }),
    createTime: "2022-10-12",
  },
  {
    id: "04",
    title: "未读测试 04",
    content: myHtml({
      name: "名字 04",
      subject: "主题 04",
      message: "消息 04",
      email: "邮箱 04",
    }),
    createTime: "2022-10-09",
  },
];

export const hasReadList: Array<MessageItem> = [
  {
    id: "11",
    title: "已读测试 11",
    content: myHtml({
      name: "名字 11",
      subject: "主题 11",
      message: "消息 11",
      email: "邮箱 11",
    }),
    createTime: "2022-10-13",
  },
  {
    id: "12",
    title: "已读测试 12",
    content: myHtml({
      name: "名字 12",
      subject: "主题 12",
      message: "消息 12",
      email: "邮箱 12",
    }),
    createTime: "2022-10-14",
  },
  {
    id: "13",
    title: "已读测试 13",
    content: myHtml({
      name: "名字 13",
      subject: "主题 13",
      message: "消息 13",
      email: "邮箱 13",
    }),
    createTime: "2022-10-15",
  },
];
export const recycleList: Array<MessageItem> = [
  {
    id: "21",
    title: "回收站测试 21",
    content: myHtml({
      name: "名字 21",
      subject: "主题 21",
      message: "消息 21",
      email: "邮箱 21",
    }),
    createTime: "2022-10-16",
  },
  {
    id: "22",
    title: "回收站测试 22",
    content: myHtml({
      name: "名字 22",
      subject: "主题 22",
      message: "消息 22",
      email: "邮箱 22",
    }),
    createTime: "2022-10-17",
  },
  {
    id: "23",
    title: "回收站测试 23",
    content: myHtml({
      name: "名字 23",
      subject: "主题 23",
      message: "消息 23",
      email: "邮箱 23",
    }),
    createTime: "2022-10-18",
  },
];
