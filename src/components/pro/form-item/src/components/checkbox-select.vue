<script setup lang="ts">
import type { CheckboxValueType } from "element-plus";
import type { ElOptionField, ElOption } from "../types";
import { computed, ref, watch } from "vue";
import { ElCheckbox, ElCheckboxGroup, ElRadio, ElRadioGroup } from "element-plus";

defineOptions({ name: "CheckBoxSelect" });

export interface CheckBoxSelectProps {
  /** 字典数据 */
  options: ElOption[];
  /** 自定义字典的 key */
  optionField?: ElOptionField;
  /** 是否多选 */
  multiple?: boolean;
}

const props = withDefaults(defineProps<CheckBoxSelectProps>(), {
  optionField: () => ({ label: "label", value: "value", disabled: "disabled" }),
  multiple: false,
});

const componentIs = computed(() => {
  return props.multiple
    ? {
        parent: ElCheckboxGroup,
        children: ElCheckbox,
      }
    : {
        parent: ElRadioGroup,
        children: ElRadio,
      };
});

const checkAll = ref(false);
// 设置不确定状态，仅负责样式控制
const isIndeterminate = ref(false);
const checkedValue = defineModel<CheckboxValueType | CheckboxValueType[]>({ default: undefined });

// 全选
const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedValue.value = val ? props.options.map(item => item[props.optionField?.value || "value"]) : [];
  isIndeterminate.value = false;
};

/**
 *值改变
 */
const handleCheckedChange = (value: CheckboxValueType | CheckboxValueType[]) => {
  // 单选不执行后续操作
  if (!props.multiple) return;

  const checkedCount = (value as string[] | number[]).length;
  checkAll.value = checkedCount === props.options.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.options.length;
};

watch(
  () => checkedValue.value,
  newValue => {
    if (newValue) handleCheckedChange(newValue);
    else {
      checkAll.value = false;
      isIndeterminate.value = false;
    }
  }
);
</script>

<template>
  <div>
    <el-checkbox v-if="multiple" v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
      全选
    </el-checkbox>

    <Component
      style="overflow: hidden auto"
      :is="componentIs.parent"
      v-model="checkedValue as CheckboxValueType"
      @change="handleCheckedChange"
    >
      <Component
        :is="componentIs.children"
        style="width: 100%"
        v-for="col in props.options"
        :key="col[optionField.value ?? 'value']"
        :label="col[optionField.label ?? 'label']"
        :value="col[optionField.value ?? 'value']"
        :disabled="col[optionField.disabled ?? 'disabled']"
      ></Component>
    </Component>
  </div>
</template>
