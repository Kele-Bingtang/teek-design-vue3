<script setup lang="ts">
import type { ElOptionField, ElOption } from "../types";
import type { CheckboxValueType } from "element-plus";
import { computed, ref, watch } from "vue";
import { ElCheckbox } from "element-plus";

defineOptions({ name: "CheckBoxSelect" });

export interface CheckBoxSelectProps {
  options: ElOption[]; // 字典数据
  optionField: Required<ElOptionField>; // 自定义字典的 key
  multiple?: boolean; // 是否多选
}

const props = withDefaults(defineProps<CheckBoxSelectProps>(), { multiple: false });

const ComponentIs = computed(() => {
  return props.multiple ? "checkbox" : "radio";
});

const checkAll = ref(false);
// 设置不确定状态，仅负责样式控制
const isIndeterminate = ref(false);
const checkedValue = defineModel<string[] | number[] | string[] | number | boolean>();

// 全选
const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedValue.value = val ? props.options.map(item => item[props.optionField.value]) : [];
  isIndeterminate.value = false;
};

// 值改变
const handleCheckedChange = (value: string[] | number[] | string[] | number | boolean) => {
  // 单选不执行后续操作
  if (!props.multiple) return;

  const checkedCount = (value as string[] | number[]).length;
  checkAll.value = checkedCount === props.options.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.options.length;
};

watch(
  () => checkedValue.value,
  newValue => {
    if (newValue) {
      handleCheckedChange(newValue);
    } else {
      checkAll.value = false;
      isIndeterminate.value = false;
    }
  }
);
</script>

<template>
  <div style="display: flex; flex-direction: column; max-height: 500px">
    <el-checkbox v-if="multiple" v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
      全部
    </el-checkbox>
    <Component
      style="overflow: hidden auto"
      :is="`el-${ComponentIs}-group`"
      v-model="checkedValue"
      @change="handleCheckedChange"
    >
      <Component
        :is="`el-${ComponentIs}`"
        style="width: 100%"
        v-for="col in props.options"
        :key="col[optionField.value]"
        :label="col[optionField.label]"
        :value="col[optionField.value]"
        :disabled="col[optionField.disabled]"
      ></Component>
    </Component>
  </div>
</template>
