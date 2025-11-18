<script setup lang="ts">
import { nextTick, ref, watch, useTemplateRef } from "vue";
import { ElCheckbox, ElInput, ElTree } from "element-plus";

defineOptions({ name: "Tree" });

export interface TreeProps {
  /** 树数据 */
  data: any[];
  /** 每一个树节点 id，默认 id */
  nodeKey?: string;
  /** v-model 返回的格式，keys 返回选中的节点 nodeKey，nodes 为返回选中的节点，默认 keys */
  checkBaseValueType?: "keys" | "nodes";
  /** 初始化时存在默认选中的节点，是否展开选中节点的所有父节点，默认 false */
  expandSelected?: boolean;
  /** 是否开启工具栏，默认 false */
  checkbox?: boolean;
  /** 是否开启搜索功能，默认 false */
  search?: boolean;
  /** 是否开启全选/全不选功能，默认 false */
  select?: boolean;
}

const props = withDefaults(defineProps<TreeProps>(), {
  nodeKey: " id",
  checkBaseValueType: "keys",
  expandSelected: true,
  checkbox: false,
  search: false,
  select: true,
});

const checkedList = defineModel<any>();

const defaultExpandAll = ref(false); // 展开/折叠状态
const isSelectAll = ref(false); // 全选/全不选状态
const indeterminate = ref(false); // 处于全选和全不选期间的状态
const checkStrictly = ref(true); // 父子联动
const defaultExpandedKeys = ref<string[]>([]); // 默认展开的节点 nodeKey
const filterText = ref(""); // 搜索的文本
const treeInstance = useTemplateRef<InstanceType<typeof ElTree>>("treeInstance");

watch(defaultExpandAll, val => {
  const nodes = treeInstance.value?.store._getAllNodes();
  // true 全展开，false 全折叠
  if (val) nodes?.forEach(item => (item.expanded = true));
  else nodes?.forEach(item => (item.expanded = false));
});

watch(isSelectAll, val => {
  const treeInstanceConst = treeInstance.value;
  // true 全选，false 全不选
  if (val) {
    treeInstanceConst?.setCheckedNodes(props.data);
    checkedList.value =
      props.checkBaseValueType === "nodes" ? treeInstanceConst?.getCheckedNodes() : treeInstanceConst?.getCheckedKeys();
  } else {
    treeInstanceConst?.setCheckedNodes([]);
    checkedList.value = [];
  }
  // 关闭处于全选和全不选期间的状态
  indeterminate.value = false;
});

watch(filterText, val => {
  treeInstance.value!.filter(val);
});

// 过滤搜索条件
const filterNode = (value: string, data: Recordable) => {
  if (!value) return true;
  return data.label.includes(value);
};

const handleCheck = (_: any, selected: { checkedKeys: string[]; checkedNodes: Recordable[] }) => {
  if (props.checkBaseValueType === "nodes") checkedList.value = selected.checkedNodes;
  else checkedList.value = selected.checkedKeys;

  // 如果都没选择任何节点，则状态关闭
  if (!selected.checkedKeys?.length) {
    isSelectAll.value = false;
    indeterminate.value = false;
  } else if (selected.checkedKeys?.length === treeInstance.value?.store._getAllNodes().length) {
    // 如果选择的节点等于节点数量，则代表全选
    isSelectAll.value = true;
    indeterminate.value = false;
  } else indeterminate.value = true;
};

const setChecked = (val: any[]) => {
  // 不用 nextTick 导致获取不到 treeInstance 实例
  nextTick(() => {
    const { checkBaseValueType, expandSelected, nodeKey } = props;
    if (checkBaseValueType === "nodes") {
      treeInstance.value?.setCheckedNodes(val);
      if (expandSelected) defaultExpandedKeys.value = val?.map(item => item[nodeKey]);
    } else {
      treeInstance.value?.setCheckedKeys(val, false);
      if (expandSelected) defaultExpandedKeys.value = val;
    }
  });
};

watch(checkedList, val => val?.length && setChecked(val), { immediate: true });
</script>

<template>
  <div v-if="checkbox">
    <el-checkbox v-model="defaultExpandAll" label="展开/折叠" />
    <el-checkbox v-if="select" v-model="isSelectAll" :indeterminate="indeterminate" label="全选/全不选" />
    <el-checkbox v-if="select" v-model="checkStrictly" label="父子联动" />
  </div>
  <el-input
    v-if="search"
    v-model="filterText"
    :style="{ width: $attrs.searchWidth || '98.5%' }"
    :placeholder="($attrs.searchPlaceholder as string) || '请输入关键词进行筛选'"
  />
  <el-tree
    ref="treeInstance"
    :show-checkbox="select"
    @check="handleCheck"
    :filter-node-method="filterNode"
    :check-strictly="!checkStrictly"
    :default-expanded-keys="defaultExpandedKeys"
    v-bind="$attrs"
    :data="data"
    :nodeKey="nodeKey"
  >
    <template #default="{ node, data }">
      <slot :node="node" :data="data"></slot>
    </template>
  </el-tree>
</template>
