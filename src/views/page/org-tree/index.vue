<script setup lang="ts" name="OrgTreeDemo">
import { ElMessage } from "element-plus";
import { useNamespace } from "@/composables";

const ns = useNamespace("org-tree-demo");

const treeRef = useTemplateRef<any>("treeRef");

const data = ref({
  id: 1,
  title: "公司名",
  label: "KBT 科技有限公司",
  children: [
    {
      id: 2,
      pid: 1,
      title: "核心部门",
      label: "产品研发部",
      style: { color: "#fff", background: "#108ffe" },
      children: [
        { id: 6, pid: 2, label: "禁止编辑节点", disabled: true },
        { id: 8, pid: 2, label: "禁止拖拽节点", noDragging: true },
        { id: 10, pid: 2, label: "测试" },
      ],
    },
    {
      id: 3,
      pid: 1,
      title: "用户群",
      label: "客服部",
      children: [
        { id: 11, pid: 3, label: "客服一部" },
        { id: 12, pid: 3, label: "客服二部" },
      ],
    },
    { id: 4, pid: 1, title: "业务", label: "业务部" },
  ],
});

const scalable = ref(true);
const horizontal = ref(true);
const collapsable = ref(true);
const draggable = ref(true);
const nodeDraggable = ref(true);
const onlyOneNode = ref(true);
const cloneNodeDrag = ref(true);
const disabled = ref(false);
const center = ref(true);

const style = ref({
  background: "#fff",
  color: "#5e6d82",
});
const keyword = ref("");

const defineMenus = (e: MouseEvent, node: any) => {
  if (node.disabled) {
    return [
      { name: "复制节点", command: "copy" },
      { name: "自定义", command: "define" },
    ];
  } else {
    return [
      { name: "复制节点", command: "copy" },
      { name: "新建节点", command: "add" },
      { name: "编辑节点", command: "edit" },
      { name: "删除节点", command: "delete" },
      { name: "自定义", command: "define" },
    ];
  }
};

const filter = () => {
  treeRef.value?.filter(keyword.value);
};
// 对树节点进行筛选时执行的方法，返回 true 表示这个节点的子节点可以显示，返回 false 则表示这个节点的所有子节点会被隐藏
const filterNodeMethod = (value: string, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

/**
 * node：当前节点信息
 * command：当前右键点击的菜单 command
 */
const onMenus = ({ node, command }: { node: any; command: string }) => {
  console.log(node);
  if (command === "copy") {
    ElMessage.success("复制成功！");
  } else if (command === "define") {
    ElMessage.info("自定义右键菜单");
  }
};

const onNodeClick = (e: MouseEvent, data: any) => {
  ElMessage.info(data.label);
};
</script>

<template>
  <el-space fill alignment="normal" :class="ns.b()">
    <el-card shadow="never" class="tk-card-minimal">
      <template #header>
        <el-link
          href="https://sangtian152.github.io/vue3-tree-org/"
          target="_blank"
          underline="never"
          style="font-size: 20px"
        >
          vue3-tree-org 组件
        </el-link>
      </template>

      <div style="display: flex; padding: 10px">
        <div style="margin-right: 10px">
          <el-switch v-model="horizontal"></el-switch>
          横向
        </div>
        <div style="margin-right: 10px">
          <el-switch v-model="center"></el-switch>
          居中
        </div>
        <div style="margin-right: 10px">
          <el-switch v-model="scalable"></el-switch>
          可缩放
        </div>
        <div style="margin-right: 10px">
          <el-switch v-model="draggable"></el-switch>
          可拖拽
        </div>
        <div style="margin-right: 10px">
          <el-switch v-model="collapsable"></el-switch>
          可收起
        </div>
        <div style="margin-right: 10px">
          <el-switch v-model="disabled"></el-switch>
          禁止编辑
        </div>
        <div style="margin-right: 10px">
          <el-switch v-model="onlyOneNode"></el-switch>
          仅拖动当前节点
        </div>
        <div style="margin-right: 10px">
          <el-switch v-model="cloneNodeDrag"></el-switch>
          拖动节点副本
        </div>
        <div style="padding: 0 10px 10px">
          背景色：
          <el-color-picker v-model="style.background" size="small"></el-color-picker>
          &nbsp; 文字颜色：
          <el-color-picker v-model="style.color" size="small"></el-color-picker>
          &nbsp;
        </div>
      </div>
      <div style="padding: 8px 15px">
        <span>搜索：</span>
        <el-input
          v-model="keyword"
          placeholder="请输入搜索内容"
          @keydown.enter="filter"
          style="display: inline-block; width: 11%"
        />
      </div>

      <div style="height: 600px">
        <vue3TreeOrg
          ref="treeRef"
          :data="data"
          :center="center"
          :horizontal="horizontal"
          :collapsable="collapsable"
          :disabled="disabled"
          :label-style="style"
          :node-draggable="nodeDraggable"
          :scalable="scalable"
          :draggable="draggable"
          :only-one-node="onlyOneNode"
          :clone-node-drag="cloneNodeDrag"
          :draggable-on-node="true"
          :default-expand-level="1"
          :filter-node-method="filterNodeMethod"
          :define-menus="defineMenus"
          @on-contextmenu="onMenus"
          @on-node-click="onNodeClick"
        >
          <!-- 自定义节点内容 -->
          <template #default="{ node }">
            <div class="tree-org-node__text node-label">
              <div class="custom-content">{{ node.$$data.title }}</div>
              <div>{{ node.label }}</div>
            </div>
          </template>
          <!-- 自定义展开按钮 -->
          <template #expand="{ node }">
            <div>{{ node.children.length }}</div>
          </template>
        </vue3TreeOrg>
      </div>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(org-tree-demo) {
  width: 100%;
  height: 100%;

  .tree-org-node__text {
    font-size: 14px;
    text-align: left;

    .custom-content {
      padding-bottom: 8px;
      margin-bottom: 8px;
      border-bottom: 1px solid currentcolor;
    }
  }
}
</style>
