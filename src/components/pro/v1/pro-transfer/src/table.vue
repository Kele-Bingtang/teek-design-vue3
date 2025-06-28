<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { ArrowRight, ArrowLeft, Delete, Search } from "@element-plus/icons-vue";
import { TableMain } from "@/components/pro/v1/pro-table";

defineOptions({ name: "ProTableTransfer" });

const emit = defineEmits(["update:modelValue", "submit-right", "submit-left", "change"]);

interface Option {
  id?: number | string;
  [propName: string]: any;
}

interface TableTransferProps {
  width?: string | number;
  titles?: any;
  tableHeight?: string | number;
  data?: any;
  column?: any;
  columnLeft?: any;
  columnRight?: any;
  buttonTexts?: any;
  leftDefaultChecked?: any;
  rightDefaultChecked?: any;
  modelValue?: any;
  tableAttrs?: any;
  disabledLeftBtn?: boolean;
  disabledRightBtn?: boolean;
  emptyText?: string;
  rowKey?: string;
  // 数据唯一键值
  isAutoSelect?: boolean;
  // 是否自动选择
  filterable?: boolean;
  // 是否可搜索
  filterPlaceholder?: string; // 搜索框提示文字
  filterMethod?: (queryString: string, row: any) => void; // 自定义搜索方法
  showPagination?: boolean; // 是否展示分页
}

const props = withDefaults(defineProps<TableTransferProps>(), {
  width: 376, // 穿梭框宽度
  titles: ["所有", "已选"], // 自定义列表标题
  tableHeight: 217, // 表格高度
  data: [], // 数据源
  column: [], // 表头列
  columnLeft: [], // 左侧自定义列
  columnRight: [], // 右侧自定义列
  buttonTexts: ["", ""], // 自定义按钮文案
  leftDefaultChecked: [], // 初始状态下左侧列表的已勾选项的 key 数组
  rightDefaultChecked: [], // 初始状态下右侧列表的已勾选项的 key 数组
  modelValue: [], // 右侧初始值
  tableAttrs: {}, // 表格属性
  disabledLeftBtn: true, // 向左按钮是否禁用
  disabledRightBtn: true, // 向右按钮是否禁用
  rowKey: "id",
  showPagination: true,
  filterable: true,
  filterPlaceholder: "请输入",
});

// 行点击的时候也设置选中
const leftTableInstance = useTemplateRef<InstanceType<typeof TableMain>>("leftTableInstance");
const rightTableInstance = useTemplateRef<InstanceType<typeof TableMain>>("rightTableInstance");
// 已选行
const selectValueLeft = ref<Option[]>([]);
const selectValueRight = ref<Option[]>([]);
const disabledRight = ref(true);
const disabledLeft = ref(true);
const indeterminateLeft = ref(false);
const indeterminateRight = ref(false);
const leftCheckAll = ref(false);
const rightCheckAll = ref(false);

const checkTopAllLeft = () => {
  leftTableInstance.value?.table?.toggleAllSelection();
};

const checkTopAllRight = () => {
  rightTableInstance.value?.table?.toggleAllSelection();
};

const tableDataLeft = ref<object[]>([]);
const tableDataRight = ref<object[]>([]);
const queryStringLeft = ref();
const queryStringRight = ref();
const withQueryTableLeftTotal = ref(0);
const withQueryTableRightTotal = ref(0);

const getTableShowData = (
  current: number,
  pageSize: number,
  data: Object[],
  queryString: string,
  tableType: "left" | "right"
) => {
  if (queryString && typeof props.filterMethod === "function") {
    const result = data.filter((row: any) => props.filterMethod!(queryString, row));

    if (tableType === "left") withQueryTableLeftTotal.value = result.length;
    else withQueryTableRightTotal.value = result.length;

    return result.length
      ? props.showPagination
        ? result.slice((current - 1) * pageSize, current * pageSize)
        : result
      : [];
  }

  return data.length ? (props.showPagination ? data.slice((current - 1) * pageSize, current * pageSize) : data) : [];
};

