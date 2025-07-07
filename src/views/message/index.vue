<script setup lang="ts" name="MessageCenter">
import { useMessageStore, type MessageItem } from "@/pinia";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, RefreshLeft } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";

const ns = useNamespace("message-center");

type MessageType = "unread" | "hasRead" | "recycle";

const messageStore = useMessageStore();

const listLoading = ref(false);
const contentLoading = ref(false);
const selectedMessageType = ref<MessageType>("unread");
const lastReadMessageId = ref("");
const selectedMessageItem = ref<MessageItem>({
  id: "",
  title: "",
  content: "",
  createTime: "",
});

const unreadCount = computed(() => messageStore.unreadMessageList.length);
const readCount = computed(() => messageStore.hasReadMessageList.length);
const recycleCount = computed(() => messageStore.recycleMessageList.length);
const messageList = computed(() => {
  if (selectedMessageType.value === "unread") return messageStore.unreadMessageList;
  else if (selectedMessageType.value === "hasRead") return messageStore.hasReadMessageList;
  else if (selectedMessageType.value === "recycle") return messageStore.recycleMessageList;
  return [];
});

onMounted(() => {
  // 请求获取消息列表
  listLoading.value = true;
  messageStore
    .getMessageList()
    .then(() => {
      // 模拟延迟
      setTimeout(() => {
        listLoading.value = false;
      }, 1000);
    })
    .catch(() => (listLoading.value = false));
});

const handleCategorySelect = (id: string) => {
  selectedMessageType.value = id as MessageType;
  messageHasRead();
};

const handleListSelect = (id: string) => {
  contentLoading.value = true;
  // 模拟延迟
  setTimeout(() => {
    const item = messageList.value.find(item => item.id === id);
    if (item) {
      selectedMessageItem.value = item;
    }
    contentLoading.value = false;
    if (selectedMessageType.value === "unread") {
      messageHasRead(id);
    }
  }, 1000);
};

const messageHasRead = (id?: string) => {
  if (lastReadMessageId.value) {
    messageStore.messageHasRead({ id: lastReadMessageId.value }).then(() => {
      lastReadMessageId.value = id || "";
    });
  } else {
    lastReadMessageId.value = id || "";
  }
};

const handleOperate = (message: MessageItem) => {
  message.loading = true;
  const { id } = message;
  if (selectedMessageType.value === "hasRead") {
    // 删除
    ElMessageBox.confirm("您确定将该消息放到回收站吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        messageStore.removeReadMessage({ id });
        ElMessage({
          type: "success",
          message: "删除成功!",
        });
        message.loading = false;
      })
      .catch(() => {
        message.loading = false;
      });
  } else {
    // 恢复
    ElMessageBox.confirm("您确定恢复该消息吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        messageStore.restoreRecycleMessage({ id });
        ElMessage({
          type: "success",
          message: "恢复成功!",
        });
        message.loading = false;
      })
      .catch(() => {
        message.loading = false;
      });
  }
};
</script>

