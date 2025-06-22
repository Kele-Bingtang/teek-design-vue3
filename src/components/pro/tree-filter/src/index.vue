<script setup lang="ts">
import { ref, watch, onBeforeMount } from "vue";
import { ElInput, ElScrollbar, ElTree } from "element-plus";
import { useNamespace } from "@/composables";
import type { TreeFilter } from "..";

defineOptions({ name: "TreeFilter" });

const ns = useNamespace("tree-filter");

export type TreeFilterInstance = InstanceType<typeof TreeFilter>;

interface TreeFilterProps {
  requestApi?: (data?: any) => Promise<any>; // 请求分类数据的 api ==> 非必传
  data?: Record<string, any>[]; // 分类数据，如果有分类数据，则不会执行 api 请求 ==> 非必传
  title?: string; // treeFilter 标题 ==> 非必传
  id?: string; // 选择的id ==> 非必传，默认为 “id”
  label?: string; // 显示的label ==> 非必传，默认为 “label”
  multiple?: boolean; // 是否为多选 ==> 非必传，默认为 false
  defaultValue?: any; // 默认选中的值 ==> 非必传
  enableTotal?: boolean; // 是否显示【全部】选项
  defaultFirst?: boolean; // 是否默认选中第一个选项
}
const props = withDefaults(defineProps<TreeFilterProps>(), {
  id: "id",
  label: "label",
  multiple: false,
  enableTotal: true,
});

const defaultProps = {
  children: "children",
  label: props.label,
};

const filterText = ref<string>("");
const treeRef = useTemplateRef<InstanceType<typeof ElTree>>("treeRef");
const treeData = ref<Record<string, any>[]>([]);
const treeAllData = ref<Record<string, any>[]>([]);
// 选中的值
const selected = ref();

onBeforeMount(async () => {
  // 重新接收一下默认值
  if (props.multiple) selected.value = Array.isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue];
  else selected.value = typeof props.defaultValue === "string" ? props.defaultValue : "";

  initTreeData();
});

// 初始化树形数据
const initTreeData = async () => {
  // 有数据就直接赋值，没有数据就执行请求函数
  if (props.data?.length) {
    treeData.value = props.data;
    treeAllData.value = props.data;
    return;
  }
  const { data } = await props.requestApi!();
  treeData.value = data;
  treeAllData.value = props.enableTotal ? [{ [props.id]: "", [props.label]: "全部" }, ...data] : data;

  if (props.defaultFirst && treeAllData.value?.length) {
    nextTick(() => {
      const firstData = treeAllData.value[0];
      treeRef.value?.setCurrentKey(firstData[props.id]);
      emit("change", firstData[props.id], firstData);
    });
  }
};

watch(filterText, val => {
  treeRef.value!.filter(val);
});

// 过滤
const filterNode = (value: string, data: Record<string, any>, node: any) => {
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

type FilterEmits = {
  change: [value: any, data?: any];
};
const emit = defineEmits<FilterEmits>();

// 单选
const handleNodeClick = (data: Record<string, any>) => {
  if (props.multiple) return;
  emit("change", data[props.id], data);
};

// 多选
const handleCheckChange = () => {
  emit("change", treeRef.value?.getCheckedKeys());
};

// 暴露给父组件使用
defineExpose({ treeData, treeAllData, initTreeData });
</script>

<template>
  <div :class="[ns.b(), 'tk-card']">
    <slot name="title">
      <h4 :class="`${ns.e('title')} sle`" v-if="title">{{ title }}</h4>
    </slot>
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
    <el-scrollbar :style="{ height: title ? `calc(100% - 95px)` : `calc(100% - 56px)` }">
      <el-tree
        ref="treeRef"
        default-expand-all
        :node-key="id"
        :data="multiple ? treeData : treeAllData"
        :show-checkbox="multiple"
        :check-strictly="false"
        :current-node-key="!multiple ? selected : ''"
        :highlight-current="!multiple"
        :expand-on-click-node="false"
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
