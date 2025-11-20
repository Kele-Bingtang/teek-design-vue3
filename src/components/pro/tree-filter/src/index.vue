<script setup lang="ts">
import type { FilterEmits, TreeFilterProps } from "./types";
import { ref, watch, onBeforeMount, useTemplateRef, nextTick } from "vue";
import { ElInput, ElScrollbar, ElTree } from "element-plus";
import { More } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { isArray, isString } from "@/common/utils";

defineOptions({ name: "TreeFilter" });

const props = withDefaults(defineProps<TreeFilterProps>(), {
  data: () => [],
  requestApi: undefined,
  defaultRequestParams: () => ({}),
  requestImmediate: true,
  transformData: undefined,
  title: "",
  id: "id",
  label: "label",
  multiple: false,
  defaultValue: undefined,
  defaultFirst: false,
  showTotal: false,
  showMore: false,
  showNum: false,
  card: true,
});

const emit = defineEmits<FilterEmits>();

const ns = useNamespace("tree-filter");

const defaultProps = {
  children: "children",
  label: props.label,
};

const treeInstance = useTemplateRef<InstanceType<typeof ElTree>>("treeInstance");
const treeData = ref<Recordable[]>([]);
const treeAllData = ref<Recordable[]>([]);

// 选中的值
const selected = ref();

watch(
  () => props.defaultValue,
  () => nextTick(() => setSelected()),
  { deep: true, immediate: true }
);

watch(
  () => props.data,
  () => {
    if (props.data?.length) {
      treeData.value = props.data;
      treeAllData.value = [{ id: "", [props.label]: "全部" }, ...props.data];
    }
  },
  { deep: true, immediate: true }
);

const setSelected = () => {
  if (props.multiple) selected.value = isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue];
  else selected.value = isString(props.defaultValue) ? props.defaultValue : "";
};

/**
 * 初始化树形数据
 */
const initTreeData = async () => {
  const { data, requestApi, requestImmediate, transformData, id, label, showTotal, defaultFirst } = props;

  // 有数据就直接赋值，没有数据就执行请求函数
  if (data.length) treeData.value = treeAllData.value = data;
  else if (requestImmediate && requestApi) {
    const result = await requestApi(props.defaultRequestParams);
    // 兼容常用数据格式
    let data = result?.data || result?.list || result?.data?.list || result;
    data = transformData?.(data, result) || data;

    treeData.value = data;
    treeAllData.value = showTotal ? [{ [id]: "", [label]: "全部" }, ...data] : data;
  }

  if (defaultFirst && treeAllData.value.length) {
    nextTick(() => {
      const firstData = treeAllData.value[0];
      treeInstance.value?.setCurrentKey(firstData[id]);
      emit("change", firstData[id], firstData);
    });
  }
};

onBeforeMount(async () => {
  setSelected();
  initTreeData();
});

const filterText = ref("");

watch(filterText, val => {
  treeInstance.value?.filter(val);
});

/**
 * 过滤
 */
const filterNode = (value: string, _: Recordable, node: any) => {
  if (!value) return true;
  let parentNode = node.parent;
  let labels = [node.label];
  let level = 1;

  while (level < node.level) {
    labels = [...labels, parentNode.label];
    parentNode = parentNode.parent;
    level++;
  }
  return labels.some(label => label.indexOf(value) !== -1);
};

// 切换树节点的展开或折叠状态
const toggleTreeNodes = (isExpand: boolean) => {
  const nodes = treeInstance.value?.store.nodesMap;
  if (!nodes) return;

  Object.values(nodes).forEach((node: any) => {
    node.expanded = isExpand;
  });
};
/**
 * 单选
 */
const handleNodeClick = (data: Recordable) => {
  if (props.multiple) return;
  emit("change", data[props.id], data);
};

/**
 * 多选
 */
const handleCheckChange = () => {
  emit("change", treeInstance.value?.getCheckedKeys() || []);
};

defineExpose({ treeData, treeAllData, initTreeData });
</script>

<template>
  <div :class="[ns.b(), { [ns.join('card-minimal')]: card }]">
    <slot name="title" v-bind="{ title, num: treeData.length }">
      <div v-if="title" :class="ns.e('header')">
        <h4 class="title sle">{{ title }}</h4>
        <span v-if="showNum" class="num">{{ treeData.length }}个</span>
      </div>
    </slot>

    <div :class="ns.e('search')">
      <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
      <el-dropdown v-if="showMore" trigger="click">
        <el-icon size="20"><More /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toggleTreeNodes(true)">展开全部</el-dropdown-item>
            <el-dropdown-item @click="toggleTreeNodes(false)">折叠全部</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <el-scrollbar :style="{ height: title || $slots['title'] ? `calc(100% - 95px)` : `calc(100% - 56px)` }">
      <el-tree
        ref="treeInstance"
        default-expand-all
        :check-strictly="false"
        :expand-on-click-node="false"
        v-bind="$attrs"
        :node-key="id"
        :data="multiple ? treeData : treeAllData"
        :show-checkbox="multiple"
        :current-node-key="!multiple ? selected : ''"
        :highlight-current="!multiple"
        :check-on-click-node="multiple"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :default-checked-keys="multiple ? selected : []"
        @node-click="handleNodeClick"
        @check="handleCheckChange"
      >
        <template #default="scope">
          <span :class="`${ns.elNamespace}-tree-node__label`">
            <slot v-bind="scope">
              {{ scope.node.label }}
            </slot>
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
