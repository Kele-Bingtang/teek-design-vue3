<script setup lang="ts">
import type { TableFilterProps } from "../types";
import { computed } from "vue";
import { ElPopover, ElIcon, ElButton } from "element-plus";
import { Filter } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { isEmpty, isObject } from "@/utils";
import { getProp, setProp } from "@/components/pro/helper";
import ProFormItem from "@/components/pro/form-item";

defineOptions({ name: "TableFilter" });

interface TableFilterEmits {
  // 过滤事件，返回输入的值以及 prop
  filter: [model: Recordable, filterValue: unknown, prop: string | undefined];
  // 清空事件，返回输入的 prop
  clear: [prop: string | undefined];
  // 重置所有表单事件
  reset: [];
}

const props = withDefaults(defineProps<TableFilterProps>(), {
  el: "ElInput",
  rule: "eq",
  prop: "",
  formColumn: () => ({}),
  popoverProps: () => ({}),
  filterText: "过滤",
  clearText: "清空",
  resetText: "重置",
});

const emits = defineEmits<TableFilterEmits>();

const ns = useNamespace("pro-table-filter");

const model = ref<Recordable>({});

const prop = computed(() => props.prop || props.formColumn.prop);
const elProps = computed(() => ({ ...props.formColumn.elProps, teleported: false }));

// 事件处理方法
const handleFilter = () => {
  let filterValue = model.value;
  if (isObject(model.value) && prop.value) filterValue = getProp(model.value, prop.value);
  emits("filter", model.value, filterValue, prop.value);
};

const handleClear = () => {
  if (isObject(model.value) && prop.value) setProp(model.value, prop.value, undefined);
  else model.value = {};

  handleFilter();
  emits("clear", prop.value);
};

const handleReset = () => {
  model.value = {};
  emits("reset");
};
</script>

<template>
  <el-popover
    :width="popoverProps?.width || 230"
    :trigger="popoverProps?.trigger || 'click'"
    v-bind="popoverProps"
    :popper-class="ns.b()"
  >
    <!-- 过滤图标 -->
    <template #reference>
      <slot name="filter-icon">
        <span
          @click.stop
          :class="ns.b('icon')"
          :style="{
            [ns.cssVarName('pro-table-filter-icon-color')]: isEmpty(getProp(model, prop))
              ? 'inherit'
              : `var(--${ns.elNamespace}-color-primary)`,
          }"
        >
          <ElIcon><Filter /></ElIcon>
        </span>
      </slot>
    </template>

    <!-- 过滤内容区域 -->
    <div class="filter-content">
      <ProFormItem v-model="model" v-bind="formColumn" :prop :el :show-label="false" :el-props />

      <slot name="filter-button" v-bind="{ handleFilter, handleClear, handleReset }">
        <div :class="ns.e('buttons')">
          <el-button @click="handleReset">{{ resetText }}</el-button>
          <div>
            <el-button @click="handleClear">{{ clearText }}</el-button>
            <el-button @click="handleFilter">{{ filterText }}</el-button>
          </div>
        </div>
      </slot>
    </div>
  </el-popover>
</template>

<style lang="scss">
@use "../styles/table-filter";
</style>
