<script setup lang="ts">
import { message } from "@/common/utils";
import { Tooltip } from "@/components";
import { useNamespace } from "@/composables";
import { Delete, Back, View, Flag } from "@element-plus/icons-vue";

defineOptions({ name: "SimpleNotebook" });

interface NotebookItem {
  title: string;
  isDone: boolean;
  isFollow: boolean;
  showFlag: boolean;
}

const ns = useNamespace("simple-notebook");

const value = ref("");

const content = ref<NotebookItem[]>([]);
const isViewDone = ref(false);
const isFocus = ref(false);

const notDoneContent = computed(() => content.value.filter(item => !item.isDone));

const doneContent = computed(() => content.value.filter(item => item.isDone));

const handleBlur = () => {
  isFocus.value = false;
  if (!value.value.trim()) return;

  content.value.push({
    title: value.value,
    isDone: false,
    isFollow: false,
    showFlag: false,
  });

  value.value = "";
};

const handleViewDone = () => {
  isViewDone.value = !isViewDone.value;
};

const handleClear = () => {
  content.value = [];
};

const handleFlag = (item: NotebookItem) => {
  message.success(item.isFollow ? "已取消关注" : "已关注");
  item.isFollow = !item.isFollow;
};
</script>

<template>
  <div :class="ns.b()" class="tk-card-minimal flx-column">
    <div class="flx-align-center-between" :class="ns.e('header')">
      <h2>简易笔记</h2>
      <div>
        <el-button v-if="isViewDone && doneContent.length" type="primary" link @click="handleClear" :icon="Delete">
          清空
        </el-button>
        <el-button type="primary" link @click="handleViewDone" :icon="isViewDone ? Back : View">
          {{ isViewDone ? "返回" : "已完成" }}
        </el-button>
      </div>
    </div>

    <template v-if="!isViewDone">
      <el-input
        v-model="value"
        type="textarea"
        :rows="isFocus ? 12 : 3"
        :maxlength="1000"
        show-word-limit
        placeholder="随手记一记..."
        @blur="handleBlur"
        @focus="isFocus = true"
      />

      <div v-if="notDoneContent.length" :class="ns.e('content')">
        <div
          v-for="item in notDoneContent"
          :key="item.title"
          @mouseenter="item.showFlag = true"
          @mouseleave="item.showFlag = false"
          class="item flx-align-center-between"
        >
          <div class="item-content flx-align-center gap-10">
            <el-checkbox v-model="item.isDone" />
            <Tooltip>
              <span class="title">{{ item.title }}</span>
            </Tooltip>
          </div>
          <Icon
            v-show="(item.showFlag && !item.isDone) || item.isFollow"
            :icon="Flag"
            :class="ns.is('active', item.isFollow)"
            @click="handleFlag(item)"
          />
        </div>
      </div>

      <el-empty v-else-if="!isFocus" description="暂无内容，快来记一记吧" :image-size="100" />
    </template>

    <template v-else>
      <div v-if="doneContent.length" :class="ns.e('content')">
        <div v-for="item in doneContent" :key="item.title" class="item flx-align-center gap-10 sle">
          <el-checkbox v-model="item.isDone" />
          <div class="title">{{ item.title }}</div>
        </div>
      </div>

      <el-empty v-else description="暂无内容" :image-size="100" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(simple-notebook) {
  height: 360px;
  overflow: hidden;

  @include e(header) {
    margin-bottom: 16px;

    h2 {
      font-size: 20px;
      font-weight: 600;
    }
  }

  @include e(content) {
    flex: 1;
    margin-top: 16px;
    overflow: auto;

    .item-content {
      flex: 1;
      width: calc(100% - 20px);
    }

    .item {
      cursor: pointer;

      &:hover {
        background-color: cssVar("gray-100");
      }
    }

    .title {
      font-size: 14px;
    }
  }

  .tk-icon {
    cursor: pointer;

    @include is(active) {
      color: cssVar("color-primary");
    }
  }
}
</style>
