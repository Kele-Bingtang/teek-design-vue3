<script setup lang="ts">
import type { FilterEmits, TreeFilterProps } from "./types";
import { ref, watch, onBeforeMount } from "vue";
import { ElInput, ElScrollbar, ElTree } from "element-plus";
import { useNamespace } from "@/composables";

defineOptions({ name: "TreeFilter" });

const props = withDefaults(defineProps<TreeFilterProps>(), {
  data: () => [],
  requestApi: undefined,
  defaultRequestParams: () => ({}),
  transformData: undefined,
  title: "",
  id: "id",
  label: "label",
  multiple: false,
  defaultValue: undefined,
  enableTotal: true,
  defaultFirst: false,
});

const emit = defineEmits<FilterEmits>();

const ns = useNamespace("tree-filter");

const defaultProps = {
  children: "children",
  label: props.label,
};

const filterText = ref<string>("");
const treeInstance = useTemplateRef<InstanceType<typeof ElTree>>("treeInstance");
const treeData = ref<Recordable[]>([]);
const treeAllData = ref<Recordable[]>([]);
// 选中的值
const selected = ref();

onBeforeMount(async () => {
  const { multiple, defaultValue } = props;
  // 重新接收一下默认值
  if (multiple) selected.value = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  else selected.value = typeof defaultValue === "string" ? defaultValue : "";

  initTreeData();
});

// 初始化树形数据
const initTreeData = async () => {
  const { data, requestApi, transformData, id, label, enableTotal, defaultFirst } = props;

  // 有数据就直接赋值，没有数据就执行请求函数
  if (data.length) {
    treeData.value = data;
    treeAllData.value = data;
    return;
  }

  if (requestApi) {
    const result = await requestApi(props.defaultRequestParams);
    // 兼容常用数据格式
    let data = result?.data || result?.list || result?.data?.list || result;
    data = transformData?.(data, result) || data;

    treeData.value = data;
    treeAllData.value = enableTotal ? [{ [id]: "", [label]: "全部" }, ...data] : data;
  }

  if (defaultFirst && treeAllData.value?.length) {
    nextTick(() => {
      const firstData = treeAllData.value[0];
      treeInstance.value?.setCurrentKey(firstData[id]);
      emit("change", firstData[id], firstData);
    });
  }
};

watch(filterText, val => {
  treeInstance.value!.filter(val);
});

// 过滤
const filterNode = (value: string, data: Recordable, node: any) => {
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

// 单选
const handleNodeClick = (data: Recordable) => {
  if (props.multiple) return;
  emit("change", data[props.id], data);
};

// 多选
const handleCheckChange = () => {
  emit("change", treeInstance.value?.getCheckedKeys());
};

defineExpose({ treeData, treeAllData, initTreeData });
</script>

<template>
  <div :class="[ns.b(), ns.join('card-minimal')]">
    <slot name="title">
      <h4 :class="`${ns.e('title')} sle`" v-if="title">{{ title }}</h4>
    </slot>
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
    <el-scrollbar :style="{ height: title ? `calc(100% - 95px)` : `calc(100% - 56px)` }">
      <el-tree
        ref="treeInstance"
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