const tableShowDataLeft = computed(() => {
  return getTableShowData(currentLeft.value, pageSizeLeft.value, tableDataLeft.value, queryStringLeft.value, "left");
});

// 左表格展示的数据
const tableShowDataRight = computed(() => {
  return getTableShowData(
    currentRight.value,
    pageSizeRight.value,
    tableDataRight.value,
    queryStringRight.value,
    "right"
  );
});

// 右表格展示的数据
const currentLeft = ref(1);
const pageSizeLeft = ref(10);

const changeLeft = (current: number) => {
  currentLeft.value = current;
};
const totalLeft = computed(() => {
  return queryStringLeft.value ? withQueryTableLeftTotal.value : tableDataLeft.value.length;
});

const currentRight = ref(1);
const pageSizeRight = ref(10);

const changeRight = (current: number) => {
  currentRight.value = current;
};

const totalRight = computed(() => {
  return queryStringRight.value ? withQueryTableRightTotal.value : tableDataRight.value.length;
});

const temporaryCurrentLeft = ref(1);
const temporaryCurrentRight = ref(1);

/**
 * 搜索过滤时，缓存表格当前页码，同时重置页码为1，不搜索时，重置为搜索前的页码
 * @param val 搜索过滤关键词
 * @param type 区分左右表格
 */
const queryInput = (val: string | number, type: "left" | "right") => {
  if (type === "left") {
    if (val) {
      temporaryCurrentLeft.value = currentLeft.value;
      currentLeft.value = 1;
    } else {
      currentLeft.value = temporaryCurrentLeft.value;
    }
    return;
  }
  if (val) {
    temporaryCurrentRight.value = currentRight.value;
    currentRight.value = 1;
  } else {
    currentRight.value = temporaryCurrentRight.value;
  }
};

// 设置左右两边表格数据
const setTableData = (data: any[], type: string, filterData: any[]) => {
  if (!data?.length) return;
  const arr: any = filterData?.length ? filterData : [...tableDataLeft.value, ...selectValueRight.value];
  const ids: any = arr.map((item: Option) => item[props.rowKey]);
  if (type === "right") {
    tableDataRight.value = data.filter((item: Option) => ids.includes(item[props.rowKey]));
    tableDataLeft.value = data.filter((item: Option) => !ids.includes(item[props.rowKey]));
    return;
  }
  tableDataLeft.value = data.filter((item: Option) => ids.includes(item[props.rowKey]));
  tableDataRight.value = data.filter((item: Option) => !ids.includes(item[props.rowKey]));
};

watch(
  () => props.disabledLeftBtn,
  val => {
    disabledLeft.value = val;
  },
  { deep: true, immediate: true }
);

watch(
  () => props.disabledRightBtn,
  val => {
    disabledRight.value = val;
  },
  { deep: true, immediate: true }
);

watch(
  () => [props.modelValue, props.data],
  ([modelValue, data]) => {
    const ids = modelValue.map((item: Option) => item[props.rowKey]);
    tableDataLeft.value = data.filter((item: Option) => !ids.includes(item[props.rowKey]));
    tableDataRight.value = data.filter((item: Option) => ids.includes(item[props.rowKey]));
  },
  { deep: true, immediate: true }
);

const handleRowClickLeft = (row: any) => {
  leftTableInstance.value?.$el.toggleRowSelection(row, undefined);
};

const handleRowClickRight = (row: any) => {
  if (!props.isAutoSelect) rightTableInstance.value?.$el.toggleRowSelection(row, undefined);
};

// 为选中项添加行背景色;
const tableRowClassLeft = ({ row }: { row: any }) => {
  let result: string = "";
  if (selectValueLeft.value.length) {
    selectValueLeft.value.forEach((item: Option) => {
      if (item[props.rowKey] === row[props.rowKey]) result = "highlight-row";
    });
    return result;
  }
};

const tableRowClassRight = ({ row }: { row: any }) => {
  let result: string = "";
  if (selectValueRight.value.length) {
    selectValueRight.value.forEach((item: Option) => {
      if (item[props.rowKey] === row[props.rowKey]) result = "highlight-row";
    });
    return result;
  }
};

