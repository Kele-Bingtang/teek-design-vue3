<script setup lang="ts">
import type { FormColumn, ProFormInstance } from "@/components/pro/form";
import type { FormItemColumnProps } from "@/components/pro/form-item";
import type { TableEditProps, TableEditEmits } from "../types";
import { ref, computed, watch, useTemplateRef } from "vue";
import { setProp } from "@/components/pro/helper";
import ProForm from "@/components/pro/form";

defineOptions({ name: "TableEdit" });

const props = withDefaults(defineProps<TableEditProps>(), {
  prop: "",
  value: undefined,
});

const emits = defineEmits<TableEditEmits>();

const model = ref<Recordable>({});

const proFormInstance = useTemplateRef<ProFormInstance>("proFormInstance");

const columns = computed(() => {
  const { options } = props;
  return [{ ...props, options: options ? ref(options) : options, value: undefined, editable: true }] as FormColumn[];
});

watch(
  () => props.value,
  val => setProp(model.value, props.prop, val),
  { immediate: true }
);

const handleChange = (value: unknown, model: Recordable, column: FormItemColumnProps) => {
  emits("change", value, model, column);
};

defineExpose({ proFormInstance });
</script>

<template>
  <ProForm
    ref="proFormInstance"
    :columns
    v-model="model"
    :show-label="false"
    :show-footer="false"
    :flex-layout="false"
    :el-form-props="{
      hideRequiredAsterisk: true,
    }"
    @change="handleChange"
  />
</template>
