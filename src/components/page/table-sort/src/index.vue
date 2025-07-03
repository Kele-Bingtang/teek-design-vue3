<script setup lang="ts">
import { isNumber } from "@/common/utils";
import { ElTable, type TableInstance } from "element-plus";
import { useSlots, ref, computed } from "vue";
import TableSort from "./index.vue";

defineOptions({ name: "TableSort" });

export type TableSortInstance = InstanceType<typeof TableSort>;

const slots = useSlots();

interface TableSortProps {
  data: any[];
  loading?: boolean;
}
const props = withDefaults(defineProps<TableSortProps>(), {
  loading: false,
});

const sortOrder = ref<any[]>([]);
const tableData = computed(() => props.data);

const handleHeaderCellClassName = ({ column }: any) => {
  sortOrder.value.forEach(element => {
    if (element.prop === column.property) column.order = element.order;
  });
  return "";
};

/**
 * 依次点击排序按钮，记录排序顺序 orderArray
 * @param tableDataParams 排序顺序 [{prop:prop,order:order}]
 * order: ascending、descending、null
 */
const handleSort = ({ prop, order }: any) => {
  // 参与排序
  if (order) {
    let propIsExist = false;
    sortOrder.value.forEach(element => {
      if (element.prop === prop) {
        element.order = order;
        propIsExist = true;
      }
    });
    // 添加排序
    if (!propIsExist) {
      sortOrder.value.push({
        prop: prop,
        order: order,
      });
    }
  } else {
    // 更新排序
    let orderIndex = 0;
    sortOrder.value.forEach((element, index) => {
      if (element.prop === prop) orderIndex = index;
    });
    sortOrder.value.splice(orderIndex, 1);
  }
  const array = sortOrder.value.slice();
  const sameList = [0, tableData.value.length - 1];
  // 进行多项排序
  multiSort(tableData.value, sameList, array);
};

/**
 * 多项排序
 */
const multiSort = (data: any, sortSameArr: number[], orderArray: any) => {
  if (orderArray.length === 0) return 0;
  let flag = false; // cell 值是否与上一行相同的标志，用来记录上下限
  let preVal = ""; // 上次遍历 prop 对应的 val
  const sort = orderArray[0]; // sort 是本次排序列和对应的排序顺序：{order: ,prop: }
  orderArray.shift();
  const sortOrder = sort.order;
  const sortProp = sort.prop;
  let newSortSameArr: number[] = [];
  singleSort(data, sortProp, sortOrder, sortSameArr);
  for (let i = sortSameArr[0] + 1; i < sortSameArr[1] + 1; i++) {
    // 记录相同 prop 的上限
    preVal = data[i - 1][sortProp];
    if (data[i][sortProp] === preVal) {
      if (!flag) {
        newSortSameArr = [];
        newSortSameArr.push(i - 1);
        flag = true;
      }
    } else {
      // 记录相同 prop 的下限
      if (flag) {
        newSortSameArr.push(i - 1);
        flag = false;
        multiSort(data, newSortSameArr, orderArray.slice());
      }
    }
  }
  if (newSortSameArr.length === 1) {
    newSortSameArr.push(sortSameArr[1]);
    flag = false;
    multiSort(data, newSortSameArr, orderArray.slice());
  }
};

/**
 * 对表格某些行的单项排序
 */
const singleSort = (data: any, sortProp: string, sortOrder: string, sortSameArr: any) => {
  let newOrderArr = data.slice(sortSameArr[0], sortSameArr[1] + 1);
  newOrderArr = newOrderArr.sort((x: Record<string, string>, y: Record<string, string>) => {
    // 数字
    if (isNumber(x[sortProp] + "")) {
      return sortOrder === "descending"
        ? parseInt(y[sortProp]) - parseInt(x[sortProp])
        : parseInt(x[sortProp]) - parseInt(y[sortProp]);
    }
    // 字符串
    return sortOrder === "descending" ? y[sortProp].localeCompare(x[sortProp]) : x[sortProp].localeCompare(y[sortProp]);
  });
  if (newOrderArr.length) {
    data.splice(sortSameArr[0], sortSameArr[1] - sortSameArr[0] + 1, ...newOrderArr); // 在val[0] 位置添加新数组，长度为 val[1] - val[0] + 1
  }
};

const elTableInstance = useTemplateRef<TableInstance>("elTableInstance");

defineExpose({
  handleHeaderCellClassName,
  handleSort,
  el: elTableInstance,
});
</script>

<template>
  <el-table
    v-if="!slots.custom"
    ref="elTableInstance"
    :data="tableData"
    :header-cell-class-name="handleHeaderCellClassName"
    @sort-change="handleSort"
    v-loading="loading"
    v-bind="$attrs"
  >
    <slot></slot>
  </el-table>

  <slot
    v-else-if="!slots.default"
    name="custom"
    :sortChange="handleSort"
    :headerCellClassName="handleHeaderCellClassName"
  ></slot>
</template>