// 选择发生变化
const selectionChangeLeft = (val: Option[]) => {
  selectValueLeft.value = val;
  if (props.isAutoSelect) submitRight();
};

const selectionChangeRight = (val: Option[]) => {
  selectValueRight.value = val;
  if (props.isAutoSelect) submitLeft();
};

// 全选
const selectAllLeft = (val: Option[]) => {
  indeterminateLeft.value = false;
  leftCheckAll.value = !!val.length;
};

const selectAllRight = (val: Option[]) => {
  indeterminateRight.value = false;
  rightCheckAll.value = !!val.length;
};

// 监听选择情况
watch(selectValueLeft, val => {
  if (val.length) {
    disabledRight.value = false;
    if (val.length === tableDataLeft.value.length) {
      leftCheckAll.value = true;
      indeterminateLeft.value = false;
    } else {
      leftCheckAll.value = false;
      indeterminateLeft.value = true;
    }
  } else {
    disabledRight.value = true;
    leftCheckAll.value = false;
    indeterminateLeft.value = false;
  }
});

watch(selectValueRight, val => {
  if (val.length) {
    disabledLeft.value = false;
    if (val.length === tableDataRight.value.length) {
      rightCheckAll.value = true;
      indeterminateRight.value = false;
    } else {
      rightCheckAll.value = false;
      indeterminateRight.value = true;
    }
  } else {
    disabledLeft.value = true;
    rightCheckAll.value = false;
    indeterminateRight.value = false;
  }
});

// 顶部右侧选取比例
const countLeft = computed(() => {
  return `${selectValueLeft.value.length}/${tableDataLeft.value.length}`;
});

const countRight = computed(() => {
  return `${selectValueRight.value.length}/${tableDataRight.value.length}`;
});

// 点击左右按钮
const submitRight = () => {
  const data = [...tableDataRight.value, ...selectValueLeft.value];
  setTableData(props.data, "right", data);
  selectValueLeft.value = [];
  emit("update:modelValue", tableDataRight.value);
  emit("change", tableDataRight.value);
  emit("submit-right");
};

const submitLeft = () => {
  const data = [...tableDataLeft.value, ...selectValueRight.value];
  setTableData(props.data, "left", data);
  selectValueRight.value = [];
  emit("update:modelValue", tableDataRight.value);
  emit("change", tableDataRight.value);
  emit("submit-left");
};

const handleCancelSelect = (row?: any) => {
  if (row && row[props.rowKey]) {
    selectValueRight.value = row;
    tableDataRight.value = tableDataRight.value.filter((item: any) => item[props.rowKey] !== row[props.rowKey]);
  } else {
    selectValueRight.value = [];
    tableDataRight.value = [];
  }
  emit("update:modelValue", tableDataRight.value);
  emit("change", tableDataRight.value);
};
</script>

