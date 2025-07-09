<script setup lang="ts">
import { useNamespace } from "@/composables";

defineOptions({ name: "SimpleNotebook" });

const ns = useNamespace("simple-notebook");

const value = ref("");

const content = ref<{ title: string; isDone: boolean }[]>([]);

const isViewDone = ref(false);

const notDoneContent = computed(() => content.value.filter(item => !item.isDone));

const doneContent = computed(() => content.value.filter(item => item.isDone));

const handleBlur = () => {
  if (!value.value.trim()) return;

  content.value.push({
    title: value.value,
    isDone: false,
  });

  value.value = "";
};

const handleViewDone = () => {
  isViewDone.value = !isViewDone.value;
};
</script>

<template>
  <div :class="ns.b()" class="tk-card-minimal flx-column">
    <div class="flx-align-center-between" :class="ns.e('header')">
      <h2>简易笔记</h2>
      <el-button type="primary" size="small" link @click="handleViewDone">
        {{ isViewDone ? "返回" : "已完成" }}
      </el-button>
    </div>

    <template v-if="!isViewDone">
      <el-input
        v-model="value"
        type="textarea"
        :rows="3"
        :maxlength="1000"
        show-word-limit
        placeholder="随手记一记..."
        @blur="handleBlur"
      />

      <div v-if="notDoneContent.length" :class="ns.e('content')">
        <div v-for="item in notDoneContent" :key="item.title" class="flx-align-center gap-10 sle">
          <el-checkbox v-model="item.isDone" />
          <div class="title">{{ item.title }}</div>
        </div>
      </div>

      <el-empty v-else description="暂无内容，快来记一记吧" />
    </template>

    <template v-else>
      <div v-if="doneContent.length" :class="ns.e('content')">
        <div v-for="item in doneContent" :key="item.title" class="flx-align-center gap-10 sle">
          <el-checkbox v-model="item.isDone" />
          <div class="title">{{ item.title }}</div>
        </div>
      </div>

      <el-empty v-else description="暂无内容" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;
@use "@styles/mixins/function" as *;

@include b(simple-notebook) {
  min-height: 360px;
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

    .title {
      font-size: 14px;
    }
  }
}
</style>
