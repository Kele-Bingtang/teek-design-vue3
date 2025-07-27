<script setup lang="ts">
import { ref } from "vue";
import { useNamespace } from "@/composables";
import { Tooltip, PointTag } from "@/components";
import { trainingData, internalAnnouncementData, changeNotificationData } from "./data";

defineOptions({ name: "BulletinBoard" });

interface BulletinBoardItem {
  title: string;
  tag: string;
  hasRead: boolean;
}

const ns = useNamespace("bulletin-board");

const activeTab = ref("training");

const limit = 7;

const tabs = ref<{ label: string; value: string; data: BulletinBoardItem[] }[]>([
  {
    label: "宣传培训",
    value: "training",
    data: trainingData.slice(0, limit),
  },
  {
    label: "内部公告",
    value: "internalAnnouncement",
    data: internalAnnouncementData.slice(0, limit),
  },
  {
    label: "变更通知",
    value: "changeNotification",
    data: changeNotificationData.slice(0, limit),
  },
]);

const handleClick = (item: BulletinBoardItem) => {
  item.hasRead = true;
  console.log(item);
};

const handleMore = () => {
  console.log("跳转更多公告栏");
};
</script>

<template>
  <div :class="ns.b()" class="tk-card-minimal">
    <div class="flx-align-center-between" :class="ns.e('header')">
      <h2>公告栏</h2>
      <el-button size="small" link @click="handleMore">更多 ></el-button>
    </div>

    <el-tabs v-model="activeTab" tab-position="top">
      <el-tab-pane v-for="tab in tabs" :key="tab.value" :label="tab.label" :name="tab.value">
        <template v-if="tab.data.length">
          <div
            v-for="item in tab.data"
            :key="item.title"
            @click="handleClick(item)"
            :class="[ns.e('item'), ns.has('read', item.hasRead)]"
            class="flx-align-center gap-10 sle"
          >
            <PointTag v-if="!item.hasRead" type="danger" :size="6" :offset="0" />
            <el-tag type="info">{{ item.tag }}</el-tag>
            <Tooltip placement="top">
              <span class="title">{{ item.title }}</span>
            </Tooltip>
          </div>
        </template>

        <el-empty v-else description="暂无内容" :image-size="100" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(bulletin-board) {
  min-height: 360px;
  @include e(header) {
    h2 {
      font-size: 20px;
      font-weight: 600;
    }
  }

  @include e(item) {
    margin-bottom: 10px;
    cursor: pointer;
    border-radius: 4px;
    transition: all cssVarEl(transition-duration-fast) cssVar(easing);

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      color: cssVar("color-primary");
      background-color: cssVar("gray-100");

      .el-tag {
        color: cssVar("color-primary");
        background-color: cssVar("gray-200");
      }
    }

    .title {
      font-size: 14px;
      font-weight: 500;
    }

    @include has(read) {
      color: cssVar("text-gray-500");

      .el-tag {
        color: cssVar("text-gray-500");
      }
    }
  }
}
</style>
