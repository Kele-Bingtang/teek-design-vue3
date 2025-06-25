<script setup lang="ts">
import type { ElOptionField } from "../types";
import { computed } from "vue";
import { ElCheckbox, ElCheckboxButton } from "element-plus";
import { FormElComponentEnum } from "../helper";

const props = defineProps<{
  options: Recordable[];
  optionField: Required<ElOptionField>;
  el: FormElComponentEnum;
}>();

// 计算要渲染的组件类型
const checkboxComponent = computed(() =>
  props.el === FormElComponentEnum.EL_CHECKBOX_BUTTON ? ElCheckboxButton : ElCheckbox
);
</script>

<template>
  <component
    v-for="option in options"
    :is="checkboxComponent"
    :key="option[optionField.value]"
    :disabled="option[optionField.disabled]"
    :label="option[optionField.label]"
    :value="option[optionField.value] ?? ''"
  />
</template>
