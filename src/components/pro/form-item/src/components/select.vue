<script setup lang="ts">
import type { ElOptionField } from "../types";
import { ElOption, ElOptionGroup } from "element-plus";
import { FormElComponentEnum } from "../helper";

defineProps<{
  options: Recordable[];
  optionField: Required<ElOptionField>;
  el: FormElComponentEnum;
}>();
</script>

<template>
  <template v-for="col in options" :key="col[optionField.value]">
    <el-option-group v-if="col?.options?.length" :label="col[optionField.label]">
      <el-option
        v-for="option in col.options"
        :key="option[optionField.value ?? 'value']"
        :label="option[optionField.label ?? 'label']"
        :value="option[optionField.value ?? 'value'] ?? ''"
        :disabled="option[optionField.disabled ?? 'disabled']"
      />
    </el-option-group>

    <el-option
      v-else
      :label="col[optionField.label ?? 'label']"
      :value="col[optionField.value ?? 'value'] ?? ''"
      :disabled="col[optionField.disabled ?? 'disabled']"
    />
  </template>
</template>