<template>
  <div class="pro-transfer">
    <!-- 左侧 -->
    <div class="pro-transfer-panel" :style="{ width: `${width}px` }">
      <div class="pro-transfer-panel__header">
        <slot name="headerLeft" v-if="$slots.headerLeft"></slot>
        <el-checkbox v-else :indeterminate="indeterminateLeft" v-model="leftCheckAll" @change="checkTopAllLeft">
          {{ titles[0] }}
          <span class="proportion">{{ countLeft }}</span>
        </el-checkbox>
      </div>
      <div class="pro-transfer-panel__body" :class="!showPagination ? 'body-radius' : ''">
        <slot name="bodyLeft" v-if="$slots.bodyLeft"></slot>
        <template v-else>
          <slot name="searchLeft">
            <el-input
              v-if="filterable"
              v-model.trim="queryStringLeft"
              clearable
              :placeholder="filterPlaceholder"
              size="large"
              class="icon-search"
              :prefix-icon="Search"
              @input="(val: string | number) => queryInput(val, 'left')"
            />
          </slot>
          <TableMain
            stripe
            ref="leftTableInstance"
            v-bind="tableAttrs"
            :row-key="rowKey"
            :height="tableHeight"
            :emptyText="emptyText"
            :data="tableShowDataLeft"
            :columns="columnLeft.length ? columnLeft : column"
            :highlightCurrentRow="false"
            :row-class-name="tableRowClassLeft"
            @row-click="handleRowClickLeft"
            @selectionChange="selectionChangeLeft"
            @select-all="selectAllLeft"
          ></TableMain>
        </template>
      </div>
      <div class="pro-transfer-panel__footer">
        <slot name="footerLeft">
          <el-pagination
            v-if="showPagination"
            v-model:pageSize="pageSizeLeft"
            v-model:current-page="currentLeft"
            @current-change="changeLeft"
            :total="totalLeft"
            mode="simpleA"
            size="small"
          ></el-pagination>
        </slot>
      </div>
    </div>
    <!-- 中间箭头 -->
    <div v-if="!isAutoSelect" class="pro-transfer__buttons">
      <div class="icon-btn icon-btn-right'" :class="disabledRight ? 'is-disabled' : ''" @click="submitRight">
        <span v-if="buttonTexts[0]">{{ buttonTexts[0] }}</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
      <div class="icon-btn icon-btn-left" :class="disabledLeft ? 'is-disabled' : ''" @click="submitLeft">
        <span v-if="buttonTexts[1]">{{ buttonTexts[1] }}</span>
        <el-icon><ArrowLeft /></el-icon>
      </div>
    </div>
    <div v-else class="pro-transfer__buttons"><img class="icon" src="./icons/switch.svg" /></div>
    <!-- 右侧 -->
    <div class="pro-transfer-panel" :style="{ width: `${width}px` }">
      <div class="pro-transfer-panel__header">
        <slot name="headerRight">
          <el-checkbox
            v-if="!isAutoSelect"
            :indeterminate="indeterminateRight"
            v-model="rightCheckAll"
            @change="checkTopAllRight"
          >
            {{ titles[1] }}
            <span class="proportion">{{ countRight }}</span>
          </el-checkbox>

          <div v-else class="proportion-auto">
            <span class="title">{{ "已选（" + tableDataRight.length + ")" }}</span>
            <el-button
              type="primary"
              link
              @click="handleCancelSelect"
              style="justify-content: flex-end; font-size: 14px"
            >
              全部清除
            </el-button>
          </div>
        </slot>
      </div>
      <div class="pro-transfer-panel__body" :class="!showPagination ? 'body-radius' : ''">
        <slot name="bodyRight" v-if="$slots.bodyRight"></slot>
        <template v-else>
          <slot name="searchRight">
            <el-input
              v-if="filterable"
              v-model.trim="queryStringRight"
              clearable
              :placeholder="filterPlaceholder"
              size="large"
              class="icon-search"
              :prefix-icon="Search"
              @input="(val: string | number) => queryInput(val, 'right')"
            />
          </slot>
          <TableMain
            stripe
            ref="rightTableInstance"
            v-bind="tableAttrs"
            :row-key="rowKey"
            :height="tableHeight"
            :emptyText="emptyText"
            :data="tableShowDataRight"
            :columns="columnRight.length ? columnRight : column"
            :row-class-name="tableRowClassRight"
            :highlightCurrentRow="false"
            @row-click="handleRowClickRight"
            @selectionChange="selectionChangeRight"
            @select-all="selectAllRight"
          >
            <template v-if="isAutoSelect" #suffixColumn>
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-icon @click="handleCancelSelect(row)" style="color: #395ae3; cursor: pointer">
                    <Delete />
                  </el-icon>
                </template>
              </el-table-column>
            </template>
          </TableMain>
        </template>
      </div>
      <div class="pro-transfer-panel__footer">
        <slot name="footerRight">
          <el-pagination
            v-if="showPagination"
            v-model:pageSize="pageSizeRight"
            v-model:current-page="currentRight"
            @current-change="changeRight"
            :total="totalRight"
            mode="simpleA"
            size="small"
          ></el-pagination>
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pro-transfer {
  display: flex;

  .pro-transfer-panel {
    // 头部
    .pro-transfer-panel__header {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      padding: 0 16px;
      color: var(--pro-color-black);
      background: #f5f7fa;
      border: 1px solid var(--pro-color-regular-4);
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;

      .title {
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        color: #20222b;
      }

      .proportion-auto {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        color: #b7b9c4;

        .pro-icon {
          margin-left: 13px;
        }
      }

      .pro-checkbox {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        margin-right: 0;

        .pro-checkbox__label {
          font-size: 1rem;
          font-weight: 700;
          color: var(--pro-color-regular-9);

          span {
            position: absolute;
            top: 50%;
            right: 0;
            font-size: 1rem;
            font-weight: normal;
            color: var(--pro-color-regular-6);
            transform: translate3d(0, -50%, 0);
          }
        }
      }
    }

    .pro-transfer-panel__body {
      padding: 16px 16px 0;
      overflow: hidden;
      border-right: 1px solid var(--pro-color-regular-4);
      border-left: 1px solid var(--pro-color-regular-4);

      &::-webkit-scrollbar {
        display: none;
      }

      // 无底部内容
      &.body-radius {
        padding-bottom: 6px;
        border-bottom: 1px solid var(--pro-color-regular-4);
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
      }

      // 搜索
      .icon-search {
        margin-bottom: 10px;
      }

      .pro-input {
        width: 100%;

        .pro-input {
          width: 100%;
        }

        .pro-input__wrapper {
          height: 32px;

          .pro-input__inner {
            font-size: 1rem;
          }

          .pro-input__suffix-inner {
            .pro-icon {
              color: var(--pro-color-regular-7);
              cursor: pointer;

              &:last-child {
                display: inline-block;
              }
            }
          }
        }
      }

      // 表格
      :deep(.pro-table) {
        // margin-top: 10px;
        // 表格行
        tr {
          box-sizing: border-box;
          min-height: 36px;

          td {
            padding: 0;

            .cell {
              display: flex;
              align-items: center;
              min-height: 36px;
              font-size: 1rem;
              color: var(--pro-color-regular-9);
            }
          }
        }

        // 表头
        .pro-table__header {
          height: 36px;

          thead {
            tr {
              th {
                height: 36px;
                padding: 0 !important;
                text-align: left;
                background-color: var(--pro-color-regular-3);

                .cell {
                  font-size: 1rem;
                  font-weight: 700;
                  color: var(--pro-color-regular-9);
                }
              }
            }
          }
        }

        // 隐藏滚动条
        .pro-scrollbar__bar {
          display: none;
        }

        .pro-table__empty-text {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 115px;
          height: 100px;
          font-size: 1rem;
          line-height: 190px;
          background: url("/assets/images/noData.png") no-repeat top center;
          background-size: 88px 80px;
          transform: translate(-50%, -50%);
        }
      }
    }

    // 底部
    .pro-transfer-panel__footer {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 40px;
      padding: 0 10px;
      border: 1px solid var(--pro-color-regular-4);
      border-top: none;
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
    }
  }

  // 中间按钮
  .pro-transfer__buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 8px;

    .icon-btn {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      color: var(--pro-color-regular-9);
      cursor: pointer;
      background-color: var(--pro-color-regular-1);
      border: 1px solid var(--pro-color-regular-7);
      border-radius: 4px;

      .pro-icon {
        font-size: 14px;
      }

      &:first-child {
        margin-bottom: 8px;
      }

      &:hover {
        border-color: var(--pro-color-primary-light-7);

        .pro-icon {
          color: var(--pro-color-primary-light-7);
        }
      }

      &:active {
        border-color: var(--pro-color-primary-dark-2);

        .pro-icon {
          color: var(--pro-color-primary-dark-2);
        }
      }

      &.is-disabled {
        cursor: not-allowed;
        background-color: var(--pro-color-regular-2);
        border-color: var(--pro-color-regular-5);

        .pro-icon {
          color: var(--pro-color-regular-6);
        }
      }
    }
  }

  .pro-input .pro-input__wrapper {
    box-shadow: 0 0 0 1px var(--pro-color-regular-5) inset;
  }
}

:deep(.pro-table__body tr.highlight-row > td) {
  background-color: rgb(230 239 255) !important;
}
</style>
