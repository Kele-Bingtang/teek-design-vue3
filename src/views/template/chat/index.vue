<script setup lang="ts">
import type { Message, Person } from "./types";
import { ref, onMounted } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { isString, mittBus } from "@/common/utils";
import meAvatar from "@/common/assets/images/default.png";
import aiAvatar from "@/common/assets/images/default.png";
import avatar2 from "@/common/assets/images/default.png";
import avatar3 from "@/common/assets/images/default.png";
import avatar4 from "@/common/assets/images/default.png";
import avatar5 from "@/common/assets/images/default.png";
import avatar6 from "@/common/assets/images/default.png";
import avatar7 from "@/common/assets/images/default.png";
import avatar8 from "@/common/assets/images/default.png";
import avatar9 from "@/common/assets/images/default.png";
import avatar10 from "@/common/assets/images/default.png";
import { useNamespace } from "@/composables/core/use-namespace";
import PersonList from "./components/person-list.vue";
import ChatHeader from "./components/chat-header.vue";
import ChatMessages from "./components/chat-messages.vue";
import ChatInput from "./components/chat-input.vue";

const ns = useNamespace("chat");

const isOnline = ref(true);

const selectedPerson = ref<Person | null>(null);

const personList = ref<Person[]>([
  {
    id: 1,
    name: "梅洛迪·梅西",
    email: "melody@altbox.com",
    avatar: meAvatar,
    online: true,
    lastTime: "20小时前",
    unread: 0,
  },
  { id: 2, name: "马克·史密斯", email: "max@kt.com", avatar: avatar2, online: true, lastTime: "2周前", unread: 6 },
  { id: 3, name: "肖恩·宾", email: "sean@dellito.com", avatar: avatar3, online: false, lastTime: "5小时前", unread: 5 },
  {
    id: 4,
    name: "爱丽丝·约翰逊",
    email: "alice@domain.com",
    avatar: avatar4,
    online: true,
    lastTime: "1小时前",
    unread: 2,
  },
  { id: 5, name: "鲍勃·布朗", email: "bob@domain.com", avatar: avatar5, online: false, lastTime: "3天前", unread: 1 },
  {
    id: 6,
    name: "查理·戴维斯",
    email: "charlie@domain.com",
    avatar: avatar6,
    online: true,
    lastTime: "10分钟前",
    unread: 0,
  },
  {
    id: 7,
    name: "戴安娜·普林斯",
    email: "diana@domain.com",
    avatar: avatar7,
    online: true,
    lastTime: "15分钟前",
    unread: 3,
  },
  {
    id: 8,
    name: "伊桑·亨特",
    email: "ethan@domain.com",
    avatar: avatar8,
    online: true,
    lastTime: "5分钟前",
    unread: 0,
  },
  {
    id: 9,
    name: "杰西卡·琼斯",
    email: "jessica@domain.com",
    avatar: avatar9,
    online: false,
    lastTime: "1天前",
    unread: 4,
  },
  {
    id: 10,
    name: "彼得·帕克",
    email: "peter@domain.com",
    avatar: avatar10,
    online: true,
    lastTime: "2小时前",
    unread: 1,
  },
  {
    id: 11,
    name: "克拉克·肯特",
    email: "clark@domain.com",
    avatar: avatar3,
    online: true,
    lastTime: "30分钟前",
    unread: 2,
  },
  {
    id: 12,
    name: "布鲁斯·韦恩",
    email: "bruce@domain.com",
    avatar: avatar5,
    online: false,
    lastTime: "3天前",
    unread: 0,
  },
  {
    id: 13,
    name: "韦德·威尔逊",
    email: "wade@domain.com",
    avatar: avatar6,
    online: true,
    lastTime: "10分钟前",
    unread: 5,
  },
]);

/**
 * 选择联系人
 */
const selectPerson = (person: Person) => {
  selectedPerson.value = person;
};

const messageText = ref("");
const messages = ref<Message[]>([
  {
    id: 1,
    sender: "Robot",
    content: "你好！我是你的AI助手，有什么我可以帮你的吗？",
    time: "10:00",
    isMe: false,
    avatar: aiAvatar,
  },
  { id: 2, sender: "Ricky", content: "我想了解一下系统的使用方法。", time: "10:01", isMe: true, avatar: meAvatar },
  {
    id: 3,
    sender: "Robot",
    content: "好的，我来为您介绍系统的主要功能。首先，您可以通过左侧菜单访问不同的功能模块...",
    time: "10:02",
    isMe: false,
    avatar: aiAvatar,
  },
  {
    id: 4,
    sender: "Ricky",
    content: "听起来很不错，能具体讲讲数据分析部分吗？",
    time: "10:05",
    isMe: true,
    avatar: meAvatar,
  },
  {
    id: 5,
    sender: "Robot",
    content: "当然可以。数据分析模块可以帮助您实时监控关键指标，并生成详细的报表...",
    time: "10:06",
    isMe: false,
    avatar: aiAvatar,
  },
  { id: 6, sender: "Ricky", content: "太好了，那我如何开始使用呢？", time: "10:08", isMe: true, avatar: meAvatar },
  {
    id: 7,
    sender: "Robot",
    content: "您可以先创建一个项目，然后在项目中添加相关的数据源，系统会自动进行分析。",
    time: "10:09",
    isMe: false,
    avatar: aiAvatar,
  },
  { id: 8, sender: "Ricky", content: "明白了，谢谢你的帮助！", time: "10:10", isMe: true, avatar: meAvatar },
  { id: 9, sender: "Robot", content: "不客气，有任何问题随时联系我。", time: "10:11", isMe: false, avatar: aiAvatar },
]);

const messageId = ref(10);
const userAvatar = ref(meAvatar);

/**
 * 发送消息
 */
const sendMessage = (text?: string) => {
  const content = isString(text) ? text : messageText.value.trim();
  if (!content) return;

  messages.value.push({
    id: messageId.value++,
    sender: "Ricky",
    content,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    isMe: true,
    avatar: userAvatar.value,
  });
  messageText.value = "";
};

onMounted(() => {
  mittBus.on("openChat", () => {});
  selectedPerson.value = personList.value[0];
});
</script>

<template>
  <div :class="ns.b()">
    <PersonList :personList="personList" :selectedPerson="selectedPerson" @select="selectPerson">
      <template #dropdown>
        <el-dropdown trigger="click" placement="bottom-start">
          <span :class="ns.e('sort-btn')">
            排序方式
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>按时间排序</el-dropdown-item>
              <el-dropdown-item>按名称排序</el-dropdown-item>
              <el-dropdown-item>全部标为已读</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </PersonList>

    <div :class="ns.e('modal')">
      <ChatHeader :person="selectedPerson || undefined" :isOnline="isOnline" />
      <div :class="ns.e('container')">
        <ChatMessages :messages="messages" />
        <ChatInput v-model="messageText" @send="sendMessage" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
