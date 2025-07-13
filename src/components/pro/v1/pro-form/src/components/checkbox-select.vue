<script setup lang="ts">
import type { CheckboxValueType } from "element-plus";
import type { FormFieldNamesProps } from "../interface";
import { computed, ref, watch } from "vue";
import { ElCheckbox } from "element-plus";

defineOptions({ name: "CheckBoxSelect" });

export interface CheckBoxSelectType {
  enum: any[]; // 字典数据
  fieldNames: FormFieldNamesProps; // 自定义字典的 key
  multiple?: boolean; // 是否多选
}

const props = withDefaults(defineProps<CheckBoxSelectType>(), { multiple: false });

const ComponentIs = computed(() => {
  return props.multiple ? "checkbox" : "radio";
});

const checkAll = ref(false);
// 设置不确定状态，仅负责样式控制
const isIndeterminate = ref(false);
const checkedValue = defineModel<string[] | number[] | string[] | number | boolean>();

// 全选
const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedValue.value = val ? props.enum.map(item => item[props.fieldNames.value]) : [];
  isIndeterminate.value = false;
};

// 值改变
const handleCheckedChange = (value: string[] | number[] | string[] | number | boolean) => {
  if (!props.multiple) return; // 单选不执行后续操作
  const checkedCount = (value as string[] | number[]).length;
  checkAll.value = checkedCount === props.enum.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.enum.length;
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
        v-for="col in props.enum"
        :key="col[fieldNames.value]"
        :label="col[fieldNames.label]"
        :value="col[fieldNames.value]"
        :disabled="col[fieldNames.disabled || 'disabled']"
      ></Component>
    </Component>
  </div>
</template>
