<script setup lang="tsx">
import type { TabColumn } from "@/components";
import { ProTabs } from "@/components";
import Group from "./group.vue";

const userId = ref("k100338");

const activeName = ref("group");

const columns: TabColumn[] = [
  {
    prop: "group",
    label: "群组",
    el: Group,
    // 使用 computed 传响应式参数
    elProps: computed(() => ({
      userId: userId.value,
    })),
  },
  {
    prop: "role",
    label: "角色",
    lazy: true,
    render: () => <div>我是一个用 Render（TSX）渲染页面</div>,
  },
  {
    prop: "dept",
    label: "部门",
    lazy: true,
    render: () => h("div", null, "我是一个使用 h 函数渲染页面"),
  },
  {
    prop: "slot",
    label: "插槽",
    lazy: true,
  },
  {
    prop: "renderLabel",
    label: "插槽",
    lazy: true,
    render: () => <div>我是一个用 Render（TSX）渲染页面</div>,
    renderLabel: () => <div>renderLabel 渲染的标签</div>,
  },
];

const handleChangeUserId = () => {
  // 随机生成一个用户 ID
  userId.value = Math.round(Math.random() * 100) + 1024 + "";
};
</script>

<template>
  <div>
    <el-button v-if="activeName === 'group'" @click="handleChangeUserId" style="margin-bottom: 10px">
      切换用户
    </el-button>

    <ProTabs v-model="activeName" :columns card>
      <template #slot>我是一个使用插槽渲染的页面</template>
      <template #slot-label>插槽渲染的标签</template>
    </ProTabs>
  </div>
</template>
