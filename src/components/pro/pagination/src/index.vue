<!--
基于 Element Plus 的分页组件进行封装（可配置）：
  1、将当前页码、分页大小、页数选择器、总条数配置封装成一个对象，通过 v-mode 传入
  2、分页后滚动到顶部
  3、改变分页大小后自动切回第一页
  4、提供 left、right 插槽，用于自定义分页组件的左侧和右侧内容
 -->
<script lang="ts">
export const defaultPageInfo: PageInfo = {
  pageNum: 1,
  pageSizes: [10, 20, 30, 40, 50, 100, 200, 300, 400, 500],
  pageSize: 20,
};
</script>

<script setup lang="ts">
import type { PaginationEmits, PaginationProps, PageInfo } from "./types";
import { nextTick, ref, watch } from "vue";
import { ElPagination } from "element-plus";
import { useNamespace } from "@/composables";

defineOptions({ name: "Pagination" });

const ns = useNamespace("pagination");

const props = withDefaults(defineProps<PaginationProps>(), {
  autoScroll: true,
  hidden: false,
  reset: true,
  total: 0,
  align: "right",
});

const emits = defineEmits<PaginationEmits>();

const pageModel = defineModel<PageInfo>({ default: () => defaultPageInfo });
const pageInfo = ref({ ...defaultPageInfo, ...pageModel.value });

watch(
  () => pageModel.value,
  val => (pageInfo.value = { ...defaultPageInfo, ...val }),
  { deep: true }
);

/**
 * 改变分页大小事件
 */
const handleSizeChange = (pageSize: number) => {
  if (props.reset) handleCurrentChange(1);
  pageModel.value.pageSize = pageSize;
  afterChange();
  emits("sizeChange", pageSize);
};

/**
 * 改变分页页码事件
 */
const handleCurrentChange = (pageNum: number) => {
  pageModel.value.pageNum = pageNum;
  afterChange();
  emits("currentChange", pageNum);
};

/**
 * 分页改变后续操作
 */
const afterChange = async () => {
  emits("change", pageInfo.value);
  if (props.autoScroll) {
    await nextTick();

    const elTableBodyDom = document.querySelector(`${ns.elNamespace}-table__body-wrapper`);
    const elNameDom = document.querySelector(`${ns.elNamespace}-main`);
    const targetDom = elTableBodyDom || elNameDom;

    targetDom?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

defineExpose({ defaultPageInfo });
</script>

<template>
  <div :class="ns.b()">
    <slot v-if="align === 'right'" name="pagination-left"><span /></slot>

    <el-pagination
      v-if="!hidden"
      layout="total, sizes, prev, pager, next, jumper"
      background
      v-model:current-page="pageInfo.pageNum"
      v-model:page-size="pageInfo.pageSize"
      :page-sizes="pageInfo.pageSizes"
      :total
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <slot v-if="align === 'left'" name="pagination-right"><span /></slot>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
