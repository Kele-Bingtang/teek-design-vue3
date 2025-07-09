<script setup lang="ts">
import { Bell } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { Tooltip } from "@/components";
import { useMessageStore } from "@/pinia";
import msg1 from "@/common/assets/images/msg/msg01.png";
import msg2 from "@/common/assets/images/msg/msg02.png";
import msg3 from "@/common/assets/images/msg/msg03.png";
import msg4 from "@/common/assets/images/msg/msg04.png";
import msg5 from "@/common/assets/images/msg/msg05.png";
import "./index.scss";

defineOptions({ name: "Notification" });

interface Notice {
  /** 消息 id */
  id: string;
  /** 消息头像 */
  avatar?: string;
  /** 消息标题 */
  title: string;
  /** 消息描述 */
  description?: string;
  /** 消息日期 */
  date?: string;
  /** 消息创建时间 */
  createTime?: string;
  /** 消息标签 */
  tag?: {
    name: string;
    type: "primary" | "danger" | "success" | "info" | "warning";
  }[];
}

interface TabInfo {
  /** 标签名称 */
  name: string;
  /** 标签名称 */
  label: string;
  /** 标签数据 */
  data: Notice[];
}

const messageStore = useMessageStore();
const { unreadMessageList } = storeToRefs(messageStore);

const ns = useNamespace("notification");
const router = useRouter();

onMounted(() => {
  // 请求获取消息列表
  messageStore.getMessageList();
});

/**
 * 通知列表
 */
const noticeList: Notice[] = [
  { id: "1", avatar: msg1, title: "请您尽快填写本周的周报。", date: "一分钟前" },
  { id: "2", avatar: msg2, title: "您今天有 4 个重要会议。", date: "一小时前" },
  { id: "3", avatar: msg3, title: "请下午 18:30 参加前端面试。", date: "一天天前" },
  {
    id: "4",
    avatar: msg4,
    title: "今天将举行消费演练，于下午 14 点至 16 点之间开始，请注意配合，谢谢！",
    date: "一星期前",
  },
  { id: "5", avatar: msg5, title: "恭喜您喜获 2022 年人才质量提升奖。", date: "2023-01-01" },
];

/**
 * 代办列表
 */
const arList: Notice[] = [
  {
    id: "1",
    title: "Kbt Vue3 Admin 版本发布",
    description: "Kbt Vue3 Admin 版本发布",
    tag: [
      { name: "高", type: "danger" },
      { name: "已过期 7 天", type: "danger" },
    ],
    date: "2099-12-31",
  },
  {
    id: "2",
    title: "参加 IT 方案评审例会",
    description:
      "【会议通知】IT 运作周例会   时间：3月13日（周一）09:30-12:00，地点：(山海平吉)2-B05R中会议室；请您预留时间准时与会，谢谢~",
    tag: [
      { name: "中", type: "warning" },
      { name: "进行中", type: "primary" },
    ],
    date: "2023-09-15",
  },
  {
    id: "3",
    title: "通知",
    description: "请 Jessany 完成 API 网关和证书系统",
    tag: [
      { name: "低", type: "info" },
      { name: "还剩 2 天超期", type: "warning" },
    ],
    date: "2023-12-31",
  },
  {
    id: "4",
    title: "开发 ETS 系统",
    description: "请 Kobe 在截止日期（2023-07-27）前开发出第一版 ETS 系统",
    tag: [{ name: "高", type: "danger" }],
    date: "2023-07-27",
  },
];

const activeName = ref("notice");

// 标签列表
const tabList = computed<TabInfo[]>(() => [
  { name: "notice", label: "通知", data: noticeList },
  {
    name: "message",
    label: "消息",
    data: unreadMessageList.value.map((item: Notice) => {
      item.avatar = msg2;
      return item;
    }),
  },
  { name: "ar", label: "代办", data: arList },
]);

/**
 * 跳转消息中心
 */
const toDetail = () => {
  if (activeName.value === "message") router.push("/message-center");
};
</script>

<template>
  <div :class="ns.b()">
    <el-popover placement="bottom" :width="360" trigger="click" :popper-class="ns.b()">
      <template #reference>
        <div class="flx-center" style="width: 100%; height: 100%; margin-top: 5px">
          <el-badge is-dot>
            <Icon :icon="Bell" />
          </el-badge>
        </div>
      </template>

      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="`${item.label} (${item.data.length})`"
          :name="item.name"
        >
          <template v-if="item.data.length > 0">
            <el-scrollbar :max-height="400">
              <ul :class="ns.e('list')">
                <li v-for="data in item.data" :key="data.id" class="flx-align-center">
                  <img v-if="data.avatar" :src="data.avatar" alt="" :class="ns.m('avatar')" />

                  <div :class="[ns.e('info'), 'flx-1']">
                    <div class="flx-align-center-between">
                      <Tooltip :line="1" :try="1">
                        <span class="title">{{ data.title }}</span>
                      </Tooltip>
                      <div v-if="data.tag?.length" class="flx" style="gap: 2px">
                        <ElTag v-for="tag in data.tag" :key="tag.name" :type="tag.type" size="small">
                          {{ tag.name }}
                        </ElTag>
                      </div>
                    </div>

                    <Tooltip v-if="data.description" :line="2" :try="1">
                      <span class="desc">{{ data.description }}</span>
                    </Tooltip>

                    <span class="date">{{ data.date || data.createTime }}</span>
                  </div>
                </li>
              </ul>
            </el-scrollbar>

            <el-button @click="toDetail" style="width: 100%">查看全部</el-button>
          </template>

          <div :class="ns.e('empty')" v-else>
            <img src="@/common/assets/images/notData.png" alt="notData" />
            <div>暂无内容</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>