<template>
  <div :class="ns.b()">
    <el-card :class="[ns.e('card'), 'tk-card-minimal']">
      <div :class="[ns.e('page'), ns.e('category')]">
        <el-menu default-active="unread" @select="handleCategorySelect">
          <el-menu-item index="unread">
            <span class="category">
              未读消息
              <el-badge :value="unreadCount" type="danger" :max="99"></el-badge>
            </span>
          </el-menu-item>
          <el-menu-item index="hasRead">
            <span class="category">
              已读消息
              <el-badge :value="readCount" type="success"></el-badge>
            </span>
          </el-menu-item>
          <el-menu-item index="recycle">
            <span class="category">
              回收站
              <el-badge :value="recycleCount" type="info"></el-badge>
            </span>
          </el-menu-item>
        </el-menu>
      </div>

      <div :class="[ns.e('page'), ns.e('list')]" v-loading="listLoading">
        <el-menu
          default-active="1"
          @select="handleListSelect"
          :class="{
            'unread-list': selectedMessageType === 'hasRead',
            'recycle-list': selectedMessageType === 'recycle',
          }"
        >
          <el-menu-item v-for="message in messageList" :key="`message_${message.id}`" :index="message.id">
            <p class="list-title">{{ message.title }}</p>
            <div class="list-time">
              <span class="list-dot"></span>
              <span class="list-text">{{ message.createTime }}</span>
            </div>
            <el-button
              link
              class="list-operate operate-icon"
              :loading="message.loading"
              :icon="selectedMessageType === 'hasRead' ? Delete : RefreshLeft"
              @click.stop="handleOperate(message)"
              v-if="selectedMessageType !== 'unread'"
            ></el-button>
          </el-menu-item>
        </el-menu>
      </div>

      <div :class="[ns.e('page'), ns.e('content')]" v-loading="contentLoading" element-loading-text="拼命加载中 ...">
        <div :class="ns.e('content-header')">
          <h2 :class="ns.em('content-header', 'title')">{{ selectedMessageItem.title }}</h2>
          <time :class="ns.em('content-header', 'time')">{{ selectedMessageItem.createTime }}</time>
        </div>
        <div v-html="selectedMessageItem.content"></div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(message-center) {
  height: 100%;

  @include e(card) {
    height: 100%;

    :deep(.#{$el-namespace}-card__body) {
      height: 100%;
      overflow: auto;
      white-space: nowrap;
    }
  }

  @include e(page) {
    position: relative;
    display: inline-block;
    height: 100%;
    vertical-align: top;
    border-right: 1px solid #e6e6e6;

    // #{$el-namespace} 默认为 el，如果组件迁移到其他项目，且项目架构与此项目不同，则请修改 #{$el-namespace} 为 el
    @include el-joins(menu) {
      width: auto;

      @include el-joins(menu-item) {
        &.is-active {
          // background-color: #f0faff;
          &::after {
            position: absolute;
            top: 0;
            right: -1px;
            bottom: 0;
            display: block;
            width: 2px;
            content: "";
            background: cssVarEl(color-primary);
          }

          .list-dot {
            background-color: cssVarEl(color-primary) !important;
          }
        }
      }

      @include el-joins(badge) {
        margin-left: 10px;
        vertical-align: middle;

        :deep(.#{$el-namespace}-badge__content) {
          vertical-align: middle;
        }
      }
    }
  }

  @include e(category) {
    width: 200px;
  }

  @include e(list) {
    width: 230px;

    @include el-joins(menu-item) {
      display: block;
      height: auto;
      padding: 14px 20px;
      line-height: 21px;
      white-space: normal;

      .list-title {
        padding: 0;
        margin: 0;
      }

      .list-time {
        display: inline-block;

        .list-dot {
          position: relative;
          top: -1px;
          display: inline-block;
          width: 6px;
          height: 6px;
          vertical-align: middle;
          background-color: #e6e8f1;
          border-radius: 50%;
        }

        .list-text {
          display: inline-block;
          margin-left: 6px;
          font-size: 12px;
          color: #515a6e;
        }
      }

      .list-operate {
        float: right;
        align-items: normal;
        padding-top: 3px;
        margin-right: 17px;
      }

      :deep(.#{$el-namespace}-icon) {
        display: none;
        font-size: 13px;
        color: #909399;

        &:hover {
          color: cssVarEl(color-primary);
        }
      }

      &:hover {
        :deep(.#{$el-namespace}-icon) {
          display: inline-block;
        }
      }
    }

    .unread-list {
      .#{$el-namespace}-menu-item:not(.is-active) {
        color: #aaa9a9;
      }
    }
  }

  @include e(content) {
    width: calc(100% - 450px);
    padding: 12px 20px 0;
    overflow: auto;
  }

  @include e(content-header) {
    margin-bottom: 20px;

    @include m(title) {
      display: inline-block;
      padding: 0;
      margin: 0;
      color: #515a6e;
    }

    @include m(time) {
      margin-left: 20px;
    }
  }
}
</style>
